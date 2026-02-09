import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Label } from '../../../components/input/Label'
import Button from '../../../components/button/Button'
import { routePaths } from '../../../constants/routePaths'
import { GroupInput } from '../../../components/input/GroupInput'
import ToggleButton from '../../../components/button/ToggleButton'
import { Input } from '../../../components/input/Input'
import SuccessMessage from '../../../components/error-handling/SuccessMessage'
import Loading from '../../../components/loading/Loading'

interface UnitForm {
  value: number | ''
  unit: string
  status: boolean
}

const EditUnit = () => {
  const { id } = useParams()

  const [form, setForm] = useState<UnitForm>({
    value: '',
    unit: '',
    status: true,
  })

  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const API_BASE = import.meta.env.VITE_API_BASE_URL
  const token = localStorage.getItem('token')

  // 🔹 fetch unit by id
  useEffect(() => {
    const fetchUnit = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/unit/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) throw new Error('Failed to fetch unit')

        const data = await res.json()

        setForm({
          value: data.value,
          unit: data.unit,
          status: data.status,
        })
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message)
        else setError('Something went wrong')
      } finally {
        setPageLoading(false)
      }
    }

    fetchUnit()
  }, [id])

  // input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setForm((prev) => ({
      ...prev,
      [id]: id === 'value' ? Number(value) || '' : value,
    }))
  }

  // toggle
  const handleToggle = () => {
    setForm((prev) => ({ ...prev, status: !prev.status }))
  }

  // submit update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (form.value === '' || !form.unit) {
      setError('Value and Unit are required')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/unit/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Update failed')

      setSuccess('Medicine unit updated successfully!')
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message)
      else setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (pageLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loading />
      </div>
    )
  }

  return (
    <form className="flex flex-col gap-10" onSubmit={handleSubmit}>
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-3">
        <p className="text-xl font-semibold w-full">Edit Medicine Unit</p>
        <Button to={routePaths.UNIT} asLink>
          Back
        </Button>
      </div>

      {/* Error / Success */}
      {error && <p className="text-red-600 font-medium">{error}</p>}
      {success && <SuccessMessage msg={success} />}

      {/* FORM */}
      <div className="grid grid-cols-3 gap-4 max-w-[700px]">
        {/* Status */}
        <GroupInput className="col-span-full">
          <Label>Status</Label>
          <ToggleButton checked={form.status} onChange={handleToggle} />
        </GroupInput>

        {/* Value */}
        <GroupInput className="col-span-full">
          <Label required="true">Value</Label>
          <Input
            id="value"
            type="number"
            value={form.value}
            onChange={handleChange}
            placeholder="e.g. 500"
          />
        </GroupInput>

        {/* Unit */}
        <GroupInput className="col-span-full">
          <Label required="true">Unit</Label>
          <Input
            id="unit"
            value={form.unit}
            onChange={handleChange}
            placeholder="e.g. mg, ml"
          />
        </GroupInput>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Unit'}
        </Button>
      </div>
    </form>
  )
}

export default EditUnit
