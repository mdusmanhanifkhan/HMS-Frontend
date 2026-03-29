import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { Input } from '../../../components/input/Input'
import { Label } from '../../../components/input/Label'
import Dropdown from '../../../components/input/Dropdown'
import Button from '../../../components/button/Button'
import { routePaths } from '../../../constants/routePaths'
import { GroupInput } from '../../../components/input/GroupInput'

/* ================= TYPES ================= */

interface Medicine {
  id: number
  name: string
  variants: { id: number; sku: string }[]
}

interface Supplier {
  id: number
  name: string
}

interface IndentItem {
  id: number
  productId: number | null
  variantId: number | null
  requestedQty: number
  selected?: boolean
}

interface Indent {
  id: number
  indentNo: string
  items: IndentItem[]
}

interface POItem {
  indentItemId: number
  productId: number | null
  variantId: number | null
  orderedQty: number
  rate: number
  discountPercent: number
  taxPercent: number
  totalAmount: number
}

interface POForm {
  poNo: string
  supplierId: number | null
  prId: number | null
  paymentType: string
  remarks: string
  items: POItem[]
}

/* ================= CONSTANTS ================= */

const API_BASE = import.meta.env.VITE_API_BASE_URL
const token = localStorage.getItem('token')

/* ================= COMPONENT ================= */

