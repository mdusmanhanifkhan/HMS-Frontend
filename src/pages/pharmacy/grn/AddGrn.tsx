import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Button from '../../../components/button/Button'
import { Input } from '../../../components/input/Input'
import { Label } from '../../../components/input/Label'
import { GroupInput } from '../../../components/input/GroupInput'
import TextArea from '../../../components/input/TextArea'
import { routePaths } from '../../../constants/routePaths'

/* ================= TYPES ================= */

type POItem = {
  productId: number
  variantId: number
  orderedQty: number
  rate: number
  discountPercent?: number
  taxPercent?: number
  totalAmount?: number
  discountAmount?: number
  product: {
    id: number
    name: string
  }
  variant: {
    id: number
    sku: string
    purchasePrice?: number | null
    salePrice?: number | null
  }
}

type GRNItem = {
  productId: number // ✅ ADD THIS
  variantId: number
  medicineName: string
  unit: string
  orderedQty: number
  acceptedQty: number
  bonusQty: number
  balanceQty: number
  batchNo: string
  expiryDate: string
  previousRate: number
  purchaseRate: number | null
  saleRate: number | null
  discountPercent: number | null
  discountAmount: number | null
  taxPercent: number | null
  customerDiscountPercent: number
  amount: number
}

type PO = {
  id: number
  poNo: string
  poDate: string
  supplierId: number
  supplier: {
    name: string
  }
  departmentId?: number
  items: POItem[]
}

/* ================= CONFIG ================= */

const API_BASE = import.meta.env.VITE_API_BASE_URL
const token = localStorage.getItem('token')

/* ================= COMPONENT ================= */

