import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { routePaths } from '../../constants/routePaths'
import { Input } from '../../components/input/Input'
import { usePermissions } from '../../context/PermissionsContext'
import Loading from '../../components/loading/Loading'

const API_BASE = import.meta.env.VITE_API_BASE_URL

interface Patient {
  id: number
  patientId: string
  name: string
  gender: string
  age: number
  cnicNumber?: string
  phoneNumber?: string
}

const Welfare = () => {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const [searchTerm, setSearchTerm] = useState<string>('')
  const [debouncedSearch, setDebouncedSearch] = useState<string>('')

  const token = localStorage.getItem('token')
  const { role } = usePermissions()

  // 🔹 Debounce search
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 500)
    return () => clearTimeout(handler)
  }, [searchTerm])

  // 🔹 Fetch Patients
  useEffect(() => {
    const controller = new AbortController()

    const fetchPatients = async () => {
      try {
        setLoading(true)
        setError(null)

        const url = debouncedSearch
          ? `${API_BASE}/api/patients?search=${debouncedSearch}`
          : `${API_BASE}/api/patients`

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        })

        if (!res.ok) throw new Error('Failed to fetch patients')

        const data = await res.json()
        setPatients(data.data || [])
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchPatients()

    return () => controller.abort()
  }, [debouncedSearch, token])

  return (
    <div className="flex flex-col gap-10">
      {/* 🔹 Header Section */}
      <div className="flex justify-between items-center w-full border-b pb-3">
        <p className="text-xl font-semibold">Welfare Management</p>

        <div className="flex items-center gap-5">
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
              placeholder="Search Patient..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="min-w-60 outline-none"
              variant="none"
            />
          </div>
        </div>
      </div>

      {/* 🔹 Table */}
      <div className="relative overflow-x-auto shadow-lg rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right">
          <thead className="text-xs text-white uppercase bg-dark">
            <tr>
              <th className="px-6 py-4">Patient ID</th>
              <th className="px-6 py-4">Full Name</th>
              <th className="px-6 py-4">Gender</th>
              <th className="px-6 py-4">Age</th>
              <th className="px-6 py-4">CNIC / ID</th>
              <th className="px-6 py-4">Contact No.</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {/* 🔹 Loading Row */}
            {loading && (
              <tr>
                <td colSpan={8}>
                  <div className="flex justify-center py-4">
                    <Loading />
                  </div>
                </td>
              </tr>
            )}

            {/* 🔹 Error Row */}
            {!loading && error && (
              <tr>
                <td colSpan={7} className="text-center py-6 text-red-500">
                  {error}
                </td>
              </tr>
            )}

            {/* 🔹 Empty Row */}
            {!loading && !error && patients.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-600">
                  No patients found
                </td>
              </tr>
            )}

            {/* 🔹 Actual Data */}
            {!loading &&
              !error &&
              patients.length > 0 &&
              patients.map((patient, index) => (
                <tr
                  key={index}
                  className="bg-[#DFDEDE] border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {patient.patientId}
                  </td>
                  <td className="px-6 py-4">{patient.name}</td>
                  <td className="px-6 py-4">{patient.gender}</td>
                  <td className="px-6 py-4">{patient.age}</td>
                  <td className="px-6 py-4">{patient.cnicNumber || '-'}</td>
                  <td className="px-6 py-4">{patient.phoneNumber || '-'}</td>

                  {/* Action */}
                  <td className="px-6 py-4 flex items-center gap-2">
                    {/* Edit */}
                    <a className="bg-dark p-1 rounded-md group hover:bg-white border border-dark transition-all duration-200 cursor-pointer">
                      <svg
                        className="w-[18px] h-[18px] text-white group-hover:text-dark"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <use href="/assets/svg/edit-icon.svg#edit-icon" />
                      </svg>
                    </a>

                    {/* Delete */}
                    {role == 'superadmin' ? (
                      <a className="bg-dark p-1 rounded-md group hover:bg-white border border-dark transition-all duration-200 cursor-pointer">
                        <svg
                          className="w-[18px] h-[18px] text-white group-hover:text-[#cc0000]"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <use href="/assets/svg/delete-icon.svg#delete-icon" />
                        </svg>
                      </a>
                    ) : (
                      ''
                    )}

                    {/* Receipt */}
                    <Link
                      to={`${routePaths.ADD_WELFARE_MANAGEMENT}/${patient.patientId}`}
                      className="bg-dark p-1 rounded-md group hover:bg-white border border-dark transition-all duration-200 cursor-pointer"
                    >
                      <svg
                        className="w-[18px] h-[18px] text-white group-hover:text-dark"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <use href="/assets/svg/printer-icon.svg#printer-icon" />
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

export default Welfare
