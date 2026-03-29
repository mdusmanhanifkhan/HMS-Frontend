import { useState, useEffect } from 'react'
import { Label } from '../../../components/input/Label'
import { GroupInput } from '../../../components/input/GroupInput'
import { Input } from '../../../components/input/Input'
import Button from '../../../components/button/Button'
import TextArea from '../../../components/input/TextArea'
import Dropdown from '../../../components/input/Dropdown'
import SaleReceiptTemplate from '../../../template/SaleReceiptTemplate'

const API_BASE = import.meta.env.VITE_API_BASE_URL
const token = localStorage.getItem('token')

type Stock = {
  id: number
  name: string
  batches: {
    id: number
    batchNo: string
    balanceQty: number
    saleRate: number
    discountPercent: number | null
    discountAmount: number | null
    expiryDate: string
    sku: string
    customerDiscountPercent?: number | null
    variantId: number
  }[]
}

type Item = {
  medicineId: number
  medicineName: string
  batch: string
  batchId?: number | string
  stockQty: number
  variantId?: number | string
  qty: number
  price: number
  total: number
  discountPercent?: number | null
  discountAmount?: number | null
  customerDiscountPercent?: number | null 
  sku?: string
}

type DropdownOption = { id: number | string; name: string }
type UpdateField = 'medicine' | 'batch' | 'qty' | 'price'
type UpdateValue = DropdownOption | number

