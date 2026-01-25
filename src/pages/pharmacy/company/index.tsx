import { useEffect, useState } from 'react'
import Button from '../../../components/button/Button'
import { Input } from '../../../components/input/Input'
import { routePaths } from '../../../constants/routePaths'

interface CompanyType {
  id: number
  name: string
  shortCode?: string
  location?: string
  description?: string
  status: boolean
}

const Company = () => {
  const [companies, setCompanies] = useState<CompanyType[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const API_BASE = import.meta.env.VITE_API_BASE_URL
  const token = localStorage.getItem('token')

  const fetchCompanies = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch(`${API_BASE}/api/company`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
      })

      // 🔹 Handle auth errors
      if (res.status === 401 || res.status === 403) {
        throw new Error('Unauthorized. Please login again.')
      }

      if (!res.ok) {
        throw new Error('Failed to fetch companies')
      }

      const data = await res.json()

      // expected: { success: true, data: [...] }
      setCompanies(data.data || [])
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Something went wrong')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCompanies()
  }, [])

  // 🔹 Filter by search
  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-10 relative">
      {/* Header */}
      <div className="flex justify-between items-center w-full border-b pb-3">
        <p className="text-xl font-semibold">Company Management</p>
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

            <Input
              type="text"
              placeholder="Search company..."
              variant="none"
              className="outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Button asLink={true} to={routePaths.ADD_COMPANY}>
            + Add Company
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
              <th className="px-6 py-4">Code</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y">
            {/* 🔹 Loading */}
            {loading && (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500">
                  Loading companies...
                </td>
              </tr>
            )}

            {/* 🔹 Error */}
            {error && !loading && (
              <tr>
                <td colSpan={7} className="text-center py-6 text-red-500">
                  {error}
                </td>
              </tr>
            )}

            {/* 🔹 No Data */}
            {!loading && !error && filteredCompanies.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-400">
                  No companies found
                </td>
              </tr>
            )}

            {/* 🔹 Data Rows */}
            {!loading &&
              !error &&
              filteredCompanies.map((company) => (
                <tr key={company.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{company.id}</td>
                  <td className="px-6 py-4 font-medium">{company.name}</td>
                  <td className="px-6 py-4">{company.shortCode || '-'}</td>
                  <td className="px-6 py-4">{company.location || '-'}</td>
                  <td className="px-6 py-4">{company.description || '-'}</td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    {company.status ? (
                      <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">
                        Active
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-700">
                        Inactive
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 flex gap-2">
                    <Button>Edit</Button>
                    <Button>Delete</Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Company