const CreatePurchaseOrder = () => {
  const { id } = useParams<{ id: string }>()
  const [indent, setIndent] = useState<Indent | null>(null)
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState<POForm>({
    poNo: '',
    supplierId: null,
    prId: null,
    paymentType: 'FULL_AFTER_RECEIVE',
    remarks: '',
    items: [],
  })

  /* ================= FETCH INDENT ================= */
  useEffect(() => {
    if (!id || !token) return

    fetch(`${API_BASE}/api/indent/${id}/items`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data: Indent) => {
        setIndent({
          ...data,
          items: data.items.map((item) => ({
            ...item,
            selected: !!item.productId && !!item.variantId, // ✅ preselect if product & variant exist
          })),
        })

        setForm((prev) => ({
          ...prev,
          prId: data.id,
          items: data.items.map((item) => ({
            indentItemId: item.id,
            productId: item.productId,
            variantId: item.variantId,
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
    fetch(`${API_BASE}/api/product`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((res) => setMedicines(res.data ?? []))
  }, [])

  /* ================= FETCH SUPPLIERS ================= */
  useEffect(() => {
    if (!token) return
    fetch(`${API_BASE}/api/supplier`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((res) => setSuppliers(res.data ?? []))
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

  const toggleSelectItem = (index: number) => {
    if (!indent) return
    const newItems = [...indent.items]
    newItems[index].selected = !newItems[index].selected
    setIndent({ ...indent, items: newItems })
  }

  const grandTotal = form.items.reduce((sum, i) => sum + i.totalAmount, 0)

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (submitting || !indent) return

    setSubmitting(true)
    setError(null)

    const selectedItems = form.items.filter(
      (_, index) => indent.items[index].selected
    )

    if (selectedItems.length === 0) {
      setError('Please select at least one item to create PO')
      setSubmitting(false)
      return
    }

    try {
      const res = await fetch(`${API_BASE}/api/create-po`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          poNo: form.poNo || undefined,
          supplierId: form.supplierId,
          prId: form.prId,
          remarks: form.remarks,
          paymentType: form.paymentType,
          items: selectedItems,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to create PO')

      // ============================
      // ✅ FRONTEND INSTANT UPDATE
      // ============================

      const selectedIds = selectedItems.map((i) => i.indentItemId)

      // 👉 Remove from indent UI
      setIndent((prev) => {
        if (!prev) return prev

        const filteredItems = prev.items.filter(
          (item) => !selectedIds.includes(item.id)
        )

        return {
          ...prev,
          items: filteredItems,
        }
      })

      // 👉 Remove from form
      setForm((prev) => ({
        ...prev,
        supplierId: null,
        items: prev.items.filter(
          (item) => !selectedIds.includes(item.indentItemId)
        ),
      }))

      // ============================
      // ✅ OPTIONAL BACKEND SYNC
      // ============================

      // (Recommended but optional)
      const indentRes = await fetch(
        `${API_BASE}/api/indent/${indent.id}/items`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      const updatedIndent: Indent = await indentRes.json()

      setIndent({
        ...updatedIndent,
        items: updatedIndent.items.map((i) => ({
          ...i,
          selected: false,
        })),
      })

      setForm((prev) => ({
        ...prev,
        items: updatedIndent.items.map((item) => ({
          indentItemId: item.id,
          productId: item.productId,
          variantId: item.variantId,
          orderedQty: item.requestedQty,
          rate: 0,
          discountPercent: 0,
          taxPercent: 0,
          totalAmount: 0,
        })),
      }))
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

      {/* SUPPLIER */}
      <div className="mb-4 flex gap-5 w-full">
        <GroupInput className="min-w-64">
          <Label>Select Supplier</Label>
          <Dropdown
            options={suppliers}
            selected={suppliers.find((s) => s.id === form.supplierId) ?? null}
            onSelect={(opt) =>
              setForm((prev) => ({ ...prev, supplierId: Number(opt.id) }))
            }
          />
        </GroupInput>
        {/* ================= PAYMENT TYPE ================= */}
        <GroupInput className="min-w-64">
          <Label>Payment Type</Label>
          <Dropdown
            options={[
              { id: 'FULL_AFTER_RECEIVE', name: 'Full After Receive' },
              { id: 'ADVANCE', name: 'Advance Payment' },
              { id: 'PARTIAL', name: 'Partial Payment' },
              { id: 'WITH_IN_30_DAYS', name: 'Payment with in 30 days' },
            ]}
            selected={
              form.paymentType
                ? {
                    id: form.paymentType,
                    name: form.paymentType.replaceAll('_', ' '),
                  }
                : null
            }
            onSelect={(opt) =>
              setForm((prev) => ({ ...prev, paymentType: String(opt.id) }))
            }
          />
        </GroupInput>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      {/* ITEMS */}
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        {form.items.map((item, index) => {
          const indentItem = indent.items[index]
          const product = medicines.find((m) => m.id === item.productId)
          const variants = product?.variants ?? []
          const selectedVariant =
            variants.find((v) => v.id === item.variantId) ?? null

          return (
            <div
              key={item.indentItemId}
              className="grid grid-cols-18 gap-2 items-center"
            >
              {/* SELECT ITEM */}
              <div className="col-span-1 flex justify-center">
                <input
                  type="checkbox"
                  checked={indentItem.selected || false}
                  onChange={() => toggleSelectItem(index)}
                />
              </div>

              {/* PRODUCT */}
              <div className="col-span-4">
                <Label>Product</Label>
                <Dropdown
                  options={medicines}
                  selected={product ?? null}
                  onSelect={(opt) =>
                    updateItem(index, 'productId', Number(opt.id))
                  }
                />
              </div>

              {/* VARIANT */}
              <div className="col-span-3">
                <Label>Variant</Label>
                <Dropdown
                  options={variants.map((v) => ({
                    ...v,
                    name: v.sku || 'N/A',
                  }))} // ✅ use SKU as name
                  selected={
                    selectedVariant
                      ? { ...selectedVariant, name: selectedVariant.sku }
                      : null
                  }
                  onSelect={(opt) =>
                    updateItem(index, 'variantId', Number(opt.id))
                  }
                />
              </div>

              {/* QTY */}
              <div className="col-span-1">
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
              <div className="col-span-1">
                <Label>Rate</Label>
                <Input
                  type="number"
                  step={'any'}
                  onChange={(e) => updateItem(index, 'rate', +e.target.value)}
                />
              </div>

              {/* DISCOUNT */}
              <div className="col-span-1">
                <Label>Disc %</Label>
                <Input
                  type="number"
                  step={'any'}
                  onChange={(e) =>
                    updateItem(index, 'discountPercent', +e.target.value)
                  }
                />
              </div>

              {/* TAX */}
              <div className="col-span-1">
                <Label>GST %</Label>
                <Input
                  type="number"
                  step={'any'}
                  onChange={(e) =>
                    updateItem(index, 'taxPercent', +e.target.value)
                  }
                />
              </div>

              {/* TOTAL */}
              <div className="col-span-2">
                <Label>Total</Label>
                <Input value={item.totalAmount} disabled />
              </div>
            </div>
          )
        })}

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
