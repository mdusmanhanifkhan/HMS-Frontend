import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/button/Button'
import { routePaths } from '../../constants/routePaths'
import { Input } from '../../components/input/Input'
import Loading from '../../components/loading/Loading'
import { usePermissions } from '../../context/PermissionsContext'
import DeleteModal from '../../components/modal/DeleteModal'
import SuccessMessage from '../../components/error-handling/SuccessMessage'
import InfiniteScrollObserver from '../../components/infinite-scroll/InfiniteScrollObserver'

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
  guardianName: string
  gender: string
  age: number
  cnicNumber?: string | null
  phoneNumber?: string | null
  welfareRecord?: WelfareRecord | null
  createdAt?: string
}

const PAGE_SIZE = 20

const Patients = () => {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [loadingMore, setLoadingMore] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [searchLoading, setSearchLoading] = useState<boolean>(false)

  const [searchName, setSearchName] = useState<string>('')
  const [searchMR, setSearchMR] = useState<string>('')
  const [searchCNIC, setSearchCNIC] = useState<string>('')
  const [searchPhone, setSearchPhone] = useState<string>('')

  const [showModal, setShowModal] = useState<boolean>(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deletePatientName, setDeletePatientName] = useState<string | null>(
    null
  )

  const [page, setPage] = useState<number>(1)
  const [hasMore, setHasMore] = useState<boolean>(true)

  const token = localStorage.getItem('token')
  if (!token) console.error('No token found. Please login.')
  const { role } = usePermissions()

  const fetchPatients = async (
    pageNumber: number,
    append = false,
    isSearch = false
  ) => {
    if (!hasMore && append) return

    try {
      if (isSearch) setSearchLoading(true)
      else if (append) setLoadingMore(true)
      else setLoading(true)

      setError(null)

      let url = `${API_BASE}/api/patient/search?page=${pageNumber}&limit=${PAGE_SIZE}`
      const params = new URLSearchParams()

      if (searchName) params.append('name', searchName)
      if (searchMR) params.append('patientId', searchMR)
      if (searchCNIC) params.append('cnic', searchCNIC)
      if (searchPhone) params.append('phone', searchPhone)

      if ([...params].length) url += `&${params.toString()}`

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.general_error || 'Failed to fetch')

      const newPatients = Array.isArray(data.data)
        ? data.data
        : data.data
          ? [data.data]
          : []

      setPatients((prev) => (append ? [...prev, ...newPatients] : newPatients))
      setHasMore(newPatients.length === PAGE_SIZE)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
      setLoadingMore(false)
      setSearchLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      setPage(1)
      fetchPatients(1)
    }
  }, [token])

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPage(1)
    fetchPatients(1, false, true)
  }

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

  useEffect(() => {
    if (page > 1) {
      fetchPatients(page, true)
    }
  }, [page])

  return (
    <div className="flex flex-col gap-10 relative">
      {success && <SuccessMessage msg={success} />}
      <div className="flex justify-between items-center w-full border-b pb-3">
        <p className="text-xl font-semibold">Patients Management</p>
        <Link to={routePaths.ADD_PATIENTS}>
          <Button>+ Add Patient</Button>
        </Link>
      </div>

      <div className="space-y-5">
        {/* Search Fields */}
        <form onSubmit={handleSearch} className="flex gap-2 items-center">
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
          <Button type="submit" disabled={searchLoading}>
            {searchLoading ? 'Searching...' : 'Search'}
          </Button>
        </form>

        {/* Table */}
        <div className="relative overflow-x-auto shadow-lg rounded-lg">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-white uppercase bg-dark">
              <tr>
                <th className="px-6 py-4">MR ID</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Guardian Name</th>
                <th className="px-6 py-4">Gender</th>
                <th className="px-6 py-4">Age</th>
                <th className="px-6 py-4">CNIC / ID</th>
                <th className="px-6 py-4">Contact No.</th>
                <th className="px-6 py-4">CreatedAt</th>
                <th className="px-6 py-4 w-[10%]">Action</th>
              </tr>
            </thead>
            <tbody>
              <InfiniteScrollObserver
                loading={loadingMore}
                hasMore={hasMore}
                onLoadMore={() => setPage((prev) => prev + 1)}
              >
                {(lastRef) =>
                  patients.map((p, idx) => {
                    const isLast = patients.length === idx + 1
                    return (
                      <tr
                        ref={isLast ? lastRef : null}
                        key={p.id}
                        className="bg-[#DFDEDE] border-b hover:bg-gray-100"
                      >
                        <PatientRow
                          patient={p}
                          role={role || ''}
                          confirmDelete={confirmDelete}
                          setDeletePatientName={setDeletePatientName}
                        />
                      </tr>
                    )
                  })
                }
              </InfiniteScrollObserver>
            </tbody>
          </table>
          {loading && (
            <div className="flex justify-center py-4">
              <Loading />
            </div>
          )}
          {loadingMore && (
            <div className="flex justify-center py-4">
              <Loading />
            </div>
          )}
          {error && (
            <div className="flex justify-center py-4 text-red">{error}</div>
          )}
          {!loading && patients.length === 0 && (
            <div className="flex justify-center py-4">No patients found</div>
          )}
        </div>
      </div>

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

// Separate component for patient row
const PatientRow = ({
  patient,
  role,
  confirmDelete,
  setDeletePatientName,
}: {
  patient: Patient
  role: string
  confirmDelete: (id: number) => void
  setDeletePatientName: React.Dispatch<React.SetStateAction<string | null>>
}) => (
  <>
    <td className="px-6 py-2">{patient.patientId}</td>
    <td className="px-6 py-2">{patient.name}</td>
    <td className="px-6 py-2">{patient.guardianName}</td>
    <td className="px-6 py-2">{patient.gender}</td>
    <td className="px-6 py-2">{patient.age}</td>
    <td className="px-6 py-2">{patient.cnicNumber || '-'}</td>
    <td className="px-6 py-2">{patient.phoneNumber || '-'}</td>
   <td className="px-6 py-2">
  {patient?.createdAt
    ? new Date(patient.createdAt).toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '-'}
</td>


    <td className="px-6 py-2 flex items-center gap-2">
      {role === 'superadmin' && (
        <Link
          to={`${routePaths.PATIENTS}${routePaths.OLD_PATIENTS_RECEIPT_GENERATE}/${patient.patientId}`}
          className="bg-dark p-1 cursor-pointer rounded-md group hover:bg-white border border-dark transition-all ease-linear duration-200 text-white hover:text-dark"
        >
          old
        </Link>
      )}
      <Link
        to={`${routePaths.PATIENTS}/${patient.patientId}`}
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
      {role === 'developer' && (
        <button
          onClick={() => {
            confirmDelete(patient.patientId)
            setDeletePatientName(patient.name)
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
      )}
      <Link
        to={`${routePaths.PATIENTS}${routePaths.PATIENTS_RECEIPT_GENERATE}/${patient.patientId}`}
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
    </td>
  </>
)

export default Patients
