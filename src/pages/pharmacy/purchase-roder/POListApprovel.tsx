import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Loading from '../../../components/loading/Loading'
import Button from '../../../components/button/Button'
import { routePaths } from '../../../constants/routePaths'

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
const POListApprovel = () => {
  const [pos, setPos] = useState<PO[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const API_BASE = import.meta.env.VITE_API_BASE_URL
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

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

  /* -------------------- Navigation on Approve -------------------- */
  const handleApprove = (poId: number) => {
    navigate(`${routePaths.PURCHASE_ORDER_APPROVEL}/${poId}`)
  }

  /* -------------------- WhatsApp Handler -------------------- */
  //   const handleSendWhatsapp = (pdfUrl: string, phone: string) => {
  //     // 1️⃣ Trigger PDF download
  //     const link = document.createElement('a')
  //     link.href = pdfUrl
  //     link.download = pdfUrl.split('/').pop() || 'PO.pdf'
  //     document.body.appendChild(link)
  //     link.click()
  //     document.body.removeChild(link)

  //     // 2️⃣ Open WhatsApp Web with pre-filled message
  //     const message = encodeURIComponent(
  //       `Dear Sir/Madam, please find attached Purchase Order. Download here: ${pdfUrl}`
  //     )
  //     const phoneClean = phone.replace(/[^0-9]/g, '') // remove symbols/spaces
  //     window.open(`https://wa.me/${phoneClean}?text=${message}`, '_blank')
  //   }

  /* -------------------- Helper: Status Badge -------------------- */
  const renderStatus = (status: PO['status']) => {
    const colors: Record<string, string> = {
      DRAFT: 'bg-purple-500',
      OPEN: 'bg-blue-500',
      APPROVED: 'bg-yellow-100',
      CANCELLED: 'bg-red',
      PAID: 'bg-green',
      APPROVED_AND_FORWARD_TO_ACCOUNTS: 'bg-gray-200',
      RECEIVED:"bg-teal-500"
    }
    return (
      <span
        className={`px-2 py-1 rounded-full text-white text-sm font-semibold ${
          colors[status] || 'bg-gray-500'
        }`}
      >
        {status}
      </span>
    )
  }
  const handleDownloadPDF = async (pdfUrl: string, fileName: string) => {
    try {
      const fullUrl = `${API_BASE}${pdfUrl}` // full HTTP path
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

  /* -------------------- Render -------------------- */
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center w-full border-b pb-3">
        <p className="text-xl font-semibold">Purchase Orders Approval</p>
        <Button asLink to={routePaths.ADD_PURCHASE_ORDER}>
          + Create PO
        </Button>
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
                <td colSpan={8} className="py-4 text-center">
                  <Loading />
                </td>
              </tr>
            )}

            {/* Error */}
            {!loading && error && (
              <tr>
                <td colSpan={8} className="py-4 text-center text-red-500">
                  {error}
                </td>
              </tr>
            )}

            {/* Empty */}
            {!loading && !error && pos.length === 0 && (
              <tr>
                <td colSpan={8} className="py-6 text-center">
                  No POs found.
                </td>
              </tr>
            )}

            {/* POs */}
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
                  <td className="px-6 py-4">Rs {po.netAmount.toFixed(2)}</td>
                  <td className="px-6 py-4">{renderStatus(po.status)}</td>
                  <td className="px-6 py-4 flex gap-2">
                    {/* Approve button */}
                    {!po?.pdfUrl && (
                      <Button onClick={() => handleApprove(po.id)}>
                        <svg
                          className="w-[18px] h-[18px] text-white group-hover:text-dark"
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <use href="/assets/svg/edit-icon.svg#edit-icon" />
                        </svg>
                      </Button>
                    )}

                    {/* WhatsApp button */}
                    {/* WhatsApp / Download button */}
                    {po?.pdfUrl && (
                      <Button
                        onClick={() =>
                          handleDownloadPDF(po.pdfUrl!, `PO-${po.poNo}.pdf`)
                        }
                        className="p-2 rounded-md bg-green-500 text-white flex items-center gap-1 transition"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="-4 0 40 40"
                          fill="none"
                          className="w-[18px] h-[18px] text-white group-hover:text-dark"
                        >
                          <use href="/assets/svg/pdf-icon.svg#pdf-icon" />
                        </svg>
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default POListApprovel
