import { useEffect, useState } from 'react'
import Button from '../../../components/button/Button'
import { Input } from '../../../components/input/Input'
import Loading from '../../../components/loading/Loading'
import { routePaths } from '../../../constants/routePaths'

interface DosageForm {
  id: number
  name: string
  description?: string
  status: boolean
}

const DosageForm = () => {
  const [dosageForms, setDosageForms] = useState<DosageForm[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const API_BASE = import.meta.env.VITE_API_BASE_URL
  const token = localStorage.getItem('token')

  /* ================= FETCH DOSAGE FORMS ================= */
  const fetchDosageForms = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_BASE}/api/dosage-form`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data?.message || 'Failed to fetch dosage forms')
      }

      const data = await res.json()
      setDosageForms(data.data || data)
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message)
      else setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDosageForms()
  }, [])

  /* ================= SEARCH FILTER ================= */
  const filteredDosageForms = dosageForms.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-10 relative">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center w-full border-b pb-3">
        <p className="text-xl font-semibold">Dosage Form Management</p>

        <div className="flex items-center gap-5 min-w-[350px]">
          {/* Search */}
          <div className="flex items-center gap-2 py-1.5 w-full rounded-lg border px-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 20 20"
            >
              <g stroke="none" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <g stroke="#000" strokeWidth="2">
                  <circle cx="7.5" cy="7.5" r="7.5" />
                  <path d="M18 18l-5.2-5.2" />
                </g>
              </g>
            </svg>

            <Input
              type="text"
              placeholder="Search dosage form..."
              variant="none"
              className="outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Button asLink to={routePaths.ADD_DOSAGE_FORM}>
            + Add Dosage Form
          </Button>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="relative overflow-x-auto shadow-lg rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-white uppercase bg-dark">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {/* Loading */}
            {loading && (
              <tr>
                <td colSpan={4} className="text-center py-6">
                  <Loading />
                </td>
              </tr>
            )}

            {/* Error */}
            {!loading && error && (
              <tr>
                <td colSpan={4} className="text-center text-red-500 py-4">
                  {error}
                </td>
              </tr>
            )}

            {/* Empty */}
            {!loading && !error && filteredDosageForms.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-6">
                  No dosage forms found
                </td>
              </tr>
            )}

            {/* Data */}
            {!loading &&
              !error &&
              filteredDosageForms.map((form) => (
                <tr
                  key={form.id}
                  className="bg-[#DFDEDE] border-b transition-colors"
                >
                  <td className="px-6 py-3 font-medium">{form.id}</td>

                  <td className="px-6 py-3 font-semibold">{form.name}</td>

                  <td className="px-6 py-3">
                    {form.description
                      ? form.description.length > 40
                        ? `${form.description.slice(0, 40)}...`
                        : form.description
                      : '-'}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-[10px] h-[10px] rounded-full ${
                          form.status ? 'bg-[#00cc00]' : 'bg-[#cc0000]'
                        }`}
                      />
                      {form.status ? 'Active' : 'Inactive'}
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <Button>
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DosageForm
