import { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
import Loading from '../../../components/loading/Loading'
import Button from '../../../components/button/Button'
// import { routePaths } from '../../../constants/routePaths'

/* -------------------- Types -------------------- */
interface Option {
  id: number
  name: string
  phone?: string
}

interface POItem {
  id: number
  medicineId: number
  orderedQty: number
  rate: number
  discountPercent?: number
  taxPercent?: number
  totalAmount: number
  medicine?: Option
}

interface PO {
  id: number
  poNo: string
  poDate: string
  supplier: Option
  status: 'OPEN' | 'APPROVED' | 'CANCELLED' | string
  paymentType: string
  netAmount: number
  approvedBy?: number | null
  approvedAt?: string | null
  pdfUrl?: string | null
  items: POItem[]
}

/* -------------------- Component -------------------- */

const SendToSupplier = () => {
  const [pos, setPos] = useState<PO[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const API_BASE = import.meta.env.VITE_API_BASE_URL
  const token = localStorage.getItem('token')
  // const navigate = useNavigate()

  /* -------------------- Fetch POs -------------------- */

  const fetchPOs = async () => {
    if (!token) return setError('Authentication token missing')

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${API_BASE}/api/get-all-pos`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) throw new Error('Failed to fetch POs')

      const data = await res.json()
      setPos(Array.isArray(data?.data) ? data.data : [])
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPOs()
  }, [token])

  /* -------------------- Navigation -------------------- */

  // const handleApprove = (poId: number) => {
  //   navigate(`${routePaths.PURCHASE_ORDER_APPROVEL}/${poId}`)
  // }

  /* -------------------- Download PDF -------------------- */

  const handleDownloadPDF = async (pdfUrl: string, fileName: string) => {
    try {
      const fullUrl = `${API_BASE}${pdfUrl}`

      const response = await fetch(fullUrl)

      if (!response.ok) throw new Error('Failed to fetch PDF')

      const blob = await response.blob()

      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = fileName

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error(err)
      alert('Failed to download PDF')
    }
  }

  /* -------------------- WhatsApp -------------------- */

  const handleSendWhatsapp = (pdfUrl: string, phone?: string) => {
    if (!phone) {
      alert('Supplier phone number missing')
      return
    }

    const phoneClean = phone.replace(/[^0-9]/g, '')

    const message = encodeURIComponent(
      `Dear Supplier,

Please find attached Purchase Order.

Download PDF:
${API_BASE}${pdfUrl}`
    )

    window.open(`https://wa.me/${phoneClean}?text=${message}`, '_blank')
  }

  /* -------------------- Email -------------------- */

  const handleSendEmail = (pdfUrl: string, poNo: string) => {
    const subject = encodeURIComponent(`Purchase Order ${poNo}`)

    const body = encodeURIComponent(
      `Dear Supplier,

Please find attached Purchase Order.

Download PDF:
${API_BASE}${pdfUrl}`
    )

    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  /* -------------------- Status Badge -------------------- */

  const renderStatus = (status: PO['status']) => {
    const colors: Record<string, string> = {
      DRAFT: 'bg-purple-500',
      OPEN: 'bg-blue-500',
      APPROVED: 'bg-yellow-100',
      CANCELLED: 'bg-red-500',
      PAID: 'bg-green-500',
      APPROVED_AND_FORWARD_TO_ACCOUNTS: 'bg-gray-500',
      RECEIVED:"bg-teal-500"
    }

    return (
      <span
        className={`px-2 py-1 rounded-full text-white text-xs font-semibold ${
          colors[status] || 'bg-gray-500'
        }`}
      >
        {status}
      </span>
    )
  }

  /* -------------------- UI -------------------- */

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}

      <div className="flex justify-between items-center w-full border-b pb-3">
        <p className="text-xl font-semibold">Send To Supplier</p>
      </div>

      {/* Table */}

      <div className="relative overflow-x-auto shadow-lg rounded-lg">

        <table className="w-full text-sm text-left">

          <thead className="text-xs text-white uppercase bg-dark">

            <tr>
              <th className="px-6 py-4">PO No</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Distributor</th>
              <th className="px-6 py-4">Payment Type</th>
              <th className="px-6 py-4">Net Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Action</th>
            </tr>

          </thead>

          <tbody>

            {/* Loading */}

            {loading && (
              <tr>
                <td colSpan={7} className="py-4 text-center">
                  <Loading />
                </td>
              </tr>
            )}

            {/* Error */}

            {!loading && error && (
              <tr>
                <td colSpan={7} className="py-4 text-center text-red-500">
                  {error}
                </td>
              </tr>
            )}

            {/* Empty */}

            {!loading && !error && pos.length === 0 && (
              <tr>
                <td colSpan={7} className="py-6 text-center">
                  No POs found.
                </td>
              </tr>
            )}

            {/* Rows */}

            {!loading &&
              pos.map((po) => (
                <tr
                  key={po.id}
                  className="bg-[#DFDEDE] border-b border-gray-200"
                >

                  <td className="px-6 py-4">{po.poNo}</td>

                  <td className="px-6 py-4">
                    {new Date(po.poDate).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4">{po.supplier.name}</td>

                  <td className="px-6 py-4">{po.paymentType}</td>

                  <td className="px-6 py-4">
                    Rs {po.netAmount.toFixed(2)}
                  </td>

                  <td className="px-6 py-4">
                    {renderStatus(po.status)}
                  </td>

                  <td className="px-6 py-4 flex gap-2">

                    {/* Approve */}

                    {/* {po?.pdfUrl && ( */}
                      <>

                        {/* Download */}

                        <Button
                          onClick={() =>
                            handleDownloadPDF(
                              po.pdfUrl!,
                              `PO-${po.poNo}.pdf`
                            )
                          }
                          className="bg-red-500 text-white"
                        >

                          <svg
                            viewBox="-4 0 40 40"
                            className="w-[18px] h-[18px]"
                          >
                            <use href="/assets/svg/pdf-icon.svg#pdf-icon" />
                          </svg>

                        </Button>

                        {/* WhatsApp */}

                        <Button
                          onClick={() =>
                            handleSendWhatsapp(
                              po.pdfUrl!,
                              po.supplier.phone
                            )
                          }
                          className="bg-green-500 text-white"
                        >

                          <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-[18px] h-[18px]"
                          >
                            <path d="M20.52 3.48A11.9 11.9 0 0012.05 0C5.42 0 .04 5.38.04 12c0 2.11.55 4.17 1.6 5.99L0 24l6.18-1.62A11.94 11.94 0 0012.05 24c6.63 0 12.01-5.38 12.01-12 0-3.2-1.25-6.21-3.54-8.52z" />
                          </svg>

                        </Button>

                        {/* Email */}

                        <Button
                          onClick={() =>
                            handleSendEmail(po.pdfUrl!, po.poNo)
                          }
                          className="bg-blue-500 text-white"
                        >

                          <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-[18px] h-[18px]"
                          >
                            <path d="M20 4H4a2 2 0 00-2 2v.01L12 13l10-6.99V6a2 2 0 00-2-2z" />
                          </svg>

                        </Button>

                      </>
                    {/* )} */}

                  </td>

                </tr>
              ))}

          </tbody>

        </table>

      </div>

    </div>
  )
}

export default SendToSupplier