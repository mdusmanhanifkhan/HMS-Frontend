import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Button from '../../components/button/Button'
import { routePaths } from '../../constants/routePaths'
import Loading from '../../components/loading/Loading'
import { Input } from '../../components/input/Input'

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

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDept, setSelectedDept] = useState<Department | null>(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  const API_BASE = import.meta.env.VITE_API_BASE_URL
   const token = localStorage.getItem('token')

  // 🔹 Debounce search input
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
          headers: { 'Content-Type': 'application/json' , Authorization: `Bearer ${token}`},
          signal: controller.signal,
        })

        if (!res.ok) throw new Error(res.statusText)

        const data = await res.json()
        setDepartments(data.data || [])
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchDepartments()
    return () => controller.abort()
  }, [API_BASE, debouncedSearch])

  // 🔹 Delete department
  const handleDelete = async () => {
    if (!selectedDept) return

    try {
      const res = await fetch(`${API_BASE}/api/department/${selectedDept.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' , Authorization: `Bearer ${token}`},
      })

      if (!res.ok) throw new Error('Failed to delete department')

      setDepartments((prev) => prev.filter((d) => d.id !== selectedDept.id))
      setIsModalOpen(false)
      setSelectedDept(null)
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message || 'Something went wrong while deleting')
      }
    }
  }

  return (
    <>
      {/* Delete Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this department?</p>
            <div className="flex justify-end gap-3 mt-6">
              <Button
                type="button"
                className="bg-gray-400 hover:bg-gray-500"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="bg-red-600 hover:bg-red-700"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col gap-10">
        {/* Header */}
        <div className="flex justify-between items-center w-full border-b pb-3">
          <p className="text-xl font-semibold">Department Management</p>
          <div className="flex items-center gap-5">
            {/* Search Input */}
            <div className="flex items-center gap-2 py-1.5 w-full rounded-lg outline-none border px-2 border-gray placeholder:text-gray-100 placeholder:font-light min-w-64">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="none"
              >
                <circle
                  cx="7.5"
                  cy="7.5"
                  r="7.5"
                  stroke="#000"
                  strokeWidth="2"
                />
                <path
                  d="M18 18l-5.2-5.2"
                  stroke="#000"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
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
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Department Name</th>
                <th className="px-6 py-3">Short Code</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3">Timings</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-4 text-center">
                    <Loading />
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={8} className="py-4 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : departments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-4 text-center">
                    No departments found.{' '}
                    <Link
                      to={routePaths.ADD_DEPARTMENT}
                      className="text-blue-500 underline"
                    >
                      Go to add department
                    </Link>
                  </td>
                </tr>
              ) : (
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
                            dept.status ? 'bg-green-500' : 'bg-red-500'
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

                      <button
                        onClick={() => {
                          setIsModalOpen(true)
                          setSelectedDept(dept)
                        }}
                        className="bg-dark p-1 rounded-md group hover:bg-white border border-dark transition-all"
                      >
                        <svg
                          className="w-[18px] h-[18px] text-white group-hover:text-red-600"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <use href="/assets/svg/delete-icon.svg#delete-icon" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default Departments
