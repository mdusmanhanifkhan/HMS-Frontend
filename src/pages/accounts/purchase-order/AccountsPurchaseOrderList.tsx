import { useEffect, useState } from 'react'
import Loading from '../../../components/loading/Loading'
import Button from '../../../components/button/Button'
import { routePaths } from '../../../constants/routePaths'
import { useNavigate } from 'react-router-dom'

interface Supplier {
  id: number
  name: string
  contactPerson?: string
  phone?: string
  email?: string
  addressLine1?: string
  city?: string
  country?: string
}

interface POItem {
  id: number
  poId: number
  medicineId: number
  orderedQty: number
  rate: number
  totalAmount: number
}

interface PurchaseOrder {
  id: number
  poNo: string
  poDate: string
  distributorId: number
  supplier?: Supplier | null
  status: string
  totalAmount: number
  items: POItem[]
  remarks?: string
  createdAt: string
  updatedAt: string
}

const AccountsPurchaseOrderList = () => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const API_BASE = import.meta.env.VITE_API_BASE_URL
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPOs = async () => {
      if (!token) {
        setError('Authentication token missing')
        return
      }

      try {
        setLoading(true)
        const res = await fetch(`${API_BASE}/api/po-status`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) {
          const errData = await res.json()
          throw new Error(errData.message || 'Failed to fetch POs')
        }
        const data = await res.json()
        setPurchaseOrders(data.data || [])
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message)
        else setError('Something went wrong')
      } finally {
        setLoading(false)
      }
    }

    fetchPOs()
  }, [token])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'text-yellow'
      case 'PROCESSING':
        return 'text-blue-500'
      case 'APPROVED':
        return 'text-yellow-100'
      case 'REJECTED':
        return 'text-red'
      case 'APPROVED_AND_FORWARD_TO_ACCOUNTS':
        return 'text-yellow-100'
      default:
        return 'text-gray-200'
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center w-full border-b pb-3">
        <p className="text-xl font-semibold">Purchase Orders</p>
        <Button asLink={true} to={routePaths.ADD_PURCHASE_ORDER}>
          + Create PO
        </Button>
      </div>

      {/* Table */}
      <div className="relative overflow-x-auto shadow-lg rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-white uppercase bg-dark">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">PO No</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Distributor</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Total Amount</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} className="py-4">
                  <div className="flex justify-center">
                    <Loading />
                  </div>
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={8} className="py-4 text-center text-red-500">
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && purchaseOrders.length === 0 && (
              <tr>
                <td colSpan={8} className="py-6 text-center">
                  No POs found.
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              purchaseOrders.map((po) => (
                <tr
                  key={po.id}
                  className="bg-[#DFDEDE] border-b border-gray-200"
                >
                  <td className="px-6 py-4">{po.id}</td>
                  <td className="px-6 py-4">{po.poNo}</td>
                  <td className="px-6 py-4">
                    {new Date(po.poDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">{po.supplier?.name || 'N/A'}</td>
                  <td
                    className={`px-6 py-4 text-sm font-semibold ${getStatusColor(po.status)}`}
                  >
                    {po.status === 'APPROVED' ||
                    po.status === 'APPROVED_AND_FORWARD_TO_ACCOUNTS'
                      ? 'PENDING'
                      : po.status}
                  </td>
                  <td className="px-6 py-4">Rs. {po.totalAmount}</td>

                  <td className="px-6 py-4">
                    {po?.status == 'PAID' ? (
                      <p className="text-green">Successfully Paid</p>
                    ) : (
                      <Button
                        onClick={() =>
                          navigate(
                            `${routePaths.ACCOUNTS_PO_APPROVEL}/${po.id}`
                          )
                        }
                        title="Action"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          viewBox="0 0 24 24"
                        >
                          <path d="M15 12H9m12 0a9 9 0 1 0-18 0 9 9 0 0 0 18 0z" />
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

export default AccountsPurchaseOrderList
