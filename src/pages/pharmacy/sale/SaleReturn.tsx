import { useState } from 'react'
import { Label } from '../../../components/input/Label'
import { GroupInput } from '../../../components/input/GroupInput'
import { Input } from '../../../components/input/Input'
import Button from '../../../components/button/Button'
import TextArea from '../../../components/input/TextArea'

const API_BASE = import.meta.env.VITE_API_BASE_URL
const token = localStorage.getItem('token')

type SaleItem = {
  id: number
  variantId: number
  medicineName: string
  batchNo: string
  stockQty: number
  qty: number
  saleRate: number
  total: number
}
type ApiSaleItem = {
  id: number
  variantId: number
  medicineName: string
  batchNo: string
  stockQty: number
  qty: number
  saleRate: number
  total: number
}
export default function SaleReturn() {
  const [saleNo, setSaleNo] = useState('')
  const [items, setItems] = useState<SaleItem[]>([])
  const [reason, setReason] = useState('')
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)
  const [loading, setLoading] = useState(false)

  /* ================= FETCH SALE ITEMS BY SALE NO ================= */
  const fetchSaleItems = async () => {
    if (!saleNo) {
      setMessage({ type: 'error', text: 'Enter sale number first' })
      return
    }
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch(`${API_BASE}/api/sale/${saleNo}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      console.log(json.data.items)
      if (!res.ok) {
        setMessage({ type: 'error', text: json.message || 'Sale not found' })
      } else {
        // Map sale items to state
        const saleItems: SaleItem[] = json.data.items.map((i: ApiSaleItem) => ({
          id: i.id,
          variantId: i.variantId,
          medicineName: i.medicineName, // ✅ use directly
          batchNo: i.batchNo,
          stockQty: i.stockQty, // already provided by backend
          qty: i.qty, // default return qty
          saleRate: i.saleRate,
          total: i.total,
        }))
        setItems(saleItems)
      }
    } catch (err) {
      console.error(err)
      setMessage({ type: 'error', text: 'Network error' })
    } finally {
      setLoading(false)
    }
  }

  /* ================= UPDATE RETURN QUANTITY ================= */
  const updateItemQty = (index: number, qty: number) => {
    const data = [...items]
    if (qty > data[index].stockQty) {
      setMessage({
        type: 'error',
        text: `Cannot return more than sold quantity (${data[index].stockQty})`,
      })
      return
    }
    data[index].qty = qty
    data[index].total = qty * data[index].saleRate
    setItems(data)
  }

  const removeItem = (index: number) => {
    const data = [...items]
    data.splice(index, 1)
    setItems(data)
  }

  const totalRefund = items.reduce((sum, i) => sum + i.total, 0)

  /* ================= SUBMIT SALE RETURN ================= */
  const handleSubmit = async () => {
    if (!saleNo) {
      setMessage({ type: 'error', text: 'Sale number required' })
      return
    }
    if (!items.length) {
      setMessage({ type: 'error', text: 'No items to return' })
      return
    }

    setLoading(true)
    setMessage(null)

    const payload = {
      saleId: saleNo,
      reason,
      items: items.map((i) => ({
        saleItemId: i.id,
        returnQty: i.qty,
      })),
    }

    try {
      const res = await fetch(`${API_BASE}/api/sale-returns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) {
        setMessage({
          type: 'error',
          text: json.message || 'Failed to process return',
        })
      } else {
        setMessage({
          type: 'success',
          text: 'Sale return processed successfully!',
        })
        setItems([])
        setSaleNo('')
        setReason('')
      }
    } catch (err) {
      console.error(err)
      setMessage({ type: 'error', text: 'Network error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-[1400px] p-6 space-y-6">
      <h2 className="text-2xl font-bold border-b pb-2 mb-4">Sale Return</h2>

      {/* Sale No Input */}
      <div className="flex gap-2">
        <GroupInput>
          <Label>Sale Receipt No</Label>
          <Input
            value={saleNo}
            onChange={(e) => setSaleNo(e.target.value)}
            placeholder="Enter Sale No"
          />
        </GroupInput>
        <Button
          type="button"
          onClick={fetchSaleItems}
          className="bg-blue-500 hover:bg-blue-600 mt-6"
        >
          {loading ? 'Loading...' : 'Fetch Items'}
        </Button>
      </div>

      {/* Sale Items Table */}
      {items.length > 0 && (
        <div className="overflow-x-auto border rounded-lg shadow-sm">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="p-2 border">#</th>
                <th className="p-2 border">Medicine</th>
                <th className="p-2 border">Batch</th>
                <th className="p-2 border">Sold Qty</th>
                <th className="p-2 border">Return Qty</th>
                <th className="p-2 border">Rate</th>
                <th className="p-2 border">Total</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((i, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="p-2 border text-center">{idx + 1}</td>
                  <td className="p-2 border">{i.medicineName}</td>
                  <td className="p-2 border">{i.batchNo}</td>
                  <td className="p-2 border text-center">{i.stockQty}</td>
                  <td className="p-2 border">
                    <Input
                      type="number"
                      min={0}
                      max={i.stockQty}
                      value={i.qty}
                      onChange={(e) =>
                        updateItemQty(idx, Number(e.target.value))
                      }
                    />
                  </td>
                  <td className="p-2 border text-right">{i.saleRate}</td>
                  <td className="p-2 border text-right">
                    {i.total.toFixed(2)}
                  </td>
                  <td className="p-2 border text-center">
                    <Button
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="p-3 flex justify-end font-bold text-lg">
            Total Refund: {totalRefund.toFixed(2)}
          </div>
        </div>
      )}

      {/* Reason */}
      <GroupInput>
        <Label>Reason for Return</Label>
        <TextArea value={reason} onChange={(e) => setReason(e.target.value)} />
      </GroupInput>

      {/* Messages */}
      {message && (
        <div
          className={`p-2 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
        >
          {message.text}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600"
        >
          {loading ? 'Processing...' : 'Submit Return'}
        </Button>
        <Button
          type="reset"
          onClick={() => window.location.reload()}
          className="bg-gray-300 hover:bg-gray-400"
        >
          Clear
        </Button>
      </div>
    </div>
  )
}
