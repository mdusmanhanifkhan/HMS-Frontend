import { useEffect, useState } from 'react'
import Loading from '../../components/loading/Loading'

/* ---------------- TYPES ---------------- */
type DepartmentItem = {
  department: string
  fee: number
}

type RecordItem = {
  recordId: number
  date: string
  patient: string
  totalFee: number
  departments: DepartmentItem[]
}

type UserReport = {
  userId: number
  userName: string
  totalRevenue: number
  records: RecordItem[]
}

type FinancialReportResponse = {
  success: boolean
  users: UserReport[]
}

/* ---------------- COMPONENT ---------------- */
const FinancialReport = () => {
  const [data, setData] = useState<UserReport[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [userId, setUserId] = useState('')
  const [departmentName, setDepartmentName] = useState('')

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
      if (userId) params.append('userId', userId)
      if (departmentName) params.append('departmentName', departmentName)

      const res = await fetch(`${API_BASE}/api/financial-report?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Failed to fetch report')
      }

      const json: FinancialReportResponse = await res.json()
      setData(json.users || [])
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message)
      else setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  /* ---------------- DERIVED FILTER DATA ---------------- */
  const derivedUsers = data.map((u) => ({
    id: u.userId,
    name: u.userName,
  }))

  const derivedDepartments = Array.from(
    new Map(
      data
        .flatMap((u) => u.records.flatMap((r) => r.departments))
        .map((d) => [d.department, d])
    ).values()
  )

  /* ---------------- INITIAL FETCH ---------------- */
  useEffect(() => {
    fetchReport()
  }, [])

  /* ---------------- JSX ---------------- */
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold underline">
        Financial Report (User-wise)
      </h1>

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
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="border px-3 py-1 rounded-md"
          >
            <option value="">All Users</option>
            {derivedUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        {/* Department Filter */}
        <div>
          <label className="text-sm font-medium">Department</label>
          <select
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
            className="border px-3 py-1 rounded-md"
          >
            <option value="">All Departments</option>
            {derivedDepartments.map((d) => (
              <option key={d.department} value={d.department}>
                {d.department}
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
      {!loading && !error && data.length === 0 && (
        <p className="text-gray-500">No records found</p>
      )}

      {/* ---------------- DATA ---------------- */}
      <div className="flex flex-col gap-6">
        {data.map((user) => (
          <div
            key={user.userId}
            className="bg-white rounded-xl p-5 shadow-[0_0_3px_4px_#dfdede]"
          >
            {/* User Header */}
            <div className="flex justify-between items-center border-b pb-2 mb-3">
              <h2 className="text-lg font-semibold">{user.userName}</h2>
              <p className="text-xl font-bold text-green-600">
                Rs: {user.totalRevenue}
              </p>
            </div>

            {/* Records */}
            <div className="flex flex-col gap-3">
              {user.records.map((rec) => (
                <div
                  key={rec.recordId}
                  className="border rounded-lg p-4 bg-gray-50"
                >
                  <div className="flex justify-between mb-2">
                    <p className="font-medium">
                      Patient: <span className="font-semibold">{rec.patient}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(rec.date).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex gap-2 flex-wrap">
                      {rec.departments.map((d, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                        >
                          {d.department}: Rs {d.fee}
                        </span>
                      ))}
                    </div>

                    <p className="font-semibold text-blue-600">
                      Rs: {rec.totalFee}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FinancialReport
