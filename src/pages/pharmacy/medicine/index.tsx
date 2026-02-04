import { useEffect, useState } from 'react'
import Button from '../../../components/button/Button'
import { Input } from '../../../components/input/Input'
import { routePaths } from '../../../constants/routePaths'
import Loading from '../../../components/loading/Loading'

/* ================= TYPES ================= */

type DosageForm = {
  id: number
  name: string
}

type Category = {
  id: number
  name: string
}

type MedicineItem = {
  id: number
  name: string
  description?: string | null
  isActive: boolean
  dosageForm?: DosageForm | null
  category?: Category | null
}

/* ================= COMPONENT ================= */

const Medicine = () => {
  const [medicines, setMedicines] = useState<MedicineItem[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const [searchTerm, setSearchTerm] = useState<string>('')
  const [debouncedSearch, setDebouncedSearch] = useState<string>('')

  const API_BASE = import.meta.env.VITE_API_BASE_URL as string
  const token = localStorage.getItem('token')

  /* ================= DEBOUNCE SEARCH ================= */

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim())
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  /* ================= FETCH MEDICINES ================= */

  useEffect(() => {
    const controller = new AbortController()

    const fetchMedicines = async () => {
      try {
        setLoading(true)
        setError(null)

        const url = debouncedSearch
          ? `${API_BASE}/api/medicines/search?query=${encodeURIComponent(
              debouncedSearch
            )}`
          : `${API_BASE}/api/medicine`

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        })

        if (!res.ok) {
          const errJson: { message?: string } = await res.json()
          throw new Error(errJson.message || 'Failed to fetch medicines')
        }

        const json: { data?: MedicineItem[] } = await res.json()
        setMedicines(json.data ?? [])
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return

        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('Something went wrong')
        }

        setMedicines([])
      } finally {
        setLoading(false)
      }
    }

    fetchMedicines()

    return () => controller.abort()
  }, [debouncedSearch, API_BASE, token])

  /* ================= UI ================= */

  return (
    <div className="flex flex-col gap-10 relative">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center w-full border-b pb-3">
        <p className="text-xl font-semibold">Medicine Management</p>

        <div className="flex items-center gap-5 min-w-100">
          {/* Search */}
          <div className="flex items-center gap-2 py-1.5 w-full rounded-lg border px-2">
            <svg width="16" height="16" viewBox="0 0 20 20">
              <circle cx="7.5" cy="7.5" r="7.5" stroke="black" />
              <path d="M18 18l-5.2-5.2" stroke="black" />
            </svg>

            <Input
              type="text"
              placeholder="Search medicine..."
              variant="none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Button asLink to={routePaths.ADD_MEDICINE}>
            + Add Medicine
          </Button>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="relative overflow-x-auto shadow-lg rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-white uppercase bg-dark">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Medicine Name</th>
              <th className="px-6 py-4">Dosage Form</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {/* Loading */}
            {loading && (
              <tr>
                <td colSpan={6} className="text-center py-6">
                  <Loading />
                </td>
              </tr>
            )}

            {/* Error */}
            {!loading && error && (
              <tr>
                <td colSpan={6} className="text-center text-red-500 py-4">
                  {error}
                </td>
              </tr>
            )}

            {/* Empty */}
            {!loading && !error && medicines.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-6">
                  No medicines found
                </td>
              </tr>
            )}

            {/* Data */}
            {!loading &&
              !error &&
              medicines.map((med) => (
                <tr
                  key={med.id}
                  className="bg-[#DFDEDE] border-b hover:bg-gray-200 transition-colors"
                >
                  <td className="px-6 py-3 font-medium">{med.id}</td>

                  <td className="px-6 py-3 font-semibold">
                    {med.name}
                  </td>

                  <td className="px-6 py-3">
                    {med.dosageForm?.name ?? '-'}
                  </td>

                  <td className="px-6 py-3">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {med.category?.name ?? '-'}
                    </span>
                  </td>

                  <td className="px-6 py-3">
                    {med.description
                      ? med.description.length > 40
                        ? `${med.description.slice(0, 40)}...`
                        : med.description
                      : '-'}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <span
                        className={`w-[10px] h-[10px] rounded-full ${
                          med.isActive ? 'bg-[#00cc00]' : 'bg-[#cc0000]'
                        } block`}
                      />
                      {med.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Medicine
