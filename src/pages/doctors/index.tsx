import { Link } from 'react-router-dom'
import Button from '../../components/button/Button'
import { routePaths } from '../../constants/routePaths'
import { useEffect, useState } from 'react'

// Define the types for doctor and departments
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

  // Use the Doctor type in the state
  const [doctors, setDoctor] = useState<Doctor[]>([])

  useEffect(() => {
    const fetchDoctors = async () => {
      if (!token) {
        console.error('No token found. Please login.')
        return
      }

      try {
        const res = await fetch(`${API_URL}/api/doctors`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const resData = await res.json()
        // Ensure data matches Doctor[]
        setDoctor(resData.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchDoctors()
  }, [API_URL, token])

  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-between items-center w-full border-b pb-3">
        <p className="text-xl font-semibold">Doctor Management</p>
        <Link to={routePaths.ADD_DOCTOR}>
          <Button>+ Add Doctor</Button>
        </Link>
      </div>

      <div className="relative overflow-x-auto shadow-lg rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right ">
          <thead className="text-xs text-white uppercase bg-dark">
            <tr>
              <th className="px-6 py-3 flex items-center gap-1 text-sm">ID</th>
              <th className="px-6 py-3">Doctor Name</th>
              <th className="px-6 py-3">Age</th>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3">ID Card</th>
              <th className="px-6 py-3">Employment Type</th>
              <th className="px-6 py-3">Timing</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {doctors?.length > 0 ? (
              doctors.map((doctor) => (
                <tr key={doctor.id} className="bg-[#DFDEDE] border-b border-gray-200">
                  <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {doctor.id}
                  </th>
                  <td className="px-6 py-4">{doctor.name}</td>
                  <td className="px-6 py-4">{doctor.age}</td>
                  <td className="px-6 py-4">
                    {doctor.departmentLinks.length > 0
                      ? doctor.departmentLinks.map(d => d.department.name).join(', ')
                      : '—'}
                  </td>
                  <td className="px-6 py-4">{doctor.idCard}</td>
                  <td className="px-6 py-4">{doctor.employmentType}</td>
                  <td className="px-6 py-4">{doctor.timingFrom} - {doctor.timingTo}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <span className={`w-[10px] h-[10px] rounded-full block ${doctor.status ? 'bg-[#00cc00]' : 'bg-[#cc0000]'}`}></span>
                      {doctor.status ? 'Active' : 'Inactive'}
                    </div>
                  </td>
                  <td className="px-6 py-4 flex items-center gap-2">
                    <a href="#" className="bg-dark p-1 rounded-md group hover:bg-white border border-dark transition-all ease-linear duration-200">
                      <svg className="w-[18px] h-[18px] text-white group-hover:text-dark" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <use href="/assets/svg/edit-icon.svg#edit-icon" />
                      </svg>
                    </a>
                    <a href="#" className="bg-dark p-1 rounded-md group hover:bg-white border border-dark transition-all ease-linear duration-200">
                      <svg className="w-[18px] h-[18px] text-white group-hover:text-dark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
                        <use href="/assets/svg/eye-icon.svg#eye-icon" />
                      </svg>
                    </a>
                    <a href="#" className="bg-dark p-1 rounded-md group hover:bg-white border border-dark transition-all ease-linear duration-200">
                      <svg className="w-[18px] h-[18px] text-white group-hover:text-[#cc0000]" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <use href="/assets/svg/delete-icon.svg#delete-icon" />
                      </svg>
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center py-6">No doctors found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Doctors