export default function SalesInvoice() {
  const [stocks, setStocks] = useState<Stock[]>([])
  const [items, setItems] = useState<Item[]>([
    {
      medicineId: 0,
      medicineName: '',
      batch: '',
      stockQty: 0,
      qty: 1,
      price: 0,
      total: 0,
      customerDiscountPercent: 0,
    },
  ])
  const [customerName, setCustomerName] = useState('')
  const [paymentMode, setPaymentMode] = useState('CASH')
  const [remarks, setRemarks] = useState('')
  const [totalDiscount, setTotalDiscount] = useState(0)
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)
  const [loading, setLoading] = useState(false)

  /* ================= FETCH STOCK ================= */
  useEffect(() => {
    const fetchStock = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/stock-list-for-sale`, {
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
    setItems([
      ...items,
      {
        medicineId: 0,
        medicineName: '',
        batch: '',
        stockQty: 0,
        qty: 1,
        price: 0,
        total: 0,
      },
    ])
  const removeRow = (index: number) => {
    const data = [...items]
    data.splice(index, 1)
    setItems(data)
  }

  const updateItem = (
    index: number,
    field: UpdateField,
    value: UpdateValue
  ) => {
    const data = [...items]
    const item = { ...data[index] }

    if (field === 'medicine' && typeof value !== 'number') {
      const med = stocks.find((m) => m.id === value.id)
      if (med) {
        item.medicineId = med.id
        item.medicineName = med.name
        item.batch = ''
        item.stockQty = 0
        item.price = 0
        item.total = 0
        item.discountPercent = null
        item.discountAmount = null
      }
    }

    if (field === 'batch' && typeof value !== 'number') {
      const med = stocks.find((m) => m.id === item.medicineId)
      const batch = med?.batches.find((b) => b.id === value.id)
      if (batch) {
        item.batch = batch.batchNo
        item.stockQty = batch.balanceQty
        item.price = batch.saleRate
        item.qty = item.qty || 1
        item.discountPercent = batch.discountPercent
        item.discountAmount = batch.discountAmount
        item.customerDiscountPercent = batch.customerDiscountPercent || 0 // ✅ new
        const discountValue =
          (item.price * item.qty * item.customerDiscountPercent) / 100
        item.total = item.qty * item.price - discountValue
        item.sku = batch.sku
      }
    }

    if (field === 'qty' && typeof value === 'number') {
      if (value > item.stockQty) {
        setMessage({
          type: 'error',
          text: `Only ${item.stockQty} items available in stock`,
        })
        return
      }

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

  const subTotal = items.reduce((sum, i) => sum + i.qty * i.price, 0)
  const totalCustomerDiscount = items.reduce(
    (sum, i) =>
      sum + (i.qty * i.price * (i.customerDiscountPercent || 0)) / 100,
    0
  )
  const netTotal = subTotal - totalCustomerDiscount - totalDiscount

  /* ================= PRINT RECEIPT USING SALE RECEIPT TEMPLATE ================= */
  const printReceipt = (saleNoToPrint: string ) => {
    const receiptWindow = window.open(
      '',
      'PRINT',
      'width=400,height=600,top=50,left=50'
    )
    if (!receiptWindow) return

    // Map current items only
    const saleItems = items.map((i) => ({
      medicineName: i.medicineName,
      batchNo: i.batch,
      qty: i.qty,
      price: i.price,
      discountPercent: i.discountPercent ?? 0,
      discountAmount: i.discountAmount ?? 0,
      total: i.total,
    }))

    // Prepare HTML for current bill only
    const html = SaleReceiptTemplate({
      customerName,
      saleNo: saleNoToPrint,
      saleDate: new Date(),
      items: saleItems,
      subTotal,
      totalDiscount,
      netTotal,
      remarks,
    })

    // Write and print
    receiptWindow.document.open()
    receiptWindow.document.write(html)
    receiptWindow.document.close()
    receiptWindow.focus()
    receiptWindow.print()
    receiptWindow.close()
  }
  console.log(items, 'items')
  const handleSavePrint = async () => {
    if (!customerName) {
      setMessage({ type: 'error', text: 'Customer name required' })
      return
    }
    if (items.some((i) => i.medicineId === 0 || i.batch === '' || i.qty <= 0)) {
      setMessage({
        type: 'error',
        text: 'Please fill all item details correctly',
      })
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
        variantId: i.variantId,
        batchNo: i.batch,
        expiryDate: new Date(),
        quantity: i.qty,
        saleRate: i.price,
        discountPercent: i.customerDiscountPercent || 0, // ✅ send correct discount
        discountAmount:
          (i.price * i.qty * (i.customerDiscountPercent || 0)) / 100 || 0,
        taxPercent: 0,
      })),
    }

    try {
      const res = await fetch(`${API_BASE}/api/sale`, {
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
          text: json.message || 'Failed to save sale',
        })
      } else {
          const saleNo = json.data.saleNo 
  // setSaleNo(backendSaleNo)   
        setMessage({ type: 'success', text: 'Sale saved successfully!' })
        printReceipt(saleNo)
        // Reset form
        setItems([
          {
            medicineId: 0,
            medicineName: '',
            batch: '',
            stockQty: 0,
            qty: 1,
            price: 0,
            total: 0,
          },
        ])
        setCustomerName('')
        setTotalDiscount(0)
        setRemarks('')
      }
    } catch (err) {
      console.error(err)
      setMessage({ type: 'error', text: 'Network/server error' })
    } finally {
      setLoading(false)
    }
  }

const skuOptions = stocks.flatMap((med) =>
  med.batches.map((b) => ({
    id: `${b.variantId}-${b.batchNo}`, // 🔹 unique ID for dropdown
    variantId: b.variantId,            // keep numeric for backend
    name: `${med.name} - ${b.sku} (${b.batchNo || 'No Batch'})`,
    medicineId: med.id,
    medicineName: med.name,
    batchNo: b.batchNo,
    stockQty: b.balanceQty,
    price: b.saleRate,
    discountPercent: b.discountPercent,
    discountAmount: b.discountAmount,
    sku: b.sku,
    customerDiscountPercent: b.customerDiscountPercent || 0,
  }))
)

  /* ================= JSX ================= */
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
          <Input
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
          />
        </GroupInput>

        <GroupInput className="col-span-4">
          <Label>Remarks</Label>
          <TextArea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </GroupInput>
      </div>

      {/* Items Table */}
      <div className=" border rounded-lg shadow-sm h-full">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="p-2 border">#</th>
              <th className="p-2 border">Medicine</th>
              <th className="p-2 border">Batch</th>
              <th className="p-2 border">Stock</th>
              <th className="p-2 border">Qty</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Discount%</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i, idx) => {
              console.log(i)

              return (
                <tr key={idx} className="hover:bg-gray-50 ">
                  <td className="p-2 border text-center">{idx + 1}</td>
                  <td className="p-2 border">
                    <Dropdown
                      options={skuOptions.map((s) => ({
                        id: s.id,
                        name: s.name,
                      }))}
                      selected={i.sku ? { id: i.sku, name: i.sku } : null}
                      onSelect={(opt) => {
                        const selected = skuOptions.find((s) => s.id === opt.id)

                        if (selected) {
                          const data = [...items]
                          console.log(selected)
                          data[idx] = {
                            ...data[idx],
                            medicineId: selected.medicineId,
                            variantId: selected.variantId,
                            medicineName: selected.medicineName,
                            batch: selected.batchNo,
                            batchId: selected.batchNo, // ✅ IMPORTANT
                            stockQty: selected.stockQty,
                            price: selected.price,
                            total: selected.price,
                            discountPercent: selected.discountPercent,
                            discountAmount: selected.discountAmount,
                            sku: selected.sku,
                            customerDiscountPercent:
                              selected.customerDiscountPercent || 0, // ← add this
                          }

                          setItems(data)
                        }
                      }}
                    />
                  </td>
                  <td className="p-2 border">
                    <Dropdown
                      options={skuOptions
                        .filter((s) => s.medicineId === i.medicineId)
                        .map((s) => ({
                          id: s.id,
                          name: s.batchNo || 'No Batch',
                        }))}
                      selected={
                        i.batchId ? { id: i.batchId, name: i.batch } : null
                      }
                      onSelect={(opt) => {
                        const selected = skuOptions.find((s) => s.id === opt.id)

                        if (selected) {
                          const data = [...items]

                          data[idx] = {
                            ...data[idx],
                            batch: selected.batchNo,
                            variantId: selected.id,
                            batchId: selected.id,
                            stockQty: selected.stockQty,
                            price: selected.price,
                            total: data[idx].qty * selected.price,
                            discountPercent: selected.discountPercent,
                            discountAmount: selected.discountAmount,
                            customerDiscountPercent:
                              selected.customerDiscountPercent || 0, // ← add this
                          }

                          setItems(data)
                        }
                      }}
                    />
                  </td>
                  <td className="p-2 border text-center">{i.stockQty}</td>
                  <td className="p-2 border">
                    <Input
                      type="number"
                      min={1}
                      max={i.stockQty}
                      value={i.qty}
                      onChange={(e) =>
                        updateItem(idx, 'qty', Number(e.target.value))
                      }
                    />
                  </td>
                  <td className="p-2 border text-right">{i.price}</td>
                  <td className="p-2 border text-right">
                    {i.customerDiscountPercent ?? 0}
                  </td>
                  <td className="p-2 border text-right">{i.total}</td>
                  <td className="p-2 border text-center">
                    <Button
                      type="button"
                      onClick={() => removeRow(idx)}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <div className="p-3 flex justify-end">
          <Button
            type="button"
            onClick={addRow}
            className="bg-green-500 hover:bg-green-600"
          >
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
          <Input
            disabled
            value={netTotal.toFixed(2)}
            className="font-bold text-lg bg-yellow-50"
          />
        </GroupInput>
      </div>

      {/* Messages */}
      {message && (
        <div
          className={`p-2 rounded ${
            message.type === 'success'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
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
