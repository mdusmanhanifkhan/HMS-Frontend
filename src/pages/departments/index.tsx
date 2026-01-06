import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Button from '../../components/button/Button'
import { routePaths } from '../../constants/routePaths'
import Loading from '../../components/loading/Loading'
import { Input } from '../../components/input/Input'
import { usePermissions } from '../../context/PermissionsContext'
import DeleteModal from '../../components/modal/DeleteModal'

interface Department {
  id: number
  name: string
  shortCode?: string
  description?: string
  location?: string
  timeFrom?: string
  timeTo?: string
  status: boolean
}

const Departments: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generalError, setGeneralError] = useState<string | null>(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDept, setSelectedDept] = useState<Department | null>(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  const API_BASE = import.meta.env.VITE_API_BASE_URL
  const token = localStorage.getItem('token')
  const { role } = usePermissions()

  // 🔹 Debounce search
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 500)
    return () => clearTimeout(handler)
  }, [searchTerm])

  // 🔹 Fetch departments
  useEffect(() => {
    const controller = new AbortController()
    const fetchDepartments = async () => {
      try {
        setLoading(true)
        setError(null)

        const url = debouncedSearch
          ? `${API_BASE}/api/department?search=${debouncedSearch}`
          : `${API_BASE}/api/department`

        const res = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        })

        if (!res.ok) throw new Error('Failed to fetch departments')

        const data = await res.json()
        setDepartments(data.data || [])
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message)
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchDepartments()
    return () => controller.abort()
  }, [API_BASE, debouncedSearch, token])

  // 🔹 Delete department
  const handleDelete = async () => {
    if (!selectedDept) return

    try {
      setError(null)

      const res = await fetch(`${API_BASE}/api/department/${selectedDept.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()

      if (!res.ok) {
        setGeneralError(data.general_error || 'Something went wrong while deleting')
        return
      }

      setDepartments((prev) => prev.filter((d) => d.id !== selectedDept.id))
      setIsModalOpen(false)
      setSelectedDept(null)
    } catch (err) {
      if (err instanceof Error) setError(err.message)
    }
  }

  return (
    <>
      {/* Delete Modal */}
      {isModalOpen && selectedDept && (
        <DeleteModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleDelete}
          itemName={`${selectedDept.name || ''} Department`}
          errorMessage={generalError ?? undefined}
        />
      )}

      {/* Main Content */}
      <div className="flex flex-col gap-10">
        {/* Header */}
        <div className="flex justify-between items-center w-full border-b pb-3">
          <p className="text-xl font-semibold">Department Management</p>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2 py-1.5 w-full min-w-64 rounded-lg border px-2 border-gray placeholder:text-gray-100 placeholder:font-light">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 20 20"
                id="search"
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
              <Input
                type="text"
                placeholder="Search departments..."
                value={searchTerm}
                variant="none"
                className="outline-none"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Link to={routePaths.ADD_DEPARTMENT}>
              <Button>+ Add Department</Button>
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="relative overflow-x-auto shadow-lg rounded-lg">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-white uppercase bg-dark">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Department Name</th>
                <th className="px-6 py-4">Short Code</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Timings</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {/* Loading */}
              {loading && (
                <tr>
                  <td colSpan={8}>
                    <div className="flex justify-center py-4">
                      <Loading />
                    </div>
                  </td>
                </tr>
              )}

              {/* Error */}
              {!loading && error && (
                <tr>
                  <td colSpan={8} className="py-4 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              )}

              {/* Empty */}
              {!loading && !error && departments.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center">
                    No departments found.
                  </td>
                </tr>
              )}

              {/* Data Rows */}
              {!loading &&
                !error &&
                departments.length > 0 &&
                departments.map((dept) => (
                  <tr
                    key={dept.id}
                    className="bg-[#DFDEDE] border-b border-gray-200"
                  >
                    <td className="px-6 py-4 font-medium">{dept.id}</td>
                    <td className="px-6 py-4">{dept.name}</td>
                    <td className="px-6 py-4">{dept.shortCode || '-'}</td>
                    <td className="px-6 py-4">
                      {dept.description
                        ? dept.description.length > 45
                          ? `${dept.description.substring(0, 45)}...`
                          : dept.description
                        : '-'}
                    </td>
                    <td className="px-6 py-4">{dept.location || '-'}</td>
                    <td className="px-6 py-4">
                      {dept.timeFrom && dept.timeTo
                        ? `${dept.timeFrom} - ${dept.timeTo}`
                        : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <span
                          className={`w-[10px] h-[10px] rounded-full ${
                            dept.status ? 'bg-green' : 'bg-red'
                          } block`}
                        ></span>
                        {dept.status ? 'Active' : 'Inactive'}
                      </div>
                    </td>

                    <td className="px-6 py-4 flex items-center gap-2">
                      <Link
                        to={`${routePaths.EDIT_DEPARTMENT}/${dept.id}`}
                        className="bg-dark p-1 rounded-md group hover:bg-white border border-dark transition-all"
                      >
                        <svg
                          className="w-[18px] h-[18px] text-white group-hover:text-dark"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <use href="/assets/svg/edit-icon.svg#edit-icon" />
                        </svg>
                      </Link>
                      {role === 'developer' ? (
                        <button
                          onClick={() => {
                            setIsModalOpen(true)
                            setSelectedDept(dept)
                          }}
                          className="bg-dark p-1 rounded-md group hover:bg-white border border-dark transition-all cursor-pointer"
                        >
                          <svg
                            className="w-[18px] h-[18px] text-white group-hover:text-red"
                            viewBox="0 0 12 12"
                            fill="none"
                          >
                            <use href="/assets/svg/delete-icon.svg#delete-icon" />
                          </svg>
                        </button>
                      ) : (
                        ''
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default Departments
