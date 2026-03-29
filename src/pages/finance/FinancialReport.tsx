import { useEffect, useState } from 'react'
import Loading from '../../components/loading/Loading'

/* ---------------- TYPES ---------------- */
type DepartmentRevenue = {
  department: string
  revenue: number
}

type ReceptionRevenue = {
  user: string
  revenue: number
}

type ApiResponse = {
  departments: DepartmentRevenue[]
  receptions: ReceptionRevenue[]
}

/* ---------------- COMPONENT ---------------- */
const FinancialReport = () => {
  const [departments, setDepartments] = useState<DepartmentRevenue[]>([])
  const [receptions, setReceptions] = useState<ReceptionRevenue[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [userFilter, setUserFilter] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')

  const API_BASE = import.meta.env.VITE_API_BASE_URL
  const token = localStorage.getItem('token')

  /* ---------------- FETCH REPORT ---------------- */
  const fetchReport = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)
      if (userFilter) params.append('user', userFilter)
      if (departmentFilter) params.append('department', departmentFilter)

      const res = await fetch(`${API_BASE}/api/financial-report?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Failed to fetch report')
      }

      const json: ApiResponse = await res.json()

      setDepartments(json.departments || [])
      setReceptions(json.receptions || [])
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message)
      else setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  /* ---------------- DERIVED FILTER OPTIONS ---------------- */
  const userOptions = Array.from(
    new Set(receptions.map((r) => r.user))
  )

  const departmentOptions = Array.from(
    new Set(departments.map((d) => d.department))
  )

  /* ---------------- INITIAL FETCH ---------------- */
  useEffect(() => {
    fetchReport()
  }, [])

  /* ---------------- JSX ---------------- */
  return (
    <div className="flex flex-col gap-6 p-4">
      <h1 className="text-xl font-semibold underline">Financial Report</h1>

      {/* ---------------- FILTERS ---------------- */}
      <div className="flex gap-4 items-end flex-wrap">
        {/* Start Date */}
        <div>
          <label className="text-sm font-medium">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border px-3 py-1 rounded-md"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="text-sm font-medium">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border px-3 py-1 rounded-md"
          />
        </div>

        {/* User Filter */}
        <div>
          <label className="text-sm font-medium">User</label>
          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="border px-3 py-1 rounded-md"
          >
            <option value="">All Users</option>
            {userOptions.map((user) => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </select>
        </div>

        {/* Department Filter */}
        <div>
          <label className="text-sm font-medium">Department</label>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="border px-3 py-1 rounded-md"
          >
            <option value="">All Departments</option>
            {departmentOptions.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={fetchReport}
          className="bg-dark text-white px-5 py-2 rounded-md hover:opacity-90"
        >
          Apply Filter
        </button>
      </div>

      {/* ---------------- STATES ---------------- */}
      {loading && <Loading />}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && departments.length === 0 && receptions.length === 0 && (
        <p className="text-gray-500">No records found</p>
      )}

      {/* ---------------- USER-WISE REVENUE ---------------- */}
      <div className="flex flex-col gap-6">
        {receptions
          .filter((r) => !userFilter || r.user === userFilter)
          .map((r) => (
            <div
              key={r.user}
              className="bg-white rounded-xl p-5 shadow-[0_0_3px_4px_#dfdede]"
            >
              <div className="flex justify-between items-center border-b pb-2 mb-3">
                <h2 className="text-lg font-semibold">{r.user}</h2>
                <p className="text-xl font-bold text-green-600">
                  Rs: {r.revenue}
                </p>
              </div>
            </div>
          ))}
      </div>

      {/* ---------------- DEPARTMENT-WISE REVENUE ---------------- */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Department Revenue</h2>
        <div className="flex gap-4 mt-2 flex-wrap">
          {departments
            .filter((d) => !departmentFilter || d.department === departmentFilter)
            .map((d) => (
              <div
                key={d.department}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded"
              >
                {d.department}: Rs {d.revenue}
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default FinancialReport