export default function AddGrn() {
  const { id } = useParams()
  const navigate = useNavigate()

  const today = new Date().toISOString().split('T')[0]

  const [po, setPo] = useState<PO | null>(null)
  const [items, setItems] = useState<GRNItem[]>([])
  const [grnNo, setGrnNo] = useState('')
  const [grnDate, setGrnDate] = useState(today)
  const [invoiceNo, setInvoiceNo] = useState('')
  const [remarks, setRemarks] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<number, Partial<GRNItem>>>({})

  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  /* ================= FETCH PO ================= */

  useEffect(() => {
    const fetchPO = async () => {
      const res = await fetch(`${API_BASE}/api/po/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const json = await res.json()
      const poData: PO = json.data ?? json
      setPo(poData)
      console.log(poData)
      // MAP PO ITEMS TO GRN ITEMS
      setItems(
        poData.items.map((item) => ({
          productId: item.product.id, // ✅ SEND PRODUCT ID
          variantId: item.variantId,

          medicineName: item.product?.name ?? '',
          unit: item.variant?.sku ?? '-',

          orderedQty: item.orderedQty,
          acceptedQty: 0,
          bonusQty: 0,
          balanceQty: item.orderedQty,

          batchNo: '',
          expiryDate: '',

          previousRate: item.rate ?? 0,
          purchaseRate: item.rate ?? null,
          saleRate: item.variant?.salePrice ?? null,

          discountPercent: item.discountPercent ?? 0,
          discountAmount: item.discountAmount ?? 0,
          taxPercent: item.taxPercent ?? 0,
          customerDiscountPercent: 0,

          amount: 0,
        }))
      )
    }

    fetchPO()
  }, [id])

  /* ================= FETCH NEXT GRN NO ================= */

  useEffect(() => {
    const fetchNextGRNNo = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/grn/next-grn-no`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const json = await res.json()
        if (json.success) {
          setGrnNo(json.grnNo) // ✅ set auto GRN No
        }
      } catch (err) {
        console.error('Failed to fetch GRN No:', err)
      }
    }

    // Only fetch next GRN No after PO is loaded
    if (po) fetchNextGRNNo()
  }, [po])

  /* ================= UPDATE ITEM ================= */

  const updateItem = <K extends keyof GRNItem>(
    index: number,
    field: K,
    value: GRNItem[K]
  ) => {
    const copy = [...items]
    const item = copy[index]

    item[field] = value

    // ✅ Prevent both discounts
    if (field === 'discountPercent' && value) {
      item.discountAmount = 0
    }
    if (field === 'discountAmount' && value) {
      item.discountPercent = 0
    }

    // BALANCE
    item.balanceQty = item.orderedQty - item.acceptedQty

    const tp = item.purchaseRate ?? 0
    const qty = item.acceptedQty

    const discountPercent = item.discountPercent ?? 0
    const discountAmount = item.discountAmount ?? 0
    const tax = item.taxPercent ?? 0

    let finalRate = tp

    // ✅ APPLY ONLY ONE
    if (discountAmount > 0) {
      finalRate = tp - discountAmount
    } else if (discountPercent > 0) {
      finalRate = tp - (tp * discountPercent) / 100
    }

    finalRate = Math.max(finalRate, 0)

    const taxableAmount = finalRate * qty
    const taxAmount = taxableAmount * (tax / 100)

    item.amount = taxableAmount + taxAmount

    setItems(copy)
  }

  /* ================= TOTALS ================= */

  const grossAmount = items.reduce(
    (sum, i) => sum + (i.purchaseRate ?? 0) * i.acceptedQty,
    0
  )

  const discountAmount = items.reduce((sum, i) => {
    const rate = i.purchaseRate ?? 0
    const discount = i.discountPercent ?? 0
    return sum + rate * i.acceptedQty * (discount / 100)
  }, 0)

  const taxAmount = items.reduce((sum, i) => {
    const rate = i.purchaseRate ?? 0
    const discount = i.discountPercent ?? 0
    const discounted = rate * i.acceptedQty * (1 - discount / 100)
    return sum + discounted * ((i.taxPercent ?? 0) / 100)
  }, 0)

  const netAmount = grossAmount - discountAmount + taxAmount

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!po) return

    if (!grnNo || !grnDate) {
      setMessage({
        type: 'error',
        text: 'GRN No and GRN Date are required',
      })
      return
    }
    const isValid = validateItems()

    if (!isValid) {
      setMessage({
        type: 'error',
        text: 'Please fill all required fields in items',
      })
      return
    }
    setLoading(true)
    setMessage(null)

    console.log(items)
    try {
      const res = await fetch(`${API_BASE}/api/grn`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          grnNo,
          grnDate,
          poId: po.id,
          supplierId: po.supplierId,
          departmentId: po.departmentId ?? null,
          invoiceNo,
          remarks,
          items: items.map((i) => ({
            productId: i.productId, // ✅ SEND PRODUCT ID
            variantId: i.variantId,

            orderedQty: i.orderedQty,
            receivedQty: i.acceptedQty,
            bonusQty: i.bonusQty,

            batchNo: i.batchNo,
            expiryDate: i.expiryDate || null,

            purchasePrice: i.purchaseRate,
            salePrice: i.saleRate,
            discountPercent: i.discountPercent ?? 0,
            discountAmount: i.discountAmount ?? 0,
            customerDiscountPercent: i.customerDiscountPercent ?? 0, 
          })),
        }),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.message)

      setMessage({ type: 'success', text: 'GRN created successfully' })
      setTimeout(() => navigate(routePaths.GRN), 1200)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage({ type: 'error', text: err.message })
      } else {
        setMessage({ type: 'error', text: 'Failed to save GRN' })
      }
    } finally {
      setLoading(false)
    }
  }

  const validateItems = () => {
    const newErrors: Record<number, Partial<GRNItem>> = {}

    items.forEach((item, index) => {
      const rowError: Partial<GRNItem> = {}

      if (!item.acceptedQty || item.acceptedQty <= 0) {
        rowError.acceptedQty = 0
      }

      if (!item.batchNo) {
        rowError.batchNo = ''
      }

      if (!item.expiryDate) {
        rowError.expiryDate = ''
      }

      if (!item.purchaseRate || item.purchaseRate <= 0) {
        rowError.purchaseRate = 0
      }

      if (!item.saleRate || item.saleRate <= 0) {
        rowError.saleRate = 0
      }

      if (!item.taxPercent && item.taxPercent !== 0) {
        rowError.taxPercent = 0
      }

      if (Object.keys(rowError).length > 0) {
        newErrors[index] = rowError
      }
    })

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  if (!po) return <p>Loading...</p>

  /* ================= UI ================= */

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* HEADER */}
      <div className="bg-white rounded-xl shadow p-6 grid grid-cols-4 gap-4">
        <h2 className="col-span-4 text-xl font-semibold">
          Goods Receipt Note (GRN)
        </h2>

        <GroupInput>
          <Label>GRN No</Label>
          <Input
            value={grnNo}
            onChange={(e) => setGrnNo(e.target.value)}
            disabled
          />
        </GroupInput>

        <GroupInput>
          <Label>GRN Date</Label>
          <Input
            type="date"
            value={grnDate}
            onChange={(e) => setGrnDate(e.target.value)}
          />
        </GroupInput>

        <GroupInput>
          <Label>PO No</Label>
          <Input value={po.poNo} disabled />
        </GroupInput>

        <GroupInput>
          <Label>Supplier</Label>
          <Input value={po.supplier.name} disabled />
        </GroupInput>

        <GroupInput className="col-span-2">
          <Label>Invoice / DC No</Label>
          <Input
            value={invoiceNo}
            onChange={(e) => setInvoiceNo(e.target.value)}
          />
        </GroupInput>

        <GroupInput className="col-span-4">
          <Label>Remarks</Label>
          <TextArea
            rows={2}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </GroupInput>
      </div>

      {/* ITEMS TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              {[
                'Item',
                'Ordered',
                'Accepted',
                'Bonus',
                'Balance',
                'Batch',
                'Expiry',
                'TP',
                'Discount %',
                'Customer Discount %',
                'Tax %',
                'Sale Rate',
                'Amount',
              ].map((h) => (
                <th key={h} className="px-3 py-2 text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="px-3 text-nowrap">{item.unit}</td>
                <td className="px-3">{item.orderedQty}</td>
                <td className="px-3">
                  <Input
                    type="number"
                    min={0}
                    max={item.orderedQty}
                    value={item.acceptedQty}
                    onChange={(e) =>
                      updateItem(i, 'acceptedQty', +e.target.value)
                    }
                    className={errors[i]?.acceptedQty ? 'border-red' : ''}
                  />
                </td>
                <td className="px-3">
                  <Input
                    type="number"
                    min={0}
                    value={item.bonusQty}
                    onChange={(e) => updateItem(i, 'bonusQty', +e.target.value)}
                  />
                </td>
                <td className="px-3 text-gray-500">{item.balanceQty}</td>
                <td className="px-3">
                  <Input
                    value={item.batchNo}
                    className={errors[i]?.batchNo ? 'border-red' : ''}
                    onChange={(e) => updateItem(i, 'batchNo', e.target.value)}
                  />
                </td>
                <td className="px-3">
                  <Input
                    type="date"
                    value={item.expiryDate}
                    className={errors[i]?.expiryDate ? 'border-red' : ''}
                    onChange={(e) =>
                      updateItem(i, 'expiryDate', e.target.value)
                    }
                  />
                </td>
                <td className="px-3">
                  <Input
                    type="number"
                    value={item.purchaseRate ?? ''}
                    className={errors[i]?.purchaseRate ? 'border-red' : ''}
                    onChange={(e) =>
                      updateItem(i, 'purchaseRate', +e.target.value)
                    }
                  />
                </td>
                <td className="px-3">
                  <Input
                    type="number"
                    value={item.discountPercent ?? ''}
                    onChange={(e) =>
                      updateItem(i, 'discountPercent', +e.target.value)
                    }
                  />
                </td>
                <td className="px-3">
                  <Input
                    type="number"
                    value={item.customerDiscountPercent}
                    onChange={(e) =>
                      updateItem(i, 'customerDiscountPercent', +e.target.value)
                    }
                  />
                </td>
                <td className="px-3">
                  <Input
                    type="number"
                    value={item.taxPercent ?? ''}
                    onChange={(e) =>
                      updateItem(i, 'taxPercent', +e.target.value)
                    }
                  />
                </td>
                <td className="px-3">
                  <Input
                    type="number"
                    value={item.saleRate ?? ''}
                    className={errors[i]?.saleRate ? 'border-red' : ''}
                    onChange={(e) => updateItem(i, 'saleRate', +e.target.value)}
                  />
                </td>
                <td className="px-3 font-semibold">{item.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow">
        <div className="text-lg font-semibold">
          Total: {netAmount.toFixed(2)}
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save GRN'}
        </Button>
      </div>

      {message && (
        <div
          className={`p-3 rounded ${
            message.type === 'success'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}
    </form>
  )
}
