import { Link } from 'react-router-dom'
import Button from '../../components/button/Button'
import { routePaths } from '../../constants/routePaths'
import { useEffect, useState } from 'react'
import { usePermissions } from '../../context/PermissionsContext'
import Loading from '../../components/loading/Loading'
import DeleteModal from '../../components/modal/DeleteModal'

// Define the types
interface DepartmentLink {
  department: {
    name: string
  }
}

interface Doctor {
  id: number
  name: string
  age: number
  departmentLinks: DepartmentLink[]
  idCard: string
  employmentType: string
  timingFrom: string
  timingTo: string
  status: boolean
}

const Doctors = () => {
  const API_URL = import.meta.env.VITE_API_BASE_URL
  const token = localStorage.getItem('token')
  const { role } = usePermissions()

  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Delete modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [doctorToDelete, setDoctorToDelete] = useState<Doctor | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  // const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    const fetchDoctors = async () => {
      if (!token) return

      try {
        setLoading(true)
        setError(null)

        const res = await fetch(`${API_URL}/api/all-doctors`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) {
          const errData = await res.json()
          throw new Error(errData.message || 'Failed to fetch doctors')
        }

        const resData = await res.json()
        setDoctors(resData.data)
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message)
        else setError('Something went wrong')
        setDoctors([])
      } finally {
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [API_URL, token])

  // Open delete modal
  const handleDeleteClick = (doctor: Doctor) => {
    setDoctorToDelete(doctor)
    setDeleteError(null)
    setIsModalOpen(true)
  }

  const handleDelete = async () => {
    if (!doctorToDelete || !token) return

    try {
      // setDeleteLoading(true)
      setDeleteError(null)

      const res = await fetch(`${API_URL}/api/doctor/${doctorToDelete.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to delete doctor')

      // Remove deleted doctor from state
      setDoctors((prev) => prev.filter((doc) => doc.id !== doctorToDelete.id))

      setIsModalOpen(false)
      setDoctorToDelete(null)
    } catch (err: unknown) {
      if (err instanceof Error) setDeleteError(err.message)
      else setDeleteError('Something went wrong')
    } 
  }

  return (
    <div className="flex flex-col gap-10 relative">
      <div className="flex justify-between items-center w-full border-b pb-3">
        <p className="text-xl font-semibold">Doctor Management</p>
        <Link to={routePaths.ADD_DOCTOR}>
          <Button>+ Add Doctor</Button>
        </Link>
      </div>

      <div className="relative overflow-x-auto shadow-lg rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right">
          <thead className="text-xs text-white uppercase bg-dark">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Doctor Name</th>
              <th className="px-6 py-4">Age</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4">ID Card</th>
              <th className="px-6 py-4">Employment Type</th>
              <th className="px-6 py-4">Timing</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={9}>
                  <div className="flex justify-center py-4">
                    <Loading />
                  </div>
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={9} className="py-4 text-center text-red-500">
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && doctors.length === 0 && (
              <tr>
                <td colSpan={9} className="py-6 text-center">
                  No doctors found
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              doctors.map((doctor) => (
                <tr
                  key={doctor.id}
                  className="bg-[#DFDEDE] border-b border-gray-200"
                >
                  <td className="px-6 py-4 font-medium">{doctor.id}</td>
                  <td className="px-6 py-4">{doctor.name}</td>
                  <td className="px-6 py-4">{doctor.age}</td>
                  <td className="px-6 py-4">
                    {doctor.departmentLinks.length > 0
                      ? doctor.departmentLinks
                          .map((d) => d.department.name)
                          .join(', ')
                      : '-'}
                  </td>
                  <td className="px-6 py-4">{doctor.idCard}</td>
                  <td className="px-6 py-4">{doctor.employmentType}</td>
                  <td className="px-6 py-4">
                    {doctor.timingFrom} - {doctor.timingTo}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <span
                        className={`w-[10px] h-[10px] rounded-full block ${
                          doctor.status ? 'bg-[#00cc00]' : 'bg-[#cc0000]'
                        }`}
                      ></span>
                      {doctor.status ? 'Active' : 'Inactive'}
                    </div>
                  </td>
                  <td className="px-6 py-4 flex items-center gap-2">
                    <Link
                      to={`${routePaths.EDIT_DOCTOR}/${doctor.id}`}
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
                        onClick={() => handleDeleteClick(doctor)}
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
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Delete Modal */}
      {isModalOpen && doctorToDelete && (
        <DeleteModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleDelete}
          itemName={`${doctorToDelete.name || ''} Doctor`}
          errorMessage={deleteError}
        />
      )}
    </div>
  )
}

export default Doctors
