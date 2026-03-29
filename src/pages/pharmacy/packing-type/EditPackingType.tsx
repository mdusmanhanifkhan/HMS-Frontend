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

interface PackingTypeForm {
  name: string
  status: boolean
}

const EditPackingType = () => {
  const { id } = useParams()

  const [form, setForm] = useState<PackingTypeForm>({
    name: '',
    status: true,
  })

  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const API_BASE = import.meta.env.VITE_API_BASE_URL
  const token = localStorage.getItem('token')

  /* ================= FETCH SINGLE ================= */
  useEffect(() => {
    const fetchPackingType = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/packing-type/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await res.json()
        if (!res.ok) throw new Error(data?.message || 'Failed to fetch')

        setForm({
          name: data?.data?.name || '',
          status: data?.data?.status ?? true,
        })
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message)
        else setError('Something went wrong')
      } finally {
        setPageLoading(false)
      }
    }

    if (id) fetchPackingType()
  }, [id])

  /* ================= INPUT ================= */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setForm((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  /* ================= TOGGLE ================= */
  const handleToggle = () => {
    setForm((prev) => ({ ...prev, status: !prev.status }))
  }

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!form.name.trim()) {
      setError('Packing Type Name is required')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/packing-type/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name.trim(),
          status: form.status,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Update failed')

      setSuccess('Packing Type updated successfully!')
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message)
      else setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  /* ================= LOADING ================= */
  if (pageLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loading />
      </div>
    )
  }

  return (
    <form className="flex flex-col gap-10" onSubmit={handleSubmit}>
      {/* HEADER */}
      <div className="flex justify-between items-center border-b pb-3">
        <p className="text-xl font-semibold w-full">Edit Packing Type</p>
        <Button to={routePaths.PACKING_TYPE} asLink>
          Back
        </Button>
      </div>

      {/* MESSAGES */}
      {error && <p className="text-red-600 font-medium">{error}</p>}
      {success && <SuccessMessage msg={success} />}

      {/* FORM */}
      <div className="grid grid-cols-3 gap-4 max-w-[700px]">
        {/* Status */}
        <GroupInput className="col-span-full">
          <Label>Status</Label>
          <ToggleButton checked={form.status} onChange={handleToggle} />
        </GroupInput>

        {/* Name */}
        <GroupInput className="col-span-full">
          <Label required="true">Name</Label>
          <Input
            id="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Box, Bottle, Strip"
          />
        </GroupInput>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Packing Type'}
        </Button>
      </div>
    </form>
  )
}

export default EditPackingType