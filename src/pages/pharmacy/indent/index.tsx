import { useEffect, useState } from 'react'
import Loading from '../../../components/loading/Loading'
import Button from '../../../components/button/Button'

interface Option {
  id: number
  name: string
}

interface IndentItem {
  id: number
  indentId: number
  genericNameId: number
  requestedQty: number
  approvedQty?: number | null
  pendingQty?: number | null
  lastPurchaseRate?: number | null
  remarks?: string | null
  medicineId?: number | null
  medicine?: Medicine | null
  genericName?: Option | null // added for TypeScript safety
  createdAt: string
}

interface Medicine {
  id: number
  name: string
  genericName?: Option | null
  company?: Option | null
  category?: Option | null
  dosageForm?: Option | null
  unitPacking?: string
  description?: string
  isActive: boolean
}
interface User {
  id: number
  name: string
}

interface Indent {
  id: number
  indentNo: string
  indentDate: string
  requestedBy: User
  department?: {
    id: number
    name: string
  }
  approvedBy?: User | null
  status: string
  remarks?: string
  createdAt: string
  updatedAt: string
  items: IndentItem[]
}

interface User {
  id: number
  name: string
}

const IndentList = () => {
  const [indents, setIndents] = useState<Indent[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [search, setSearch] = useState('')
  const [error, setError] = useState<string | null>(null)
  const API_BASE = import.meta.env.VITE_API_BASE_URL
  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchIndents = async () => {
      if (!token) {
        setError('Authentication token missing')
        return
      }

      try {
        setLoading(true)
        const res = await fetch(`${API_BASE}/api/indent-pagi`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) {
          const errData = await res.json()
          throw new Error(errData.message || 'Failed to fetch indents')
        }
        const data = await res.json()
        setIndents(data.data || [])
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message)
        else setError('Something went wrong')
      } finally {
        setLoading(false)
      }
    }

    fetchIndents()
  }, [token])

  console.log(indents)

  const filteredIndents = indents?.filter(
    (indent) =>
      indent.indentNo?.toLowerCase().includes(search.toLowerCase()) ||
      indent.status.toLowerCase().includes(search.toLowerCase()) ||
      indent.requestedBy?.name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center w-full border-b pb-3">
        <p className="text-xl font-semibold">Indent Management</p>
        <div className="flex items-center gap-5 min-w-100">
          {/* Search Input */}
          <div className="flex items-center gap-2 py-1.5 w-full rounded-lg border px-2 border-gray">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 20 20"
            >
              <g
                stroke="none"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <g
                  stroke="#000"
                  strokeWidth="2"
                  transform="translate(-1687 -1941)"
                >
                  <g transform="translate(1688 1942)">
                    <circle cx="7.5" cy="7.5" r="7.5"></circle>
                    <path d="M18 18l-5.2-5.2"></path>
                  </g>
                </g>
              </g>
            </svg>

            <input
              type="text"
              placeholder="Search indent..."
              className="outline-none w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Add Indent Button */}
          <Button asLink={true} to={'/indent/add'}>
            + Create Indent
          </Button>
        </div>
      </div>

      <div className="relative overflow-x-auto shadow-lg rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-white uppercase bg-dark">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Indent No</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Requested By</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={9}>
                  <div className="flex justify-center py-4">
                    <Loading />
                  </div>
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={9} className="py-4 text-center text-red-500">
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && filteredIndents.length === 0 && (
              <tr>
                <td colSpan={9} className="py-6 text-center">
                  No indents found.
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              filteredIndents.map((indent) => (
                <tr
                  key={indent.id}
                  className="bg-[#DFDEDE] border-b border-gray-200"
                >
                  <td className="px-6 py-4">{indent.id}</td>
                  <td className="px-6 py-4">{indent.indentNo}</td>
                  <td className="px-6 py-4">
                    {new Date(indent.indentDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">{indent?.requestedBy?.name}</td>
                  <td className="px-6 py-4">{indent?.department?.name}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-white text-sm font-semibold ${
                        indent.status === 'PENDING'
                          ? 'bg-yellow-100'
                          : indent.status === 'OPEN'
                            ? 'bg-blue-500'
                            : indent.status === 'APPROVED'
                              ? 'bg-green'
                              : indent.status === 'REJECTED'
                                ? 'bg-red'
                                : 'bg-gray-200'
                      }`}
                    >
                      {indent.status}
                    </span>
                  </td>

                  <td className="px-6 py-4">{indent.remarks || '-'}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default IndentList
