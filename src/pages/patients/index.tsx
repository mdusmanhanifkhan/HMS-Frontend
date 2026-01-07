import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/button/Button'
import { routePaths } from '../../constants/routePaths'
import { Input } from '../../components/input/Input'
import Loading from '../../components/loading/Loading'
import { usePermissions } from '../../context/PermissionsContext'
import DeleteModal from '../../components/modal/DeleteModal'
import SuccessMessage from '../../components/error-handling/SuccessMessage'

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
  gender: string
  age: number
  cnicNumber?: string | null
  phoneNumber?: string | null
  welfareRecord?: WelfareRecord | null
}

const Patients = () => {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Separate search fields
  const [searchName, setSearchName] = useState<string>('')
  const [searchMR, setSearchMR] = useState<string>('')
  const [searchCNIC, setSearchCNIC] = useState<string>('')
  const [searchPhone, setSearchPhone] = useState<string>('')

  const [showModal, setShowModal] = useState<boolean>(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deletePatientName, setDeletePatientName] = useState<string | null>(
    null
  )
  const token = localStorage.getItem('token')

  if (!token) console.error('No token found. Please login.')
  const { role } = usePermissions()

  // Fetch Patients
  const fetchPatients = async (filters?: {
    name?: string
    patientId?: string
    cnic?: string
    phone?: string
  }) => {
    try {
      setLoading(true)
      setError(null)

      let url = `${API_BASE}/api/patient/search`
      const params = new URLSearchParams()
      if (filters?.name) params.append('name', filters.name)
      if (filters?.patientId) params.append('patientId', filters.patientId)
      if (filters?.cnic) params.append('cnic', filters.cnic)
      if (filters?.phone) params.append('phone', filters.phone)
      if ([...params].length) url += `?${params.toString()}`

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.general_error || 'Failed to fetch')

      setPatients(
        Array.isArray(data.data) ? data.data : data.data ? [data.data] : []
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // Fetch all patients on mount
  useEffect(() => {
    if (token) fetchPatients()
  }, [])

  // Search button handler
  const handleSearch = () => {
    fetchPatients({
      name: searchName,
      patientId: searchMR,
      cnic: searchCNIC,
      phone: searchPhone,
    })
  }

  // Delete Modal
  const confirmDelete = (id: number) => {
    setDeleteId(id)
    setShowModal(true)
  }

  const handleDelete = async () => {
    if (!deleteId || !token) return

    try {
      const res = await fetch(`${API_BASE}/api/patient/${deleteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.general_error || 'Delete failed')

      setSuccess(data.message)
      setPatients((prev) => prev.filter((p) => p.patientId !== deleteId))
      setShowModal(false)
      setDeleteId(null)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  return (
    <div className="flex flex-col gap-10 relative">
      {success && <SuccessMessage msg={success} />}

      {/* Header */}
      <div className="flex justify-between items-center w-full border-b pb-3">
        <p className="text-xl font-semibold">Patients Management</p>
        <Link to={routePaths.ADD_PATIENTS}>
          <Button>+ Add Patient</Button>
        </Link>
      </div>

      <div className="space-y-5">
        {/* Search Fields */}
        <div className="flex gap-2 items-center">
          <Input
            type="text"
            placeholder="Search by Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="min-w-[150px]"
          />
          <Input
            type="text"
            placeholder="Search by MR ID"
            value={searchMR}
            onChange={(e) => setSearchMR(e.target.value)}
            className="min-w-[150px]"
          />
          <Input
            type="text"
            placeholder="Search by CNIC"
            value={searchCNIC}
            onChange={(e) => setSearchCNIC(e.target.value)}
            className="min-w-[150px]"
          />
          <Input
            type="text"
            placeholder="Search by Phone"
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
            className="min-w-[150px]"
          />
          <Button onClick={handleSearch}>
            {' '}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
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
                  strokeWidth="2"
                  transform="translate(-1687 -1941)"
                  className="stroke-[#fff] group-hover:stroke-[#000]"
                >
                  <g transform="translate(1688 1942)">
                    <circle cx="7.5" cy="7.5" r="7.5"></circle>
                    <path d="M18 18l-5.2-5.2"></path>
                  </g>
                </g>
              </g>
            </svg>
            Search
          </Button>
        </div>

        {/* Table */}
        <div className="relative overflow-x-auto shadow-lg rounded-lg">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-white uppercase bg-dark">
              <tr>
                <th className="px-6 py-4">MR ID</th>
                <th className="px-6 py-4">Full Name</th>
                <th className="px-6 py-4">Gender</th>
                <th className="px-6 py-4">Age</th>
                <th className="px-6 py-4">CNIC / ID</th>
                <th className="px-6 py-4">Contact No.</th>
                <th className="px-6 py-4 w-[10%]">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7}>
                    <div className="flex justify-center py-4">
                      <Loading />
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7}>
                    <div className="flex justify-center py-4 text-red">
                      {error}
                    </div>
                  </td>
                </tr>
              ) : patients.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="flex justify-center py-4">
                      No patients found
                    </div>
                  </td>
                </tr>
              ) : (
                patients.map((p) => (
                  <tr
                    key={p.id}
                    className="bg-[#DFDEDE] border-b hover:bg-gray-100"
                  >
                    <td className="px-6 py-2">{p.patientId}</td>
                    <td className="px-6 py-2">{p.name}</td>
                    <td className="px-6 py-2">{p.gender}</td>
                    <td className="px-6 py-2">{p.age}</td>
                    <td className="px-6 py-2">{p.cnicNumber || '-'}</td>
                    <td className="px-6 py-2">{p.phoneNumber || '-'}</td>
                    <td className="px-6 py-2 flex items-center gap-2">
                      <Link
                        to={`${routePaths.PATIENTS}/${p.patientId}`}
                        className="bg-dark p-1 cursor-pointer rounded-md group hover:bg-white border border-dark transition-all ease-linear duration-200"
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
                      {role == 'developer' ? (
                        <button
                          onClick={() => {
                            confirmDelete(p.patientId)
                            setDeletePatientName(p.name)
                          }}
                          className="bg-dark p-1 rounded-md group hover:bg-white border border-dark transition-all ease-linear duration-200 cursor-pointer"
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
                      ) : (
                        ''
                      )}
                      <Link
                        to={`${routePaths.PATIENTS}${routePaths.PATIENTS_RECEIPT_GENERATE}/${p.patientId}`}
                        className="bg-dark p-1 rounded-md group hover:bg-white border border-dark transition-all ease-linear duration-200"
                      >
                        <svg
                          className="w-[18px] h-[18px] text-white group-hover:text-dark"
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <use href="/assets/svg/printer-icon.svg#printer-icon" />
                        </svg>
                      </Link>
                      <Link
                        to={`${routePaths.PATIENTS}${routePaths.PATIENTS_RECEIPT_GENERATE}/${p.patientId}`}
                        className="bg-dark p-1 rounded-md group hover:bg-white border border-dark transition-all ease-linear duration-200 text-white hover:text-dark font-bold"
                      >
                      Lab
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Modal */}
      {showModal && (
        <DeleteModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={handleDelete}
          itemName={deletePatientName || ''}
        />
      )}
    </div>
  )
}

export default Patients
