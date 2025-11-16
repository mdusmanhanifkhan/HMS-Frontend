import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/button/Button'
import { routePaths } from '../../constants/routePaths'
import Loading from '../../components/loading/Loading'
import { Input } from '../../components/input/Input'

interface Department {
  id: number
  name: string
}

interface Procedure {
  id: number
  name: string
  shortCode?: string
  description?: string
  status: boolean
  department?: Department
}

const Procedures = () => {
  const [procedures, setProcedures] = useState<Procedure[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [debouncedSearch, setDebouncedSearch] = useState<string>('')
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
  const [procedureToDelete, setProcedureToDelete] = useState<Procedure | null>(null)

  const API_BASE = import.meta.env.VITE_API_BASE_URL
  const token = localStorage.getItem('token')

  if (!token) console.error('No token found. Users must login first.')

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 500)
    return () => clearTimeout(handler)
  }, [searchTerm])

  // Fetch procedures
  useEffect(() => {
    const controller = new AbortController()
    const fetchProcedures = async () => {
      if (!token) {
        setError('Authentication token missing')
        return
      }

      try {
        setLoading(true)
        setError(null)

        let url = `${API_BASE}/api/procedures`
        if (debouncedSearch.trim()) {
          url = `${API_BASE}/procedures/search?query=${encodeURIComponent(debouncedSearch)}`
        }

        const res = await fetch(url, {
          signal: controller.signal,
          headers: { Authorization: `Bearer ${token}` }, // ✅ add token here
        })
        if (!res.ok) {
          const errData = await res.json()
          throw new Error(errData.message || 'Failed to fetch procedures')
        }

        const data: { status: number; message: string; data: Procedure[] } = await res.json()
        setProcedures(data.data || [])
      } catch (err: unknown) {
        if (err instanceof Error) {
          if (err.name !== 'AbortError') {
            setError(err.message || 'Something went wrong')
            setProcedures([])
          }
        } else {
          setError('Something went wrong')
          setProcedures([])
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProcedures()
    return () => controller.abort()
  }, [debouncedSearch, token])

  // Open delete modal
  const handleDeleteClick = (proc: Procedure) => {
    setProcedureToDelete(proc)
    setDeleteModalOpen(true)
  }

  // Confirm delete
  const confirmDelete = async () => {
    if (!procedureToDelete || !token) return

    try {
      setLoading(true)
      const res = await fetch(`${API_BASE}/procedures/${procedureToDelete.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }, // ✅ add token here
      })
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.message || 'Failed to delete procedure')
      }
      setProcedures(prev => prev.filter(p => p.id !== procedureToDelete.id))
      setDeleteModalOpen(false)
      setProcedureToDelete(null)
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message)
      else setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="flex flex-col gap-10 relative">
      {/* Header */}
      <div className="flex justify-between items-center w-full border-b pb-3">
        <p className="text-xl font-semibold">Procedure Management</p>
        <div className="flex items-center gap-5 min-w-100">
          {/* Search Input */}
          <div className="flex items-center gap-2 py-1.5 w-full rounded-lg border px-2 border-gray placeholder:text-gray-100 placeholder:font-light">
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
              placeholder="Search procedures..."
              variant="none"
              className="outline-none "
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Add Procedure Button */}
          <Link to={routePaths.ADD_PROCEDURE}>
            <Button>+ Add Procedure</Button>
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="relative overflow-x-auto shadow-lg rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right">
          <thead className="text-xs text-white uppercase bg-dark">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Procedure Name</th>
              <th className="px-6 py-3">Procedure Code</th>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-6 text-center">
                  <Loading />
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={7} className="px-6 py-6 text-center text-red-500">
                  {error}
                </td>
              </tr>
            ) : procedures.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-6 text-center text-gray-500">
                  No procedures found.{' '}
                  <Link
                    to={routePaths.ADD_PROCEDURE}
                    className="text-blue-600 underline"
                  >
                    Add a procedure
                  </Link>
                </td>
              </tr>
            ) : (
              procedures.map((proc) => (
                <tr
                  key={proc.id}
                  className="bg-[#DFDEDE] border-b border-gray-200"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {proc.id}
                  </td>
                  <td className="px-6 py-4">{proc.name}</td>
                  <td className="px-6 py-4">{proc.shortCode || '-'}</td>
                  <td className="px-6 py-4">{proc.department?.name || '-'}</td>
                  <td className="px-6 py-4">
                    {proc.description?.length && proc.description.length > 45
                      ? `${proc.description.substring(0, 45)}...`
                      : proc.description || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <span
                        className={`w-[10px] h-[10px] rounded-full ${
                          proc.status ? 'bg-[#00cc00]' : 'bg-[#cc0000]'
                        } block`}
                      ></span>
                      {proc.status ? 'Active' : 'Inactive'}
                    </div>
                  </td>
                  <td className="px-6 py-4 flex items-center gap-2">
                    {/* Edit */}
                    <Link
                      to={`${routePaths.EDIT_PROCEDURE}/${proc.id}`}
                      className="bg-dark p-1 rounded-md group hover:bg-white border border-dark transition-all ease-linear duration-200"
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
                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteClick(proc)}
                      className="bg-dark p-1 rounded-md group hover:bg-white border border-dark transition-all ease-linear duration-200"
                    >
                      <svg
                        className="w-[18px] h-[18px] text-white group-hover:text-[#cc0000]"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
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

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && procedureToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#0000008a] z-50">
          <div className="bg-white p-6 rounded-md w-80 text-center">
            <p className="mb-4">
              Are you sure you want to delete <strong>{procedureToDelete.name}</strong>?
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={confirmDelete}>Yes, Delete</Button>
              <Button
                onClick={() => setDeleteModalOpen(false)}
                className="bg-gray-300 text-black"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Procedures
