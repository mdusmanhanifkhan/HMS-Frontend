import { useState, useEffect } from 'react'
import { Label } from '../../../components/input/Label'
import { GroupInput } from '../../../components/input/GroupInput'
import { Input } from '../../../components/input/Input'
import Button from '../../../components/button/Button'
import TextArea from '../../../components/input/TextArea'
import Dropdown from '../../../components/input/Dropdown'

const API_BASE = import.meta.env.VITE_API_BASE_URL
const token = localStorage.getItem('token')

type Stock = {
  medicine: { id: number; name: string }
  batchNo: string
  rate: number
  balanceQty: number
}

type Item = {
  medicineId: number
  medicineName: string
  batch: string
  stockQty: number
  qty: number
  price: number
  total: number
}

type DropdownOption = { id: number | string; name: string }
type UpdateField = 'medicine' | 'batch' | 'qty' | 'price'
type UpdateValue = DropdownOption | number

export default function SalesInvoice() {
  const [stocks, setStocks] = useState<Stock[]>([])
  const [items, setItems] = useState<Item[]>([
    { medicineId: 0, medicineName: '', batch: '', stockQty: 0, qty: 1, price: 0, total: 0 },
  ])
  const [customerName, setCustomerName] = useState('')
  const [paymentMode, setPaymentMode] = useState('CASH')
  const [remarks, setRemarks] = useState('')
  const [totalDiscount, setTotalDiscount] = useState(0)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [loading, setLoading] = useState(false)

  /* ================= FETCH STOCK ================= */
  useEffect(() => {
    const fetchStock = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/stock-list`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const json = await res.json()
        if (json.success) setStocks(json.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchStock()
  }, [])

  /* ================= ROW ACTIONS ================= */
  const addRow = () =>
    setItems([...items, { medicineId: 0, medicineName: '', batch: '', stockQty: 0, qty: 1, price: 0, total: 0 }])
  const removeRow = (index: number) => {
    const data = [...items]
    data.splice(index, 1)
    setItems(data)
  }

  const updateItem = (index: number, field: UpdateField, value: UpdateValue) => {
    const data = [...items]
    const item = { ...data[index] }

    if (field === 'medicine' && typeof value !== 'number') {
      const stockItem = stocks.find((s) => s.medicine.id === value.id)
      if (stockItem) {
        item.medicineId = stockItem.medicine.id
        item.medicineName = stockItem.medicine.name
        item.batch = ''
        item.stockQty = 0
        item.price = 0
        item.total = 0
      }
    }

    if (field === 'batch' && typeof value !== 'number') {
      const stockItem = stocks.find(
        (s) => s.medicine.id === item.medicineId && s.batchNo === value.name
      )
      if (stockItem) {
        item.batch = stockItem.batchNo
        item.stockQty = stockItem.balanceQty
        item.price = stockItem.rate
        item.total = item.qty * item.price
      }
    }

    if (field === 'qty' && typeof value === 'number') {
      item.qty = value
      item.total = item.qty * item.price
    }

    if (field === 'price' && typeof value === 'number') {
      item.price = value
      item.total = item.qty * item.price
    }

    data[index] = item
    setItems(data)
  }

  const subTotal = items.reduce((sum, i) => sum + i.total, 0)
  const netTotal = subTotal - totalDiscount

  const handleSavePrint = async () => {
    if (!customerName) {
      setMessage({ type: 'error', text: 'Customer name required' })
      return
    }
    if (items.some((i) => i.medicineId === 0 || i.batch === '' || i.qty <= 0)) {
      setMessage({ type: 'error', text: 'Please fill all item details correctly' })
      return
    }

    setLoading(true)
    setMessage(null)

    const payload = {
      saleNo: `SALE-${Date.now()}`,
      saleDate: new Date(),
      customerName,
      paymentMode,
      totalDiscount,
      taxPercent: 0,
      items: items.map((i) => ({
        medicineId: i.medicineId,
        batchNo: i.batch,
        expiryDate: new Date(),
        quantity: i.qty,
        saleRate: i.price,
        discountPercent: 0,
        taxPercent: 0,
      })),
    }

    try {
      const res = await fetch(`${API_BASE}/api/sale`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) {
        setMessage({ type: 'error', text: json.message || 'Failed to save sale' })
      } else {
        setMessage({ type: 'success', text: 'Sale saved successfully!' })
        window.print()
        setItems([{ medicineId: 0, medicineName: '', batch: '', stockQty: 0, qty: 1, price: 0, total: 0 }])
        setCustomerName('')
        setTotalDiscount(0)
      }
    } catch (err) {
      console.error(err)
      setMessage({ type: 'error', text: 'Network/server error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-[1400px] p-6 space-y-6">
      <h2 className="text-2xl font-bold border-b pb-2 mb-4">Sales Invoice</h2>

      {/* Customer & Payment Info */}
      <div className="grid grid-cols-4 gap-4">
        <GroupInput className="col-span-2">
          <Label>Customer Name</Label>
          <Input
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Walk-in / Customer Name"
          />
        </GroupInput>

        <GroupInput className="col-span-1">
          <Label>Payment Mode</Label>
          <Input value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} />
        </GroupInput>

        <GroupInput className="col-span-4">
          <Label>Remarks</Label>
          <TextArea value={remarks} onChange={(e) => setRemarks(e.target.value)} />
        </GroupInput>
      </div>

      {/* Items Table */}
      <div className="overflow-x-auto border rounded-lg shadow-sm">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="p-2 border">#</th>
              <th className="p-2 border">Medicine</th>
              <th className="p-2 border">Batch</th>
              <th className="p-2 border">Stock</th>
              <th className="p-2 border">Qty</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="p-2 border text-center">{idx + 1}</td>
                <td className="p-2 border">
                  <Dropdown
                    options={Array.from(
                      new Set(stocks.map((s) => ({ id: s.medicine.id, name: s.medicine.name })))
                    )}
                    selected={i.medicineId ? { id: i.medicineId, name: i.medicineName } : null}
                    onSelect={(opt) => updateItem(idx, 'medicine', opt)}
                  />
                </td>
                <td className="p-2 border">
                  <Dropdown
                    options={stocks
                      .filter((s) => s.medicine.id === i.medicineId)
                      .map((s) => ({ id: s.batchNo, name: s.batchNo }))}
                    selected={i.batch ? { id: i.batch, name: i.batch } : null}
                    onSelect={(opt) => updateItem(idx, 'batch', opt)}
                  />
                </td>
                <td className="p-2 border text-center">{i.stockQty}</td>
                <td className="p-2 border">
                  <Input
                    type="number"
                    min={1}
                    value={i.qty}
                    onChange={(e) => updateItem(idx, 'qty', Number(e.target.value))}
                  />
                </td>
                <td className="p-2 border text-right">{i.price.toFixed(2)}</td>
                <td className="p-2 border text-right">{i.total.toFixed(2)}</td>
                <td className="p-2 border text-center">
                  <Button type="button" onClick={() => removeRow(idx)} className="bg-red-500 hover:bg-red-600">
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="p-3 flex justify-end">
          <Button type="button" onClick={addRow} className="bg-green-500 hover:bg-green-600">
            + Add Medicine
          </Button>
        </div>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-3 gap-4 max-w-md ml-auto">
        <GroupInput>
          <Label>Sub Total</Label>
          <Input disabled value={subTotal.toFixed(2)} />
        </GroupInput>

        <GroupInput>
          <Label>Discount</Label>
          <Input
            type="number"
            value={totalDiscount}
            onChange={(e) => setTotalDiscount(Number(e.target.value))}
          />
        </GroupInput>

        <GroupInput>
          <Label>Net Total</Label>
          <Input disabled value={netTotal.toFixed(2)} className="font-bold text-lg bg-yellow-50" />
        </GroupInput>
      </div>

      {/* Messages */}
      {message && (
        <div
          className={`p-2 rounded ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          onClick={handleSavePrint}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600"
        >
          {loading ? 'Saving...' : 'Save & Print'}
        </Button>
        <Button type="reset" onClick={() => window.location.reload()} className="bg-gray-300 hover:bg-gray-400">
          Clear
        </Button>
      </div>
    </div>
  )
}
