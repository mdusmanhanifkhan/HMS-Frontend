import { Link } from 'react-router-dom'
import Button from '../../components/button/Button'
import { routePaths } from '../../constants/routePaths'
import { useEffect, useState } from 'react'

const DoctorFee = () => {
  const API_URL = import.meta.env.VITE_API_BASE_URL
  const token = localStorage.getItem('token') // ✅ Get token

  const [doctorFees, setDoctorFees] = useState<any[]>([])
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    const fetchDoctorFees = async () => {
      if (!token) {
        setErrorMsg('Authorization token missing. Please login.')
        return
      }

      try {
        const res = await fetch(`${API_URL}/api/all-doctor-fees`, {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Add token
          },
        })
        const resData = await res.json()

        if (!res.ok) {
          throw new Error(resData.message || 'Failed to fetch doctor fees')
        }

        setDoctorFees(resData.data)
      } catch (error: any) {
        console.log('Error fetching doctor fees:', error)
        setErrorMsg(error.message || 'Something went wrong')
      }
    }
    fetchDoctorFees()
  }, [API_URL, token])

  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-between items-center w-full border-b pb-3">
        <p className="text-xl font-semibold">Doctor Fee Management</p>
        <Link to={routePaths.ADD_DOCTOR_FEE}>
          <Button>+ Add Doctor Fee</Button>
        </Link>
      </div>

      {errorMsg && <p className="text-red-500 font-medium">{errorMsg}</p>}

      <div className="relative overflow-x-auto shadow-lg rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right">
          <thead className="text-xs text-white uppercase bg-dark">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Doctor</th>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3">Procedure</th>
              <th className="px-6 py-3">Payment Type</th>
              <th className="px-6 py-3">Doctor Share (%)</th>
              <th className="px-6 py-3">Hospital Share (%)</th>
              <th className="px-6 py-3">Fixed Price</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {doctorFees.length > 0 ? (
              doctorFees.map((fee) => (
                <tr key={fee.id} className="bg-[#DFDEDE] border-b border-gray-200">
                  <td className="px-6 py-4">{fee.id}</td>
                  <td className="px-6 py-4">{fee.doctor?.name || '—'}</td>
                  <td className="px-6 py-4">{fee.department?.name || '—'}</td>
                  <td className="px-6 py-4">{fee.procedure?.name || '—'}</td>
                  <td className="px-6 py-4">{fee.paymentType}</td>
                  <td className="px-6 py-4">{fee.doctorShare ?? '—'}</td>
                  <td className="px-6 py-4">{fee.hospitalShare ?? '—'}</td>
                  <td className="px-6 py-4">{fee.fixedPrice ?? '—'}</td>
                  <td className="px-6 py-4">{fee.description || '—'}</td>
                  <td className="px-6 py-4">
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
                    <a
                      href="#"
                      className="bg-dark p-1 rounded-md group text-white hover:text-dark hover:bg-white border border-dark transition-all ease-linear duration-200"
                    >
                      Edit
                    </a>
                    <a
                      href="#"
                      className="bg-dark p-1 rounded-md group text-white hover:text-dark hover:bg-white border border-dark transition-all ease-linear duration-200"
                    >
                      View
                    </a>
                    <a
                      href="#"
                      className="bg-dark p-1 rounded-md group text-white hover:text-dark hover:bg-white border border-dark transition-all ease-linear duration-200"
                    >
                      Delete
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={11} className="text-center py-6">
                  No doctor fees found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DoctorFee
