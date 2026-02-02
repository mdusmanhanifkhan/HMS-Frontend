import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Button from "../../../components/button/Button"
import Loading from "../../../components/loading/Loading"
import TextArea from "../../../components/input/TextArea"

interface Option {
  id: number
  name: string
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

interface Distributor {
  id: number
  name: string
  contactPerson: string
  phone: string
  mobile: string
  addressLine1: string
  addressLine2: string
  city: string
  country: string
}

interface PO {
  id: number
  poNo: string
  poDate: string
  distributor: Distributor
  status: "OPEN" | "APPROVED" | "CANCELLED" | string
  paymentType: string
  netAmount: number
  remarks: string
  items: POItem[]
}

const POApprovalDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const API_BASE = import.meta.env.VITE_API_BASE_URL
  const token = localStorage.getItem("token")

  const [po, setPo] = useState<PO | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [remarks, setRemarks] = useState("")

  // Fetch PO by ID
  const fetchPO = async () => {
    if (!token) return setError("Authentication token missing")
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/api/po/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error("Failed to fetch PO")
      const data = await res.json()
      setPo(data)
      setRemarks(data.remarks || "")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPO()
  }, [id])

  // Handle approve
  const handleApprove = async () => {
    if (!token || !po) return
    try {
      const res = await fetch(`${API_BASE}/api/po/${po.id}/approve`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ approvedBy: 1, remarks }),
      })
      if (!res.ok) throw new Error("Failed to approve PO")
      navigate(-1) // go back to PO list after approval
    } catch (err: unknown) {
      console.error(err)
      setError(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  // Handle cancel
  const handleCancel = () => navigate(-1)

  if (loading) return <Loading />
  if (error) return <div className="text-red-500">{error}</div>
  if (!po) return <div>No PO found</div>

  return (
    <div className="max-w-5xl p-4 space-y-6">
      <h2 className="text-2xl font-semibold">PO Details - {po.poNo}</h2>

      {/* Distributor Info */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg shadow-sm">
        <div>
          <strong>Distributor Name:</strong> {po.distributor.name}
        </div>
        <div>
          <strong>Contact Person:</strong> {po.distributor.contactPerson}
        </div>
        <div>
          <strong>PO No:</strong> {po.poNo}
        </div>
        <div>
          <strong>PO Date:</strong> {new Date(po.poDate).toLocaleDateString()}
        </div>
        <div>
          <strong>Status:</strong> {po.status}
        </div>
        <div>
          <strong>Payment Type:</strong> {po.paymentType}
        </div>
        <div>
          <strong>Net Amount:</strong> PKR {po.netAmount.toFixed(2)}
        </div>
      </div>

      {/* PO Items */}
      <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
        <h3 className="font-semibold mb-2">Items</h3>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Medicine</th>
              <th className="border px-4 py-2">Qty</th>
              <th className="border px-4 py-2">Rate</th>
              <th className="border px-4 py-2">Tax %</th>
              <th className="border px-4 py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {po.items.map((item) => (
              <tr key={item.id}>
                <td className="border px-4 py-2">{item.medicine?.name || "N/A"}</td>
                <td className="border px-4 py-2">{item.orderedQty}</td>
                <td className="border px-4 py-2">{item.rate}</td>
                <td className="border px-4 py-2">{item.taxPercent ?? 0}</td>
                <td className="border px-4 py-2">{item.totalAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Remarks */}
      <div>
        <strong>Remarks:</strong>
        <TextArea
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Enter remarks"
          className="mt-2 w-full"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-4">
        <Button
          onClick={handleApprove}
          className="bg-green-500 hover:bg-green-600"
        >
          Approve
        </Button>
        <Button
          onClick={handleCancel}
          className="bg-red-500 hover:bg-red-600"
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}

export default POApprovalDetail
