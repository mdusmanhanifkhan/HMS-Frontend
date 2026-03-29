import { useEffect, useState } from 'react'
import Button from '../../../components/button/Button'
import { Input } from '../../../components/input/Input'
import { routePaths } from '../../../constants/routePaths'
import { Link } from 'react-router-dom'
import Loading from '../../../components/loading/Loading'

interface BrandType {
  id: number
  name: string
  code?: string
  phone?: string
  email?: string
  remarks?: string
  isActive: boolean
}

const Brand = () => {
  const [brands, setBrands] = useState<BrandType[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const API_BASE = import.meta.env.VITE_API_BASE_URL
  const token = localStorage.getItem('token')

  const fetchBrands = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch(`${API_BASE}/api/brand`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
      })

      if (res.status === 401 || res.status === 403) {
        throw new Error('Unauthorized. Please login again.')
      }

      if (!res.ok) throw new Error('Failed to fetch brands')

      const data = await res.json()
      setBrands(data.data || [])
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message)
      else setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBrands()
  }, [])

  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-10 relative">
      {/* Header */}
      <div className="flex justify-between items-center w-full border-b pb-3">
        <p className="text-xl font-semibold">Brand Management</p>
        <div className="flex items-center gap-5 min-w-100">
          {/* Search Input */}
          <div className="flex items-center gap-2 py-1.5 w-full rounded-lg border px-2 border-gray">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 20 20"
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
              placeholder="Search brand..."
              variant="none"
              className="outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Button asLink to={routePaths.ADD_BRAND}>
            + Add Brand
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="relative overflow-x-auto shadow-lg rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-white uppercase bg-dark">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Code</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Remarks</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={8}>
                  <div className="flex justify-center py-4">
                    <Loading />
                  </div>
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={8} className="py-4 text-center text-red-500">
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && filteredBrands.length === 0 && (
              <tr>
                <td colSpan={8} className="py-6 text-center">
                  No brands found.
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              filteredBrands.length > 0 &&
              filteredBrands.map((brand) => (
                <tr key={brand.id} className="bg-[#DFDEDE] border-b border-gray-200">
                  <td className="px-6 py-4 font-medium text-gray-900">{brand.id}</td>
                  <td className="px-6 py-4">{brand.name}</td>
                  <td className="px-6 py-4">{brand.code || '-'}</td>
                  <td className="px-6 py-4">{brand.phone || '-'}</td>
                  <td className="px-6 py-4">{brand.email || '-'}</td>
                  <td className="px-6 py-4">
                    {brand.remarks?.length && brand.remarks.length > 45
                      ? `${brand.remarks.substring(0, 45)}...`
                      : brand.remarks || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <span
                        className={`w-[10px] h-[10px] rounded-full ${
                          brand.isActive ? 'bg-[#00cc00]' : 'bg-[#cc0000]'
                        } block`}
                      ></span>
                      {brand.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </td>
                  <td className="px-6 py-4 flex items-center gap-2">
                    {/* Edit */}
                    <Link
                      to={`${routePaths.BRAND}/${brand.id}`}
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
                    {/* Delete */}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Brand