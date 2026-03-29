import { useEffect, useState } from 'react'
import Button from '../../../components/button/Button'
import { Input } from '../../../components/input/Input'
import Loading from '../../../components/loading/Loading'
import { routePaths } from '../../../constants/routePaths'
import { Link } from 'react-router-dom'

interface PackingType {
  id: number
  name: string
  status: boolean
}

const PackingType = () => {
  const [packingTypes, setPackingTypes] = useState<PackingType[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const API_BASE = import.meta.env.VITE_API_BASE_URL
  const token = localStorage.getItem('token')

  /* ================= FETCH PACKING TYPES ================= */
  const fetchPackingTypes = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_BASE}/api/packing-type`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Failed to fetch packing types')

      setPackingTypes(data.data || [])
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message)
      else setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPackingTypes()
  }, [])

  /* ================= SEARCH ================= */
  const filteredPackingTypes = packingTypes.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-10 relative">
      {/* HEADER */}
      <div className="flex justify-between items-center w-full border-b pb-3">
        <p className="text-xl font-semibold">Packing Type Management</p>

        <div className="flex items-center gap-5 min-w-[350px]">
          {/* Search */}
          <div className="flex items-center gap-2 py-1.5 w-full rounded-lg border px-2">
            <Input
              type="text"
              placeholder="Search packing type..."
              variant="none"
              className="outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Button asLink to={routePaths.ADD_PACKING_TYPE}>
            + Add Packing Type
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <div className="relative overflow-x-auto shadow-lg rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-white uppercase bg-dark">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-end">Action</th>
            </tr>
          </thead>

          <tbody>
            {/* Loading */}
            {loading && (
              <tr>
                <td colSpan={4} className="text-center py-6">
                  <Loading />
                </td>
              </tr>
            )}

            {/* Error */}
            {!loading && error && (
              <tr>
                <td colSpan={4} className="text-center text-red-500 py-4">
                  {error}
                </td>
              </tr>
            )}

            {/* Empty */}
            {!loading && !error && filteredPackingTypes.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-6">
                  No packing types found
                </td>
              </tr>
            )}

            {/* Data */}
            {!loading &&
              !error &&
              filteredPackingTypes.map((item) => (
                <tr key={item.id} className="bg-[#DFDEDE] border-b">
                  <td className="px-6 py-3 font-medium">{item.id}</td>

                  <td className="px-6 py-3 font-semibold">{item.name}</td>

                  <td className="px-6 py-4 ">
                    <div className="flex justify-center items-center gap-2">
                      <span
                        className={`w-[10px] h-[10px] rounded-full ${
                          item.status ? 'bg-[#00cc00]' : 'bg-[#cc0000]'
                        }`}
                      />
                      {item.status ? 'Active' : 'Inactive'}
                    </div>
                  </td>

                  <td className="px-6 py-4 flex items-end justify-end gap-2">
                   <Link
                      to={`${routePaths.EDIT_PACKING_TYPE}/${item.id}`}
                      className="bg-dark p-1 rounded-md group hover:bg-white border border-dark transition-all duration-200"
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
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PackingType