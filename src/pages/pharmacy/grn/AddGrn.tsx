import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Button from '../../../components/button/Button'
import { Input } from '../../../components/input/Input'
import { Label } from '../../../components/input/Label'
import { GroupInput } from '../../../components/input/GroupInput'
import TextArea from '../../../components/input/TextArea'
import { routePaths } from '../../../constants/routePaths'

/* ================= TYPES ================= */

type Medicine = {
  id: number
  name: string
  unitPacking?: string
}

type POItem = {
  medicineId: number
  orderedQty: number
  rate: number
  discountPercent: number
  taxPercent: number
  medicine: Medicine
}

type GRNItem = {
  medicineId: number
  medicineName: string
  unit: string

  orderedQty: number
  acceptedQty: number
  bonusQty: number
  balanceQty: number

  batchNo: string
  expiryDate: string

  previousRate: number
  purchaseRate: number
  saleRate: number

  discountPercent: number
  taxPercent: number

  amount: number
}

type PO = {
  id: number
  poNo: string
  poDate: string
  distributorId: number
  distributor: { name: string }
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

  const [po, setPo] = useState<PO | null>(null)
  const [items, setItems] = useState<GRNItem[]>([])

  /* -------- HEADER STATE -------- */
  const [grnNo, setGrnNo] = useState('')
  const [grnDate, setGrnDate] = useState('')
  const [invoiceNo, setInvoiceNo] = useState('')
  const [remarks, setRemarks] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  /* ================= FETCH PO ================= */
  useEffect(() => {
    const fetchPO = async () => {
      const res = await fetch(`${API_BASE}/api/po/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      const poData: PO = json.data ?? json

      setPo(poData)

      /* ---- MAP PO ITEMS → GRN ITEMS ---- */
      setItems(
        poData.items.map((item) => ({
          medicineId: item.medicineId,
          medicineName: item.medicine.name,
          unit: item.medicine.unitPacking ?? '-',

          orderedQty: item.orderedQty,
          acceptedQty: 0,
          bonusQty: 0,
          balanceQty: item.orderedQty,

          batchNo: '',
          expiryDate: '',

          previousRate: item.rate,
          purchaseRate: item.rate,
          saleRate: 0,

          discountPercent: item.discountPercent,
          taxPercent: item.taxPercent,

          amount: 0,
        }))
      )
    }

    fetchPO()
  }, [id])

  /* ================= UPDATE ITEM ================= */
  const updateItem = <K extends keyof GRNItem>(index: number, field: K, value: GRNItem[K]) => {
    const copy = [...items]
    const item = copy[index]

    // Assign value with type safety
    item[field] = value

    // Recalculate balance and amount
    item.balanceQty = item.orderedQty - item.acceptedQty
    item.amount = item.acceptedQty * item.purchaseRate

    setItems(copy)
  }

  /* ================= TOTAL ================= */
  const grnTotal = items.reduce((sum, i) => sum + i.amount, 0)

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!po) return

    // Validation
    if (!grnNo || !grnDate) {
      setMessage({ type: 'error', text: 'GRN No and GRN Date are required.' })
      return
    }

    if (items.some(i => i.acceptedQty < 0 || i.purchaseRate < 0 || i.saleRate < 0)) {
      setMessage({ type: 'error', text: 'Invalid item quantities or rates.' })
      return
    }

    setLoading(true)
    setMessage(null)

    const payload = {
      grnNo,
      grnDate,
      poId: po.id,
      poNo: po.poNo,
      poDate: po.poDate,
      distributorId: po.distributorId,
      departmentId: po.departmentId ?? null,
      invoiceNo,
      remarks,
      items: items.map((i) => ({
        medicineId: i.medicineId,
        orderedQty: i.orderedQty,
        previouslyReceivedQty: 0,
        receivedQty: i.acceptedQty,
        bonusQty: i.bonusQty,
        batchNo: i.batchNo,
        expiryDate: i.expiryDate,
        rate: i.purchaseRate,
        saleRate: i.saleRate,
        discountPercent: i.discountPercent,
        taxPercent: i.taxPercent,
      })),
    }

    try {
      const res = await fetch(`${API_BASE}/api/grn`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const json = await res.json()

      if (!res.ok) {
        setMessage({ type: 'error', text: json.message || 'Failed to create GRN.' })
      } else {
        setMessage({ type: 'success', text: 'GRN created successfully!' })
        setTimeout(() => navigate(routePaths.GRN), 1500)
      }
    } catch (error) {
      console.error('GRN creation error:', error)
      setMessage({ type: 'error', text: 'Network or server error.' })
    } finally {
      setLoading(false)
    }
  }

  if (!po) return <p>Loading GRN...</p>

  /* ================= UI ================= */
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <h2 className="text-xl font-semibold">Add GRN</h2>

      {/* ================= HEADER ================= */}
      <div className="grid grid-cols-4 gap-4">
        <GroupInput>
          <Label>GRN No</Label>
          <Input value={grnNo} onChange={(e) => setGrnNo(e.target.value)} />
        </GroupInput>

        <GroupInput>
          <Label>GRN Date</Label>
          <Input type="date" value={grnDate} onChange={(e) => setGrnDate(e.target.value)} />
        </GroupInput>

        <GroupInput>
          <Label>PO No</Label>
          <Input value={po.poNo} disabled />
        </GroupInput>

        <GroupInput>
          <Label>PO Date</Label>
          <Input value={po.poDate.slice(0, 10)} disabled />
        </GroupInput>

        <GroupInput>
          <Label>Distributor</Label>
          <Input value={po.distributor.name} disabled />
        </GroupInput>

        <GroupInput>
          <Label>DC / Invoice No</Label>
          <Input value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} />
        </GroupInput>

        <GroupInput className="col-span-4">
          <Label>Remarks</Label>
          <TextArea value={remarks} onChange={(e) => setRemarks(e.target.value)} />
        </GroupInput>
      </div>

      {/* ================= ITEMS ================= */}
      <table className="w-full border text-sm">
        <thead>
          <tr>
            <th>Item</th>
            <th>Unit</th>
            <th>Ordered</th>
            <th>Accepted</th>
            <th>Bonus</th>
            <th>Balance</th>
            <th>Batch</th>
            <th>Expiry</th>
            <th>Prev Rate</th>
            <th>Purchase Rate</th>
            <th>Sale Rate</th>
            <th>Amount</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item, i) => (
            <tr key={i}>
              <td>{item.medicineName}</td>
              <td>{item.unit}</td>
              <td>{item.orderedQty}</td>

              <td>
                <Input
                  type="number"
                  value={item.acceptedQty}
                  onChange={(e) =>
                    updateItem(i, 'acceptedQty', +e.target.value)
                  }
                />
              </td>

              <td>
                <Input
                  type="number"
                  value={item.bonusQty}
                  onChange={(e) =>
                    updateItem(i, 'bonusQty', +e.target.value)
                  }
                />
              </td>

              <td>{item.balanceQty}</td>

              <td>
                <Input
                  value={item.batchNo}
                  onChange={(e) =>
                    updateItem(i, 'batchNo', e.target.value)
                  }
                />
              </td>

              <td>
                <Input
                  type="date"
                  value={item.expiryDate}
                  onChange={(e) =>
                    updateItem(i, 'expiryDate', e.target.value)
                  }
                />
              </td>

              <td>{item.previousRate}</td>

              <td>
                <Input
                  type="number"
                  value={item.purchaseRate}
                  onChange={(e) =>
                    updateItem(i, 'purchaseRate', +e.target.value)
                  }
                />
              </td>

              <td>
                <Input
                  type="number"
                  value={item.saleRate}
                  onChange={(e) =>
                    updateItem(i, 'saleRate', +e.target.value)
                  }
                />
              </td>

              <td>{item.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= FOOTER ================= */}
      <div className="flex justify-between items-center">
        <div className="font-semibold">
          GRN Total: {grnTotal}
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save GRN'}
        </Button>
      </div>

      {message && (
        <p className={message.type === 'success' ? 'text-green-600' : 'text-red-600'}>
          {message.text}
        </p>
      )}
    </form>
  )
}
