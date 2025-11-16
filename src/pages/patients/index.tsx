import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/button/Button'
import { routePaths } from '../../constants/routePaths'
import { Input } from '../../components/input/Input'

const API_BASE = import.meta.env.VITE_API_BASE_URL

interface WelfareRecord {
  welfareCategory?: string | null
  discountType?: string | null
  discountPercentage?: number | null
  startDate?: string | null
  endDate?: string | null
}

interface Patient {
  id: number
  patientId: number
  name: string
  guardianName?: string
  gender: string
  age: number
  maritalStatus?: string
  bloodGroup?: string
  cnicNumber?: string | null
  phoneNumber?: string | null
  address?: string | null
  welfareRecord?: WelfareRecord | null
}

const Patients = () => {
 const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')

  const [showModal, setShowModal] = useState<boolean>(false)
  const [deletePatientId, setDeletePatientId] = useState<number | null>(null)

  const debounceRef = useRef<number | undefined>(undefined)
  const token = localStorage.getItem('token')

  if (!token) console.error('No token found. Please login.')

  const fetchPatients = async (query?: string) => {
    try {
      setLoading(true)
      setError(null)
      let url = `${API_BASE}/api/patients`
      if (query && query.trim()) {
        url = `${API_BASE}/api/patient/search?query=${encodeURIComponent(query.trim())}`
      }

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.general_error || 'Failed to fetch patients')

      setPatients(Array.isArray(data.data) ? data.data : data.data ? [data.data] : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // ---------- Fetch only once on mount ----------
  useEffect(() => {
    if (token) fetchPatients()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // empty dependency ensures fetch runs once

  // ---------- Debounced search ----------
  useEffect(() => {
    if (!searchTerm) return // skip empty search

    window.clearTimeout(debounceRef.current)
    debounceRef.current = window.setTimeout(() => {
      fetchPatients(searchTerm.trim())
    }, 600)

    return () => window.clearTimeout(debounceRef.current)
  }, [searchTerm])

  // ---------- Delete ----------
  const confirmDelete = (id: number) => {
    setDeletePatientId(id)
    setShowModal(true)
  }

  const handleDelete = async () => {
    if (!deletePatientId || !token) return
    try {
      const res = await fetch(`${API_BASE}/api/patients/${deletePatientId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.general_error || 'Failed to delete patient')
      setPatients((prev) => prev.filter((p) => p.id !== deletePatientId))
      setShowModal(false)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <div className="flex justify-between items-center w-full border-b pb-3">
        <p className="text-xl font-semibold">Patients Management</p>
        <div className="flex items-center gap-5">
          {/* Search Input */}
          <div className="flex items-center gap-2 py-1.5 w-full rounded-lg border px-2 border-gray placeholder:text-gray-100 placeholder:font-light min-w-64">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 20 20"
              id="search"
            >
              <g stroke="none" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <g stroke="#000" strokeWidth="2" transform="translate(-1687 -1941)">
                  <g transform="translate(1688 1942)">
                    <circle cx="7.5" cy="7.5" r="7.5"></circle>
                    <path d="M18 18l-5.2-5.2"></path>
                  </g>
                </g>
              </g>
            </svg>
            <Input
              type="text"
              placeholder="Search by Name, MR ID, CNIC, or Phone"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="none"
              className="outline-none"
            />
          </div>

          {/* Add Button */}
          <Link to={routePaths.ADD_PATIENTS}>
            <Button>+ Add Patient</Button>
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="relative overflow-x-auto shadow-lg rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-white uppercase bg-dark">
            <tr>
              <th className="px-6 py-3">MR ID</th>
              <th className="px-6 py-3">Full Name</th>
              <th className="px-6 py-3">Gender</th>
              <th className="px-6 py-3">Age</th>
              <th className="px-6 py-3">CNIC / ID</th>
              <th className="px-6 py-3">Contact No.</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center p-4">Loading patients...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={7} className="text-center text-red-500 p-4">{error}</td>
              </tr>
            ) : patients.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-4">No patients found</td>
              </tr>
            ) : (
              patients.map((patient) => (
                <tr key={patient.id} className="bg-[#DFDEDE] border-b border-gray-200 hover:bg-gray-100">
                  <td className="px-6 py-4 font-medium text-gray-900">{patient.patientId}</td>
                  <td className="px-6 py-4">{patient.name}</td>
                  <td className="px-6 py-4">{patient.gender}</td>
                  <td className="px-6 py-4">{patient.age}</td>
                  <td className="px-6 py-4">{patient.cnicNumber || '-'}</td>
                  <td className="px-6 py-4">{patient.phoneNumber || '-'}</td>
                  <td className="px-6 py-4 flex items-center gap-2">
                    <Link to={`${routePaths.PATIENTS}/${patient.patientId}`} className="bg-dark p-1 cursor-pointer rounded-md group hover:bg-white border border-dark transition-all ease-linear duration-200">
                      <svg className="w-[18px] h-[18px] text-white group-hover:text-dark" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <use href="/assets/svg/edit-icon.svg#edit-icon" />
                      </svg>
                    </Link>

                    <button onClick={() => confirmDelete(patient.id)} className="bg-dark p-1 rounded-md group hover:bg-white border border-dark transition-all ease-linear duration-200">
                      <svg className="w-[18px] h-[18px] text-white group-hover:text-[#cc0000]" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <use href="/assets/svg/delete-icon.svg#delete-icon" />
                      </svg>
                    </button>

                    <Link to={`${routePaths.PATIENTS_RECEIPT_GENERATE}/${patient.patientId}`} className="bg-dark p-1 rounded-md group hover:bg-white border border-dark transition-all ease-linear duration-200">
                      <svg className="w-[18px] h-[18px] text-white group-hover:text-dark" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <use href="/assets/svg/printer-icon.svg#printer-icon" />
                      </svg>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Modal */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[350px]">
            <p className="text-lg font-semibold mb-4">Confirm Delete</p>
            <p className="mb-6 text-gray-700">Are you sure you want to delete this patient?</p>
            <div className="flex justify-end gap-3">
              <Button onClick={() => setShowModal(false)}>Cancel</Button>
              <Button onClick={handleDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Patients
