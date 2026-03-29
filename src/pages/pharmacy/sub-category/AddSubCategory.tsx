import { useState, useEffect } from 'react'
import { Label } from '../../../components/input/Label'
import Button from '../../../components/button/Button'
import { routePaths } from '../../../constants/routePaths'
import { GroupInput } from '../../../components/input/GroupInput'
import ToggleButton from '../../../components/button/ToggleButton'
import { Input } from '../../../components/input/Input'
import SuccessMessage from '../../../components/error-handling/SuccessMessage'
import Dropdown from '../../../components/input/Dropdown'

interface SubCategoryForm {
  name: string
  parentId: number | null
  isActive: boolean
}

interface CategoryOption {
  id: number
  name: string
}

const AddSubCategory = () => {
  const [form, setForm] = useState<SubCategoryForm>({
    name: '',
    parentId: null,
    isActive: true,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [categories, setCategories] = useState<CategoryOption[]>([])

  const API_BASE = import.meta.env.VITE_API_BASE_URL
  const token = localStorage.getItem('token')

  // Fetch top-level parent categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/category`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error('Failed to fetch parent categories')
        const data = await res.json()
        setCategories(data.data || [])
      } catch (err: unknown) {
        console.error(err)
      }
    }
    fetchCategories()
  }, [])

  // Toggle active/inactive
  const handleToggle = () => {
    setForm((prev) => ({ ...prev, isActive: !prev.isActive }))
  }

  // Handle parent selection
  const handleParentSelect = (option: { id: string | number; name: string }) => {
    setForm((prev) => ({ ...prev, parentId: Number(option.id) }))
  }

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!form.name) {
      setError('Subcategory Name is required')
      return
    }

    if (!form.parentId) {
      setError('Please select a parent category')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/sub-category`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data?.message || 'Something went wrong')
      }

      setSuccess('Subcategory added successfully!')
      setForm({ name: '', parentId: null, isActive: true })
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message)
      else setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="flex flex-col gap-10" onSubmit={handleSubmit}>
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-3">
        <p className="text-xl font-semibold w-full">Add Subcategory</p>
        <Button to={routePaths.CATEGORY} asLink>
          Back
        </Button>
      </div>

      {/* Error / Success */}
      {error && <p className="text-red-600 font-medium">{error}</p>}
      {success && <SuccessMessage msg={success} />}

      {/* Form */}
      <div className="grid grid-cols-3 gap-4 max-w-[700px]">
        {/* Status */}
        <GroupInput className="col-span-full">
          <Label>Status</Label>
          <ToggleButton id="isActive" checked={form.isActive} onChange={handleToggle} />
        </GroupInput>

        {/* Name */}
        <GroupInput className="col-span-full">
          <Label required="true">Subcategory Name</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Enter Subcategory Name"
          />
        </GroupInput>

        {/* Parent Category Dropdown */}
        <GroupInput className="col-span-full">
          <Label required="true">Parent Category</Label>
          <Dropdown
            options={categories}
            selected={
              form.parentId
                ? categories.find((c) => c.id === form.parentId) || null
                : null
            }
            onSelect={handleParentSelect}
            placeholder="Select parent category..."
          />
        </GroupInput>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Subcategory'}
        </Button>
        <Button
          type="reset"
          onClick={() => setForm({ name: '', parentId: null, isActive: true })}
        >
          Clear
        </Button>
      </div>
    </form>
  )
}

export default AddSubCategory