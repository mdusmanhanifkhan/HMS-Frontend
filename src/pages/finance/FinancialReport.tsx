import { useState, useEffect } from 'react'

type DepartmentRevenue = {
  department: string
  revenue: number
}

type ReceptionRevenue = {
  user: string
  revenue: number
}

type FinancialReportData = {
  date: string
  departments: DepartmentRevenue[]
  receptions: ReceptionRevenue[]
}

const FinancialReport = () => {
  const [report, setReport] = useState<FinancialReportData | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const API_BASE = import.meta.env.VITE_API_BASE_URL
  const token = localStorage.getItem('token')

  const fetchReport = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`${API_BASE}/api/financial-report`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error('Network response was not ok')

      const data: FinancialReportData = await response.json()
      setReport(data)
    } catch (err) {
      console.error(err)
      setError('Failed to fetch today\'s financial report')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReport()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Today's Financial Report</h1>

      {loading && <p className="text-lg">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {report && (
        <>
          {/* Departments */}
          <h2 className="text-2xl font-semibold mb-4">Departments</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {report.departments.map((d) => (
              <div
                key={d.department}
                className="bg-white shadow-md rounded-lg p-4 border border-gray-200 hover:shadow-xl transition"
              >
                <h3 className="text-lg font-semibold mb-2">{d.department}</h3>
                <p className="text-2xl font-bold text-green-600">₹ {d.revenue}</p>
              </div>
            ))}
          </div>

          {/* Receptions / Users */}
          <h2 className="text-2xl font-semibold mt-8 mb-4">Receptions / Users</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {report.receptions.map((r) => (
              <div
                key={r.user}
                className="bg-white shadow-md rounded-lg p-4 border border-gray-200 hover:shadow-xl transition"
              >
                <h3 className="text-lg font-semibold mb-2">{r.user}</h3>
                <p className="text-2xl font-bold text-blue-600">₹ {r.revenue}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default FinancialReport
