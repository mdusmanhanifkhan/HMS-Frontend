import { Link } from 'react-router-dom'
import Button from '../../components/button/Button'
import { routePaths } from '../../constants/routePaths'
import { useEffect, useState } from 'react'
import { usePermissions } from '../../context/PermissionsContext'
import DeleteModal from '../../components/modal/DeleteModal'

interface LabFeeType {
  id: number
  status: boolean
  price: string
  discount: number
  finalPrice: string
  description?: string
  department?: { id: number; name: string }
  procedure?: { id: number; name: string }
}

const LabFee = () => {
  const API_URL = import.meta.env.VITE_API_BASE_URL
  const token = localStorage.getItem('token')
  const { role } = usePermissions()

  const [labFees, setLabFees] = useState<LabFeeType[]>([])
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  // ---------- DELETE MODAL ----------
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [feeToDelete, setFeeToDelete] = useState<LabFeeType | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  // ---------- FETCH LAB FEES ----------
  const fetchLabFees = async () => {
    if (!token) {
      setErrorMsg('Authorization token missing. Please login.')
      setLoading(false)
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/api/all-lab-fees`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to fetch lab fees')

      setLabFees(data.data)
      setErrorMsg(null)
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLabFees()
  }, [API_URL, token])

  // ---------- OPEN DELETE MODAL ----------
  const openDeleteModal = (fee: LabFeeType) => {
    setFeeToDelete(fee)
    setDeleteError(null)
    setIsModalOpen(true)
  }

  // ---------- CONFIRM DELETE ----------
  const handleDelete = async () => {
    if (!feeToDelete || !token) return

    setDeleteError(null)

    try {
      const res = await fetch(`${API_URL}/api/lab-fee/${feeToDelete.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to delete lab fee')

      setLabFees((prev) => prev.filter((f) => f.id !== feeToDelete.id))
      setIsModalOpen(false)
      setFeeToDelete(null)
    } catch (err: unknown) {
      setDeleteError(
        err instanceof Error ? err.message : 'Something went wrong'
      )
    }
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-between items-center w-full border-b pb-3">
        <p className="text-xl font-semibold">Lab Fee Management</p>

        <Link to={routePaths.ADD_LAB_FEE}>
          <Button>+ Add Lab Fee</Button>
        </Link>
      </div>

      {errorMsg && <p className="text-red-500 font-medium">{errorMsg}</p>}

      <div className="relative overflow-x-auto shadow-lg rounded-lg max-w-270 desktop-lg:max-w-full">
        <table className="w-full text-sm text-left rtl:text-right">
          <thead className="text-xs text-white uppercase bg-dark">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3">Procedure</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Discount %</th>
              <th className="px-6 py-3">Final Price</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {/* ---------- SHOW LOADING ---------- */}
            {loading && (
              <tr>
                <td colSpan={9}>
                  <div className="flex justify-center py-4">
                    <span className="text-sm font-medium">Loading...</span>
                  </div>
                </td>
              </tr>
            )}

            {/* ---------- SHOW ERROR ---------- */}
            {!loading && errorMsg && (
              <tr>
                <td colSpan={9} className="py-4 text-center text-red-500">
                  {errorMsg}
                </td>
              </tr>
            )}

            {/* ---------- NO DATA ---------- */}
            {!loading && !errorMsg && labFees.length === 0 && (
              <tr>
                <td colSpan={9} className="py-6 text-center">
                  No lab fees found
                </td>
              </tr>
            )}

            {/* ---------- DATA ROWS ---------- */}
            {!loading &&
              !errorMsg &&
              labFees.map((fee) => (
                <tr
                  key={fee.id}
                  className="bg-[#DFDEDE] border-b border-gray-200"
                >
                  <td className="px-6 py-3">{fee.id}</td>

                  <td className="px-6 py-3">{fee.department?.name ?? '—'}</td>

                  <td className="px-6 py-3">{fee.procedure?.name ?? '—'}</td>

                  <td className="px-6 py-3">Rs {fee.price ?? '—'}</td>

                  <td className="px-6 py-3">{fee.discount ?? 0}%</td>

                  <td className="px-6 py-3">Rs {fee.finalPrice ?? '—'}</td>

                  <td className="px-6 py-3">{fee.description || '—'}</td>

                  <td className="px-6 py-3">
                    <div className="flex items-center gap-1">
                      <span
                        className={`w-[10px] h-[10px] rounded-full block ${
                          fee.status ? 'bg-[#00cc00]' : 'bg-[#cc0000]'
                        }`}
                      />
                      {fee.status ? 'Active' : 'Inactive'}
                    </div>
                  </td>

                  <td className="px-6 py-4 flex items-center gap-2">
              
                      <Link
                       to={`${routePaths.EDIT_LAB_FEE}/${fee.id}`}
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
                        className="bg-dark p-1 rounded-md group hover:bg-white border border-dark transition-all ease-linear duration-200"
                      >
                        <svg className="w-[18px] h-[18px] text-white group-hover:text-[#cc0000]">
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

      {isModalOpen && feeToDelete && (
        <DeleteModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleDelete}
          itemName={`Lab Fee for ${feeToDelete.procedure?.name || 'Lab Test'}`}
          errorMessage={deleteError}
        />
      )}
    </div>
  )
}

export default LabFee
