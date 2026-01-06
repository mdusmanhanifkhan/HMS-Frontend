import { Link } from 'react-router-dom'
import Button from '../../components/button/Button'
import { routePaths } from '../../constants/routePaths'
import { useEffect, useState } from 'react'
import { usePermissions } from '../../context/PermissionsContext'
import Loading from '../../components/loading/Loading'
import DeleteModal from '../../components/modal/DeleteModal'

interface DoctorFeeType {
  id: number
  doctor?: { id: number; name: string }
  department?: { id: number; name: string }
  procedure?: { id: number; name: string }
  paymentType: string
  doctorShare?: number
  hospitalShare?: number
  fixedPrice?: number
  description?: string
  status: boolean
}

const DoctorFee = () => {
  const API_URL = import.meta.env.VITE_API_BASE_URL
  const token = localStorage.getItem('token')
  const { role } = usePermissions()

  const [doctorFees, setDoctorFees] = useState<DoctorFeeType[]>([])
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  // ---------- DELETE MODAL STATE ----------
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [doctorToDelete, setDoctorToDelete] = useState<DoctorFeeType | null>(
    null
  )
  // const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  // ---------- FETCH DOCTOR FEES ----------
  const fetchDoctorFees = async () => {
    if (!token) {
      setErrorMsg('Authorization token missing. Please login.')
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/all-doctor-fees`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const resData = await res.json()
      if (!res.ok)
        throw new Error(resData.message || 'Failed to fetch doctor fees')
      setDoctorFees(resData.data)
      setErrorMsg(null)
    } catch (error: unknown) {
      if (error instanceof Error) setErrorMsg(error.message)
      else setErrorMsg('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDoctorFees()
  }, [API_URL, token])

  // ---------- OPEN DELETE MODAL ----------
  const openDeleteModal = (doctor: DoctorFeeType) => {
    setDoctorToDelete(doctor)
    setDeleteError(null)
    setIsModalOpen(true)
  }

  // ---------- CONFIRM DELETE ----------
  const handleDelete = async () => {
    if (!doctorToDelete || !token) return

    // setDeleteLoading(true)
    setDeleteError(null)

    try {
      const res = await fetch(
        `${API_URL}/api/doctor-fees/${doctorToDelete.id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      const data = await res.json()
      if (!res.ok)
        throw new Error(data.message || 'Failed to delete doctor fee')

      // Remove from state
      setDoctorFees((prev) => prev.filter((f) => f.id !== doctorToDelete.id))
      setIsModalOpen(false)
      setDoctorToDelete(null)
    } catch (error: unknown) {
      if (error instanceof Error) setDeleteError(error.message)
      else setDeleteError('Something went wrong')
    } 
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-between items-center w-full border-b pb-3">
        <p className="text-xl font-semibold">Doctor Fee Management</p>
        <Link to={routePaths.ADD_DOCTOR_FEE}>
          <Button>+ Add Doctor Fee</Button>
        </Link>
      </div>

      {errorMsg && <p className="text-red-500 font-medium">{errorMsg}</p>}

      <div className="relative overflow-x-auto shadow-lg rounded-lg max-w-270 desktop-lg:max-w-full">
        <table className="w-full text-sm text-left rtl:text-right">
          <thead className="text-xs text-white uppercase bg-dark">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Doctor</th>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3">Procedure</th>
              <th className="px-6 py-3">Payment-Type</th>
              <th className="px-6 py-3">Doctor-Share (%)</th>
              <th className="px-6 py-3">Hospital-Share (%)</th>
              <th className="px-6 py-3">Fixed-Price</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={11}>
                  <div className="flex justify-center py-4">
                    <Loading />
                  </div>
                </td>
              </tr>
            )}

            {!loading && errorMsg && (
              <tr>
                <td colSpan={11} className="py-4 text-center text-red-500">
                  {errorMsg}
                </td>
              </tr>
            )}

            {!loading && !errorMsg && doctorFees.length === 0 && (
              <tr>
                <td colSpan={11} className="py-6 text-center">
                  No doctor fees found
                </td>
              </tr>
            )}

            {!loading &&
              !errorMsg &&
              doctorFees.map((fee) => (
                <tr
                  key={fee.id}
                  className="bg-[#DFDEDE] border-b border-gray-200"
                >
                  <td className="px-6 py-3">{fee.id}</td>
                  <td className="px-6 py-3">{fee.doctor?.name || '—'}</td>
                  <td className="px-6 py-3">{fee.department?.name || '—'}</td>
                  <td className="px-6 py-3">{fee.procedure?.name || '—'}</td>
                  <td className="px-6 py-3">{fee.paymentType}</td>
                  <td className="px-6 py-3">{fee.doctorShare ?? '—'}</td>
                  <td className="px-6 py-3">{fee.hospitalShare ?? '—'}</td>
                  <td className="px-6 py-3">{fee.fixedPrice ?? '—'}</td>
                  <td className="px-6 py-3">{fee.description || '—'}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-1">
                      <span
                        className={`w-[10px] h-[10px] rounded-full block ${
                          fee.status ? 'bg-[#00cc00]' : 'bg-[#cc0000]'
                        }`}
                      ></span>
                      {fee.status ? 'Active' : 'Inactive'}
                    </div>
                  </td>
                  <td className="px-6 py-4 flex items-center gap-2">
                    <Link
                      to={`${routePaths.EDIT_DOCTOR_FEE}/${fee.id}`}
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

                    {role === 'developer' && (
                      <button
                        type="button"
                        onClick={() => openDeleteModal(fee)}
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
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* ---------- DELETE MODAL ---------- */}
      {isModalOpen && doctorToDelete && (
        <DeleteModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleDelete}
          itemName={`${doctorToDelete.doctor?.name || ''} Doctor Fees`}
          errorMessage={deleteError}
        />
      )}
    </div>
  )
}

export default DoctorFee
