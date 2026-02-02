import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent, KeyboardEvent } from 'react'
import { Input } from '../../../components/input/Input'
import { Label } from '../../../components/input/Label'
import { GroupInput } from '../../../components/input/GroupInput'
import Dropdown from '../../../components/input/Dropdown'
import Button from '../../../components/button/Button'
import { routePaths } from '../../../constants/routePaths'

/* ================= TYPES ================= */

interface IndentItem {
  genericNameId: string
  requestedQty: number
  remarks: string
}

interface IndentForm {
  requestedBy: string
  departmentId: number | null
  remarks: string
  items: IndentItem[]
}

interface Option {
  id: string
  name: string
}

interface GenericNameResponse {
  id: number | string
  name: string
}

interface DepartmentResponse {
  id: number | string
  name: string
}

/* ================= CONSTANTS ================= */

const API_BASE = import.meta.env.VITE_API_BASE_URL as string
const token = localStorage.getItem('token')

/* ================= COMPONENT ================= */

const AddIndent = () => {
  const [form, setForm] = useState<IndentForm>({
    requestedBy: localStorage.getItem('userId') ?? '',
    departmentId: null,
    remarks: '',
    items: [{ genericNameId: '', requestedQty: 1, remarks: '' }],
  })

  const [departments, setDepartments] = useState<Option[]>([])
  const [genericNames, setGenericNames] = useState<Option[]>([])
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
        // normalize data
        const data: DepartmentResponse[] = Array.isArray(res)
          ? res
          : (res.data ?? [])

        setDepartments(
          data.map((d) => ({
            id: String(d.id),
            name: d.name,
          }))
        )
      })
      .catch(console.error)
  }, [])

  /* ================= FETCH GENERIC NAMES ================= */

  useEffect(() => {
    fetch(`${API_BASE}/api/generic-name`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((res: { data?: GenericNameResponse[] } | GenericNameResponse[]) => {
        // normalize data
        const data: GenericNameResponse[] = Array.isArray(res)
          ? res
          : (res.data ?? [])

        setGenericNames(
          data.map((m) => ({
            id: String(m.id),
            name: m.name,
          }))
        )
      })
      .catch(console.error)
  }, [])

  /* ================= HANDLERS ================= */

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const updateItem = (
    index: number,
    key: keyof IndentItem,
    value: string | number
  ) => {
    setForm((prev) => {
      const items = [...prev.items]
      items[index] = { ...items[index], [key]: value }
      return { ...prev, items }
    })
  }

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { genericNameId: '', requestedQty: 1, remarks: '' },
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
    if (e.key === 'Enter') {
      e.preventDefault()
      const item = form.items[index]
      if (!item.genericNameId || item.requestedQty <= 0) return
      if (index === form.items.length - 1) addItem()
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    // ✅ VALIDATION
    if (!form.departmentId) {
      setError('Please select a department.')
      return
    }

    const emptyGeneric = form.items.some(
      (i) => !i.genericNameId || i.requestedQty <= 0
    )
    if (emptyGeneric) {
      setError('Please fill all Generic Name and Qty fields before submitting.')
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

      if (!res.ok) throw new Error('Failed to create indent.')

      setSuccess('Indent created successfully.')
      setForm({
        requestedBy: localStorage.getItem('userId') ?? '',
        departmentId: null,
        remarks: '',
        items: [{ genericNameId: '', requestedQty: 1, remarks: '' }],
      })
    } catch (err) {
      setError((err as Error).message)
    }
  }

  /* ================= UI ================= */

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-3 mb-6">
        <h1 className="text-xl font-semibold">Add Indent</h1>
        <Button to={routePaths.INDENT} asLink>
          ← Back
        </Button>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl bg-white p-6 rounded-md shadow space-y-6"
      >
        {/* Inline Errors */}
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-2">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 text-green-700 p-2 rounded mb-2">
            {success}
          </div>
        )}

        {/* Department */}
        <GroupInput>
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
            placeholder="Select department"
          />
        </GroupInput>

        {/* Remarks */}
        <GroupInput>
          <Label>Remarks</Label>
          <Input
            name="remarks"
            value={form.remarks}
            onChange={handleChange}
            placeholder="Optional remarks"
          />
        </GroupInput>

        {/* Items */}
        <div>
          {/* <Label className="mb-2 block">Generic Names</Label> */}

          {form.items.map((item, index) => {
            const selectedIds = form.items
              .filter((_, i) => i !== index)
              .map((i) => i.genericNameId)
            const availableGenerics = genericNames.filter(
              (g) => !selectedIds.includes(g.id)
            )

            return (
              <div key={index} className="grid grid-cols-12 gap-2 mb-2">
                {/* Generic Name */}
                <div className="col-span-5">
                  <Label className="text-sm">Generic Name</Label>
                  <Dropdown
                    options={availableGenerics}
                    selected={
                      availableGenerics.find(
                        (g) => g.id === item.genericNameId
                      ) ??
                      genericNames.find((g) => g.id === item.genericNameId) ??
                      null
                    }
                    onSelect={(opt) =>
                      updateItem(index, 'genericNameId', opt.id)
                    }
                  />
                </div>

                {/* Qty */}
                <div className="col-span-3">
                  <Label className="text-sm">Qty</Label>
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

                {/* Item Remarks */}
                <div className="col-span-3">
                  <Label className="text-sm">Remarks</Label>
                  <Input
                    value={item.remarks}
                    onChange={(e) =>
                      updateItem(index, 'remarks', e.target.value)
                    }
                    onKeyDown={(e) => handleItemKeyDown(e, index)}
                  />
                </div>

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="col-span-1 text-red-500 font-bold mt-6"
                  tabIndex={-1}
                >
                  ✕
                </button>
              </div>
            )
          })}
        </div>

        {/* Submit */}
        <Button ref={submitRef} type="submit">
          Create Indent
        </Button>
      </form>
    </>
  )
}

export default AddIndent
