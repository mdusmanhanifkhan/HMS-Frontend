import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Input } from '../../../components/input/Input'
import { Label } from '../../../components/input/Label'
import Dropdown from '../../../components/input/Dropdown'
import Button from '../../../components/button/Button'
import { routePaths } from '../../../constants/routePaths'

/* ================= TYPES ================= */

interface Option {
  id: number
  name: string
}

interface Medicine extends Option {
  genericNameId: number
}
type Generic = Option
type Distributor = Option

interface IndentItem {
  id: number
  genericNameId: number
  requestedQty: number
  medicineId: number | null
}

interface Indent {
  id: number
  indentNo: string
  indentDate: string
  departmentId: number
  status: string
  remarks: string
  items: IndentItem[]
}

interface POItem {
  indentItemId: number
  medicineId: number | null
  orderedQty: number
  rate: number
  discountPercent: number
  taxPercent: number
  totalAmount: number
}

interface POForm {
  poNo: string
  distributorId: number | null
  companyId: number | null
  indentId: number | null
  remarks: string
  paymentType: string
  items: POItem[]
}

/* ================= CONSTANTS ================= */

const API_BASE = import.meta.env.VITE_API_BASE_URL
const token = localStorage.getItem('token')

/* ================= COMPONENT ================= */

const CreatePurchaseOrder = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [indent, setIndent] = useState<Indent | null>(null)
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [generics, setGenerics] = useState<Generic[]>([])
  const [distributors, setDistributors] = useState<Distributor[]>([])
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState<POForm>({
    poNo: '',
    distributorId: null,
    companyId: null,
    indentId: null,
    remarks: '',
    paymentType: 'FULL',
    items: [],
  })

  /* ================= FETCH INDENT ================= */

  useEffect(() => {
    if (!id || !token) return

    fetch(`${API_BASE}/api/indent/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data: Indent) => {
        setIndent(data)
        setForm((prev) => ({
          ...prev,
          indentId: data.id,
          items: data.items.map((item) => ({
            indentItemId: item.id,
            medicineId: null,
            orderedQty: item.requestedQty,
            rate: 0,
            discountPercent: 0,
            taxPercent: 0,
            totalAmount: 0,
          })),
        }))
      })
      .catch(() => setError('Failed to load indent'))
  }, [id])

  /* ================= FETCH MEDICINES ================= */

  useEffect(() => {
    if (!token) return

    fetch(`${API_BASE}/api/medicine`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((res) => setMedicines(res.data ?? []))
  }, [])

  /* ================= FETCH GENERICS ================= */

  useEffect(() => {
    if (!token) return

    fetch(`${API_BASE}/api/generic-name`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((res) => setGenerics(res.data ?? []))
  }, [])

  /* ================= FETCH DISTRIBUTORS ================= */

  useEffect(() => {
    if (!token) return

    fetch(`${API_BASE}/api/distributor`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((res) => setDistributors(res.data ?? []))
  }, [])

  /* ================= ITEM UPDATE ================= */

  const updateItem = (index: number, key: keyof POItem, value: number) => {
    setForm((prev) => {
      const items = [...prev.items]
      items[index] = { ...items[index], [key]: value }

      const i = items[index]
      const base = i.orderedQty * i.rate
      const discount = base * (i.discountPercent / 100)
      const tax = (base - discount) * (i.taxPercent / 100)

      i.totalAmount = +(base - discount + tax).toFixed(2)

      return { ...prev, items }
    })
  }

  const grandTotal = form.items.reduce((sum, i) => sum + i.totalAmount, 0)

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch(`${API_BASE}/api/create-po`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to create PO')

      // Success: redirect
      navigate(routePaths.PURCHASE_ORDER)
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message)
      else setError('Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  /* ================= UI ================= */

  if (!indent) return <div className="p-6">Loading indent...</div>

  return (
    <>
      <div className="flex justify-between border-b pb-3 mb-6">
        <h1 className="text-xl font-semibold">Create PO – {indent.indentNo}</h1>
        <Button asLink to={routePaths.PURCHASE_ORDER}>
          ← Back
        </Button>
      </div>

      {/* INDENT INFO */}
      <div className="grid grid-cols-4 gap-4 bg-gray-50 p-4 rounded mb-4">
        <div>
          <b>Indent No:</b> {indent.indentNo}
        </div>
        <div>
          <b>Date:</b> {new Date(indent.indentDate).toLocaleDateString()}
        </div>
        <div>
          <b>Status:</b> {indent.status}
        </div>
        <div>
          <b>Remarks:</b> {indent.remarks || '-'}
        </div>
      </div>

      {/* DISTRIBUTOR */}
      <div className="mb-4 w-1/3">
        <Label>Select Distributor</Label>
        <Dropdown
          options={distributors}
          selected={
            distributors.find((d) => d.id === form.distributorId) ?? null
          }
          onSelect={(opt) =>
            setForm((prev) => ({ ...prev, distributorId: Number(opt.id) }))
          }
        />
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      {/* ITEMS */}
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        {form.items.map((item, index) => (
          <div key={item.indentItemId} className="grid grid-cols-16 gap-2">
            {/* GENERIC NAME */}
            <div className="col-span-3">
              <Label>Generic Name</Label>
              <Input
                value={
                  generics.find(
                    (g) => g.id === indent.items[index].genericNameId
                  )?.name || ''
                }
                disabled
              />
            </div>

            {/* MEDICINE */}
            <div className="col-span-4">
              <Label>Medicine</Label>
              <Dropdown
                options={medicines.filter(
                  (m) => m.genericNameId === indent.items[index].genericNameId
                )}
                selected={
                  medicines.find((m) => m.id === item.medicineId) ?? null
                }
                onSelect={(opt) =>
                  updateItem(index, 'medicineId', Number(opt.id))
                }
              />
            </div>

            {/* QTY */}
            <div className="col-span-2">
              <Label>Qty</Label>
              <Input
                type="number"
                value={item.orderedQty}
                onChange={(e) =>
                  updateItem(index, 'orderedQty', +e.target.value)
                }
              />
            </div>

            {/* RATE */}
            <div className="col-span-2">
              <Label>Rate</Label>
              <Input
                type="number"
                onChange={(e) => updateItem(index, 'rate', +e.target.value)}
              />
            </div>

            {/* DISCOUNT */}
            <div className="col-span-2">
              <Label>Disc %</Label>
              <Input
                type="number"
                onChange={(e) =>
                  updateItem(index, 'discountPercent', +e.target.value)
                }
              />
            </div>

            {/* TAX */}
            <div className="col-span-2">
              <Label>Tax %</Label>
              <Input
                type="number"
                onChange={(e) =>
                  updateItem(index, 'taxPercent', +e.target.value)
                }
              />
            </div>

            {/* TOTAL */}
            <div className="col-span-1">
              <Label>Total</Label>
              <Input value={item.totalAmount} disabled />
            </div>
          </div>
        ))}

        <div className="text-right text-lg font-bold">
          Grand Total: Rs. {grandTotal.toFixed(2)}
        </div>

        <Button type="submit" disabled={submitting}>
          {submitting ? 'Creating PO...' : 'Create Purchase Order'}
        </Button>
      </form>
    </>
  )
}

export default CreatePurchaseOrder
