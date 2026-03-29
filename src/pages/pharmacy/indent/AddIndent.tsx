import { useEffect, useRef, useState } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import { Input } from '../../../components/input/Input'
import { Label } from '../../../components/input/Label'
import { GroupInput } from '../../../components/input/GroupInput'
import Dropdown from '../../../components/input/Dropdown'
import Button from '../../../components/button/Button'
import { routePaths } from '../../../constants/routePaths'
import SuccessMessage from '../../../components/error-handling/SuccessMessage'
import ErrorMessage from '../../../components/error-handling/ErrorMessage'

/* ================= TYPES ================= */

interface PRItem {
  productId: string
  variantId: string
  requestedQty: number
  remarks: string
}

interface PRForm {
  departmentId: number | null
  remarks: string
  items: PRItem[]
}

interface Option {
  id: string
  name: string
}

interface ProductResponse {
  id: number
  name: string
  variants: { id: number; sku: string }[]
}

interface DepartmentResponse {
  id: number
  name: string
}

const API_BASE = import.meta.env.VITE_API_BASE_URL as string
const token = localStorage.getItem('token')

const AddIndent = () => {
  const [form, setForm] = useState<PRForm>({
    departmentId: null,
    remarks: '',
    items: [
      {
        productId: '',
        variantId: '',
        requestedQty: 1,
        remarks: '',
      },
    ],
  })

  const [departments, setDepartments] = useState<Option[]>([])
  const [products, setProducts] = useState<ProductResponse[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const submitRef = useRef<HTMLButtonElement>(null)

  /* ================= FETCH DEPARTMENTS ================= */
 useEffect(() => {
  fetch(`${API_BASE}/api/department`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((res: { data?: DepartmentResponse[] } | DepartmentResponse[]) => {
      const data = Array.isArray(res) ? res : (res.data ?? [])

      const mapped = data.map((d) => ({
        id: String(d.id),
        name: d.name,
      }))

      setDepartments(mapped)

      // ✅ Find Pharmacy and auto select
      const pharmacy = mapped.find(
        (d) => d.name.toLowerCase() === 'pharmacy'
      )

      if (pharmacy) {
        setForm((prev) => ({
          ...prev,
          departmentId: Number(pharmacy.id),
        }))
      }
    })
    .catch(console.error)
}, [])

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    fetch(`${API_BASE}/api/product`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((res) => {
        const data = res.data ?? res
        setProducts(data)
      })
      .catch(console.error)
  }, [])

  /* ================= HELPERS ================= */

  const getProductOptions = (): Option[] => {
    return products?.map((p) => ({ id: String(p.id), name: p.name }))
  }

  const getVariantOptions = (productId: string): Option[] => {
    const product = products.find((p) => String(p.id) === productId)
    if (!product || !product.variants) return []
    return product.variants.map((v) => ({ id: String(v.id), name: v.sku }))
  }

  /* ================= HANDLERS ================= */

  const updateItem = (
    index: number,
    key: keyof PRItem,
    value: string | number
  ) => {
    setForm((prev) => {
      const items = [...prev.items]

      if (key === 'productId') {
        // Check if this product + variant already exists in another row
        const exists = items.some(
          (i, idx) =>
            idx !== index &&
            i.productId === value &&
            i.variantId === items[index].variantId
        )

        if (exists) {
          setError('This product with selected variant is already added.')
          return prev // do not update
        }

        items[index] = {
          ...items[index],
          productId: value as string,
          variantId: '',
        }
      } else if (key === 'variantId') {
        // Check if same product + variant already exists
        const exists = items.some(
          (i, idx) =>
            idx !== index &&
            i.productId === items[index].productId &&
            i.variantId === value
        )
        if (exists) {
          setError('This product with selected variant is already added.')
          return prev // do not update
        }

        items[index] = { ...items[index], variantId: value as string }
      } else {
        items[index] = { ...items[index], [key]: value }
      }

      setError(null) // clear error if ok
      return { ...prev, items }
    })
  }

  const addItem = () => {
    const lastItem = form.items[form.items.length - 1]
    if (!lastItem.productId || !lastItem.variantId) {
      setError(
        'Please select product and variant in the last row before adding new one.'
      )
      return
    }

    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { productId: '', variantId: '', requestedQty: 1, remarks: '' },
      ],
    }))
  }

  const removeItem = (index: number) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }))
  }

  const handleItemKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key !== 'Enter') return
    e.preventDefault()
    const item = form.items[index]

    if (!item.productId || !item.variantId || item.requestedQty <= 0) return
    if (index === form.items.length - 1) addItem()
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!form.departmentId) {
      setError('Department is required.')
      return
    }

    try {
      const res = await fetch(`${API_BASE}/api/indent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })

      if (!res.ok) throw new Error('Failed to create Purchase Requisition.')

      setSuccess('Purchase Requisition created successfully.')

      // Reset form
      setForm({
        departmentId: null,
        remarks: '',
        items: [{ productId: '', variantId: '', requestedQty: 1, remarks: '' }],
      })
    } catch (err) {
      setError((err as Error).message)
    }
  }

  /* ================= UI ================= */
  return (
    <>
      <div className="flex justify-between items-center border-b pb-3 mb-6">
        <h1 className="text-xl font-semibold">Add Purchase Requisition</h1>
        <Button to={routePaths.INDENT} asLink>
          ← Back
        </Button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-5xl bg-white space-y-6 w-full"
      >
        {error && <ErrorMessage msg={error} />}
        {success && <SuccessMessage msg={success} />}

        {/* Department */}
        <GroupInput className="w-full max-w-72">
          <Label>Department</Label>
          <Dropdown
            options={departments}
            selected={
              departments.find((d) => Number(d.id) === form.departmentId) ??
              null
            }
            onSelect={(opt) =>
              setForm((prev) => ({ ...prev, departmentId: Number(opt.id) }))
            }
            
          />
        </GroupInput>

        {/* Items */}
        {form.items.map((item, index) => {
          const productOptions = getProductOptions()
          const variantOptions = getVariantOptions(item.productId)

          return (
            <div key={index} className="grid grid-cols-12 gap-2 mb-4">
              <div className="col-span-3">
                <Label>Product</Label>
                <Dropdown
                  options={productOptions}
                  selected={
                    productOptions.find((p) => p.id === item.productId) ?? null
                  }
                  onSelect={(opt) => updateItem(index, 'productId', opt.id)}
                />
              </div>

              <div className="col-span-3">
                <Label>Variant</Label>
                <Dropdown
                  options={variantOptions}
                  selected={
                    variantOptions.find((v) => v.id === item.variantId) ?? null
                  }
                  onSelect={(opt) => updateItem(index, 'variantId', opt.id)}
                />
              </div>

              <div className="col-span-2">
                <Label>Qty</Label>
                <Input
                  type="number"
                  min={1}
                  value={item.requestedQty}
                  onChange={(e) =>
                    updateItem(index, 'requestedQty', Number(e.target.value))
                  }
                  onKeyDown={(e) => handleItemKeyDown(e, index)}
                />
              </div>

              <div className="col-span-3">
                <Label>Remarks</Label>
                <Input
                  value={item.remarks}
                  onChange={(e) => updateItem(index, 'remarks', e.target.value)}
                />
              </div>

              <button
                type="button"
                onClick={() => removeItem(index)}
                className="col-span-1 text-red-500 font-bold mt-6"
              >
                ✕
              </button>
            </div>
          )
        })}

        <Button type="button" onClick={addItem}>
          + Add Item
        </Button>

        <Button type="submit" ref={submitRef}>
          Create Purchase Requisition
        </Button>
      </form>
    </>
  )
}

export default AddIndent
