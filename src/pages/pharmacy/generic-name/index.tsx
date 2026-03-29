import { useEffect, useState } from 'react'
import Button from '../../../components/button/Button'
import { Input } from '../../../components/input/Input'
import { routePaths } from '../../../constants/routePaths'
import { Link } from 'react-router-dom'
import Loading from '../../../components/loading/Loading'

/* ---------------- TYPES ---------------- */
interface GenericType {
  id: number
  name: string
  description?: string
  status: boolean
}

/* ---------------- COMPONENT ---------------- */
const GenericName = () => {
  const [items, setItems] = useState<GenericType[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const API_BASE = import.meta.env.VITE_API_BASE_URL
  const token = localStorage.getItem('token')

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch(`${API_BASE}/api/generic-name`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
      })

      if (res.status === 401 || res.status === 403) {
        throw new Error('Unauthorized. Please login again.')
      }

      if (!res.ok) {
        throw new Error('Failed to fetch data')
      }

      const data = await res.json()
      setItems(data.data || [])
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message)
      else setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  /* ---------------- SEARCH FILTER ---------------- */
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-10 relative">
      {/* Header */}
      <div className="flex justify-between items-center w-full border-b pb-3">
        <p className="text-xl font-semibold">Generic Names</p>

        <div className="flex items-center gap-5 min-w-100">
          {/* Search */}
          <div className="flex items-center gap-2 py-1.5 w-full rounded-lg border px-2 border-gray">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 20 20"
            >
              <g stroke="none" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <g stroke="#000" strokeWidth="2" transform="translate(-1687 -1941)">
                  <g transform="translate(1688 1942)">
                    <circle cx="7.5" cy="7.5" r="7.5" />
                    <path d="M18 18l-5.2-5.2" />
                  </g>
                </g>
              </g>
            </svg>

            <Input
              type="text"
              placeholder="Search generic name..."
              variant="none"
              className="outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Button asLink to={routePaths.ADD_GENERIC_NAME}>
            + Add Generic
          </Button>
        </div>
      </div>

      {/* Table */}
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
                <td colSpan={5}>
                  <div className="flex justify-center py-4">
                    <Loading />
                  </div>
                </td>
              </tr>
            )}

            {/* Error */}
            {!loading && error && (
              <tr>
                <td colSpan={5} className="py-4 text-center text-red-500">
                  {error}
                </td>
              </tr>
            )}

            {/* Empty */}
            {!loading && !error && filteredItems.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center">
                  No generic name found.
                </td>
              </tr>
            )}

            {/* Data */}
            {!loading &&
              !error &&
              filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className="bg-[#DFDEDE] border-b border-gray-200"
                >
                  <td className="px-6 py-4 font-medium">{item.id}</td>
                  <td className="px-6 py-4">{item.name}</td>
                  <td className="px-6 py-4">
                    {item.description && item.description.length > 45
                      ? `${item.description.substring(0, 45)}...`
                      : item.description || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <span
                        className={`w-[10px] h-[10px] rounded-full ${
                          item.status ? 'bg-[#00cc00]' : 'bg-[#cc0000]'
                        }`}
                      />
                      {item.status ? 'Active' : 'Inactive'}
                    </div>
                  </td>
                  <td className="px-6 py-4 flex items-center gap-2">
                    <Link
                      to={`${routePaths.GENERIC_NAME}/${item.id}`}
                      className="bg-dark p-1 rounded-md group hover:bg-white border border-dark transition-all duration-200"
                    >
                      <svg
                        className="w-[18px] h-[18px] text-white group-hover:text-dark"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <use href="/assets/svg/edit-icon.svg#edit-icon" />
                      </svg>
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default GenericName
