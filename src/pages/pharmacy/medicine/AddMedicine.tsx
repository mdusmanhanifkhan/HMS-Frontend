import { useState, useEffect } from 'react'
import { Label } from '../../../components/input/Label'
import Button from '../../../components/button/Button'
import { routePaths } from '../../../constants/routePaths'
import { GroupInput } from '../../../components/input/GroupInput'
import ToggleButton from '../../../components/button/ToggleButton'
import { Input } from '../../../components/input/Input'
import TextArea from '../../../components/input/TextArea'
import SuccessMessage from '../../../components/error-handling/SuccessMessage'
import Dropdown from '../../../components/input/Dropdown'

interface Option {
  id: number
  name: string
}

interface MedicineForm {
  name: string
  genericName: Option | null
  company: Option | null
  category: Option | null
  dosageForm: Option | null
  unitPacking: Option | null // <-- changed from string
  description: string
  isActive: boolean
}

interface UnitAPI {
  id: number
  value: string
  unit: string
  label: string
  status: boolean
}


export default function AddMedicine() {
  const [form, setForm] = useState<MedicineForm>({
    name: '',
    genericName: null,
    company: null,
    category: null,
    dosageForm: null,
    unitPacking: null, // <-- changed
    description: '',
    isActive: true,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [companies, setCompanies] = useState<Option[]>([])
  const [categories, setCategories] = useState<Option[]>([])
  const [dosageForms, setDosageForms] = useState<Option[]>([])
  const [genericNames, setGenericNames] = useState<Option[]>([])
  const [units, setUnits] = useState<Option[]>([]) // <-- new

  const API_BASE = import.meta.env.VITE_API_BASE_URL
  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [companiesRes, categoriesRes, dosageRes, genericRes, unitsRes] =
          await Promise.all([
            fetch(`${API_BASE}/api/company`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`${API_BASE}/api/medicine-category`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`${API_BASE}/api/dosage-form`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`${API_BASE}/api/generic-name`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`${API_BASE}/api/unit-active`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ])

        const [
          companiesData,
          categoriesData,
          dosageData,
          genericData,
          unitsData,
        ] = await Promise.all([
          companiesRes.json(),
          categoriesRes.json(),
          dosageRes.json(),
          genericRes.json(),
          unitsRes.json(),
        ])

        setCompanies(companiesData.data || [])
        setCategories(categoriesData.data || [])
        setDosageForms(dosageData.data || [])
        setGenericNames(genericData.data || [])
        setUnits(
          (unitsData || []).map((u: UnitAPI) => ({
            id: u.id,
            name: u.label,
          }))
        )
      } catch (err) {
        console.error('Failed to fetch dropdowns', err)
      }
    }

    fetchDropdowns()
  }, [])

  console.log(units)

  // handleChange now works for both input and textarea
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target
    setForm((prev) => ({ ...prev, [id]: value }))
  }

  const handleToggle = () => {
    setForm((prev) => ({ ...prev, isActive: !prev.isActive }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!form.name) return setError('Medicine Name is required')
    if (!form.genericName) return setError('Generic Name is required')
    if (!form.unitPacking) return setError('Unit is required') // <-- validate dropdown

    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/medicine`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          genericNameId: form.genericName?.id,
          companyId: form.company?.id,
          categoryId: form.category?.id,
          dosageFormId: form.dosageForm?.id,
          unitId: form.unitPacking?.id, // <-- send unitId instead of text
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data?.message || 'Failed to save medicine')
      }

      setSuccess('Medicine added successfully!')
      setForm({
        name: '',
        genericName: null,
        company: null,
        category: null,
        dosageForm: null,
        unitPacking: null,
        description: '',
        isActive: true,
      })
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message)
      else setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="flex flex-col gap-10" onSubmit={handleSubmit}>
      <div className="flex justify-between items-center border-b pb-3">
        <p className="text-xl font-semibold w-full">Add Medicine</p>
        <Button to={routePaths.MEDICINE} asLink>
          Back
        </Button>
      </div>

      {error && <p className="text-red-600 font-medium">{error}</p>}
      {success && <SuccessMessage msg={success} />}

      <div className="grid grid-cols-3 gap-4 max-w-[1100px]">
        <GroupInput className="col-span-full">
          <Label>Status</Label>
          <ToggleButton
            id="isActive"
            checked={form.isActive}
            onChange={handleToggle}
          />
        </GroupInput>

        <GroupInput>
          <Label required="true">Medicine Name</Label>
          <Input
            id="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter Medicine Name"
          />
        </GroupInput>

        <GroupInput>
          <Label required="true">Generic Name</Label>
          <Dropdown
            options={genericNames}
            selected={form.genericName || null}
            onSelect={(opt) =>
              setForm((prev) => ({
                ...prev,
                genericName: opt
                  ? { id: Number(opt.id), name: opt.name }
                  : null,
              }))
            }
            placeholder="Select Generic Name"
          />
        </GroupInput>

        <GroupInput>
          <Label>Company</Label>
          <Dropdown
            options={companies}
            selected={form.company || null}
            onSelect={(opt) =>
              setForm((prev) => ({
                ...prev,
                company: opt ? { id: Number(opt.id), name: opt.name } : null,
              }))
            }
            placeholder="Select Company"
          />
        </GroupInput>

        <GroupInput>
          <Label>Category</Label>
          <Dropdown
            options={categories}
            selected={form.category || null}
            onSelect={(opt) =>
              setForm((prev) => ({
                ...prev,
                category: opt ? { id: Number(opt.id), name: opt.name } : null,
              }))
            }
            placeholder="Select Category"
          />
        </GroupInput>

        <GroupInput>
          <Label>Dosage Form</Label>
          <Dropdown
            options={dosageForms}
            selected={form.dosageForm || null}
            onSelect={(opt) =>
              setForm((prev) => ({
                ...prev,
                dosageForm: opt ? { id: Number(opt.id), name: opt.name } : null,
              }))
            }
            placeholder="Select Dosage Form"
          />
        </GroupInput>

        {/* ✅ Unit / Packing as Dropdown */}
        <GroupInput>
          <Label required="true">Unit / Packing</Label>
          <Dropdown
            options={units}
            selected={form.unitPacking || null}
            onSelect={(opt) =>
              setForm((prev) => ({
                ...prev,
                unitPacking: opt
                  ? { id: Number(opt.id), name: opt.name }
                  : null,
              }))
            }
            placeholder="Select Unit"
          />
        </GroupInput>

        <GroupInput className="col-span-full">
          <Label>Description</Label>
          <TextArea
            id="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Optional notes"
          />
        </GroupInput>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Medicine'}
        </Button>
        <Button
          type="reset"
          onClick={() =>
            setForm({
              name: '',
              genericName: null,
              company: null,
              category: null,
              dosageForm: null,
              unitPacking: null,
              description: '',
              isActive: true,
            })
          }
        >
          Clear
        </Button>
      </div>
    </form>
  )
}
