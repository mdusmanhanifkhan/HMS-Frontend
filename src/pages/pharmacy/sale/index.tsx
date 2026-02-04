import { useState, useEffect } from 'react'
import { Label } from '../../../components/input/Label'
import { GroupInput } from '../../../components/input/GroupInput'
import { Input } from '../../../components/input/Input'
import Button from '../../../components/button/Button'
import TextArea from '../../../components/input/TextArea'
import Dropdown from '../../../components/input/Dropdown'

const API_BASE = import.meta.env.VITE_API_BASE_URL
const token = localStorage.getItem('token')

/* ================= TYPES ================= */
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

type DropdownOption = {
  id: number | string
  name: string
}

type UpdateField = 'medicine' | 'batch' | 'qty' | 'price'

type UpdateValue = DropdownOption | number


/* ================= COMPONENT ================= */
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
  const addRow = () => setItems([...items, { medicineId: 0, medicineName: '', batch: '', stockQty: 0, qty: 1, price: 0, total: 0 }])
  const removeRow = (index: number) => { const data = [...items]; data.splice(index, 1); setItems(data) }

const updateItem = (
  index: number,
  field: UpdateField,
  value: UpdateValue
) => {
  const data = [...items]
  const item = { ...data[index] }

  if (field === 'medicine' && typeof value !== 'number') {
    const stockItem = stocks.find(
      s => s.medicine.id === value.id
    )

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
      s =>
        s.medicine.id === item.medicineId &&
        s.batchNo === value.name
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

  /* ================= SAVE & PRINT ================= */
  const handleSavePrint = async () => {
    if (!customerName) { setMessage({ type: 'error', text: 'Customer name required' }); return }
    if (items.some(i => i.medicineId === 0 || i.batch === '' || i.qty <= 0)) {
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
      items: items.map(i => ({
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
    } finally { setLoading(false) }
  }

  return (
    <form className="flex flex-col gap-6">
      <h2 className="text-xl font-semibold">Sales Invoice</h2>

      <div className="grid grid-cols-4 gap-4 max-w-[1100px]">
        <GroupInput>
          <Label>Customer Name</Label>
          <Input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Walk-in / Customer Name" />
        </GroupInput>

        <GroupInput>
          <Label>Payment Mode</Label>
          <Input value={paymentMode} onChange={e => setPaymentMode(e.target.value)} />
        </GroupInput>

        <GroupInput className="col-span-full">
          <Label>Remarks</Label>
          <TextArea value={remarks} onChange={e => setRemarks(e.target.value)} />
        </GroupInput>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th>#</th>
              <th>Medicine</th>
              <th>Batch</th>
              <th>Stock</th>
              <th>Qty</th>
              <th>Sale Price</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>
                  <Dropdown
                    options={Array.from(new Set(stocks.map(s => ({ id: s.medicine.id, name: s.medicine.name }))))}
                    selected={i.medicineId ? { id: i.medicineId, name: i.medicineName } : null}
                    onSelect={opt => updateItem(idx, 'medicine', opt)}
                  />
                </td>

                <td>
                  <Dropdown
                    options={stocks.filter(s => s.medicine.id === i.medicineId).map(s => ({ id: s.batchNo, name: s.batchNo }))}
                    selected={i.batch ? { id: i.batch, name: i.batch } : null}
                    onSelect={opt => updateItem(idx, 'batch', opt)}
                  />
                </td>

                <td>{i.stockQty}</td>
                <td>
                  <Input type="number" min={1} value={i.qty} onChange={e => updateItem(idx, 'qty', Number(e.target.value))} />
                </td>
                <td>{i.price}</td>
                <td>{i.total.toFixed(2)}</td>
                <td>
                  <Button type="button" onClick={() => removeRow(idx)}>Remove</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-3">
          <Button type="button" onClick={addRow}>+ Add Medicine</Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 max-w-[600px] self-end">
        <GroupInput>
          <Label>Sub Total</Label>
          <Input disabled value={subTotal.toFixed(2)} />
        </GroupInput>

        <GroupInput>
          <Label>Invoice Discount</Label>
          <Input value={totalDiscount} type="number" onChange={e => setTotalDiscount(Number(e.target.value))} />
        </GroupInput>

        <GroupInput>
          <Label>Net Total</Label>
          <Input disabled value={netTotal.toFixed(2)} />
        </GroupInput>
      </div>

      {message && <div className={`p-2 ${message.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>{message.text}</div>}

      <div className="flex gap-4">
        <Button type="button" onClick={handleSavePrint} disabled={loading}>{loading ? 'Saving...' : 'Save & Print'}</Button>
        <Button type="reset" onClick={() => window.location.reload()}>Clear</Button>
      </div>
    </form>
  )
}
