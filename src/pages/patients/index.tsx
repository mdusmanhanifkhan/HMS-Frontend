import { Link } from 'react-router-dom'
import Button from '../../components/button/Button'
import { routePaths } from '../../constants/routePaths'

const Patients = () => {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-between items-center w-full border-b pb-3">
        <p className="text-xl font-semibold">Patients Management</p>
        <Link to={routePaths.ADD_PATIENTS}>
          <Button>+ Add Patient</Button>
        </Link>
      </div>

      <div className="relative overflow-x-auto shadow-lg rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right ">
          <thead className="text-xs text-white uppercase bg-dark">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 flex items-center gap-1 text-sm"
              >
                <div>
                  <svg
                    className="text-white w-[8px] h-[8px]"
                    viewBox="0 0 8 5"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <use href="/assets/svg/caret-arrow.svg#caret-arrow" />
                  </svg>
                  <svg
                    className="text-white w-[8px] h-[8px] -scale-y-100"
                    viewBox="0 0 8 5"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <use href="/assets/svg/caret-arrow.svg#caret-arrow" />
                  </svg>
                </div>
               Patient ID
              </th>
              <th scope="col" className="px-6 py-3">
            Full Name
              </th>
              <th scope="col" className="px-6 py-3">
             Gender
              </th>
              <th scope="col" className="px-6 py-3">
                Age
              </th>
              <th scope="col" className="px-6 py-3">
               CNIC / ID
              </th>
              <th scope="col" className="px-6 py-3">
              Contact No.
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-[#DFDEDE] border-b border-gray-200">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
              >
P-001
              </th>
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
              >
           Sara Ahmed
              </th>
              <td className="px-6 py-4">Female</td>
              <td className="px-6 py-4">27</td>
              <td className="px-6 py-4">35202-7654321-0</td>
              <td className="px-6 py-4">0321-7654321</td>
            
              <td className="px-6 py-4 flex items-center gap-2">
                <a
                  href="#"
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline bg-dark p-1 rounded-md group hover:bg-white border border-dark transition-all ease-linear duration-200"
                >
                  <svg className='w-[18px] h-[18px] text-white group-hover:text-dark' viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <use href='/assets/svg/edit-icon.svg#edit-icon' />
                  </svg>
                </a>
                <a
                  href="#"
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline bg-dark p-1 rounded-md group hover:bg-white border border-dark transition-all ease-linear duration-200"
                >
                  <svg className='w-[18px] h-[18px] text-white group-hover:text-dark' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
                  <use href='/assets/svg/eye-icon.svg#eye-icon' />
                  </svg>
                </a>
                <a
                  href="#"
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline bg-dark p-1 rounded-md group hover:bg-white border border-dark transition-all ease-linear duration-200"
                >
                  <svg className='w-[18px] h-[18px] text-white group-hover:text-[#cc0000]' viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <use href='/assets/svg/delete-icon.svg#delete-icon' />
                  </svg>
                </a>
                <Link
                  to={routePaths.PATIENTS_RECEIPT_GENERATE}
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline bg-dark p-1 rounded-md group hover:bg-white border border-dark transition-all ease-linear duration-200"
                >
                  <svg className='w-[18px] h-[18px] text-white group-hover:text-dark' viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <use href='/assets/svg/printer-icon.svg#printer-icon' />
                  </svg>
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Patients
