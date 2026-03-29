import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Label } from '../../../components/input/Label'
import Button from '../../../components/button/Button'
import { routePaths } from '../../../constants/routePaths'
import { GroupInput } from '../../../components/input/GroupInput'
import ToggleButton from '../../../components/button/ToggleButton'
import { Input } from '../../../components/input/Input'
import SuccessMessage from '../../../components/error-handling/SuccessMessage'
import Loading from '../../../components/loading/Loading'

interface GenericForm {
  name: string
  status: boolean
}

const EditGenericName = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [form, setForm] = useState<GenericForm>({
    name: '',
    status: true,
  })

  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const API_BASE = import.meta.env.VITE_API_BASE_URL
  const token = localStorage.getItem('token')

  /* ---------------- FETCH BY ID ---------------- */
  const fetchGeneric = async () => {
    if (!id) return

    try {
      setPageLoading(true)
      setError('')

      const res = await fetch(`${API_BASE}/api/generic-name/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.message || 'Failed to fetch generic name')
      }

      setForm({
        name: data.data.name || '',
        status: data.data.status ?? true,
      })
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message)
      else setError('Something went wrong')
    } finally {
      setPageLoading(false)
    }
  }

  useEffect(() => {
    fetchGeneric()
  }, [id])

  /* ---------------- HANDLE INPUT ---------------- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setForm((prev) => ({ ...prev, [id]: value }))
  }

  const handleToggle = () => {
    setForm((prev) => ({ ...prev, status: !prev.status }))
  }

  /* ---------------- SUBMIT UPDATE ---------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!form.name.trim()) {
      setError('Generic name is required')
      return
    }

    try {
      setLoading(true)

      const res = await fetch(`${API_BASE}/api/generic-name/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.message || 'Failed to update generic name')
      }

      setSuccess('Generic name updated successfully!')

      // Optional: redirect after 1.5s
      setTimeout(() => {
        navigate(routePaths.GENERIC_NAME)
      }, 1500)
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
        <p className="text-xl font-semibold w-full">Edit Generic Name</p>
        <Button to={routePaths.GENERIC_NAME} asLink>
          Back
        </Button>
      </div>

      {/* Error / Success */}
      {error && <p className="text-red-600 font-medium">{error}</p>}
      {success && <SuccessMessage msg={success} />}

      {/* Form Fields */}
      <div className="grid grid-cols-3 gap-4 max-w-[700px]">
        {/* Status */}
        <GroupInput className="col-span-full">
          <Label>Status</Label>
          <ToggleButton checked={form.status} onChange={handleToggle} />
        </GroupInput>

        {/* Name */}
        <GroupInput className="col-span-full">
          <Label required="true">Generic Name</Label>
          <Input
            id="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter Generic Name"
          />
        </GroupInput>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Generic Name'}
        </Button>

        <Button
          type="button"
          onClick={() =>
            setForm({
              name: '',
              status: true,
            })
          }
        >
          Clear
        </Button>
      </div>
    </form>
  )
}

export default EditGenericName
