import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/button/Button'
import { routePaths } from '../../constants/routePaths'
import { Input } from '../../components/input/Input'
import Loading from '../../components/loading/Loading'
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
  patientId: string
  name: string
  guardianName: string
  gender: string
  age: number
  cnicNumber?: string | null
  phoneNumber?: string | null
  totalVisits?: string | null
  welfareRecord?: WelfareRecord | null
}

const PAGE_SIZE = 20

const AllPatients = () => {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [loadingMore, setLoadingMore] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const [searchByName, setSearchByName] = useState<string>('')

  const [page, setPage] = useState<number>(1)
  const [hasMore, setHasMore] = useState<boolean>(true)

  const token = localStorage.getItem('token')

  const fetchPatients = async (
    pageNumber: number,
    append = false,
    filters?: { name?: string } // <-- updated
  ) => {
    try {
      if (append) setLoadingMore(true)
      else setLoading(true)
      setError(null)

      let url = `${API_BASE}/api/medical-records?page=${pageNumber}&limit=${PAGE_SIZE}`
      const params = new URLSearchParams()
      if (filters?.name) params.append('name', filters.name) // <-- use name
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
    }
  }

  useEffect(() => {
    if (!token) {
      setError('No token found. Please login.')
      return
    }
    setPage(1)
    fetchPatients(1)
  }, [token])

  useEffect(() => {
    if (page > 1) {
      fetchPatients(page, true, { name: searchByName })
    }
  }, [page])

  const handleSearch = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPage(1)
    fetchPatients(1, false, { name: searchByName })
  }

  return (
    <div className="flex flex-col gap-10 relative">
      {/* Header */}
      <div className="flex justify-between items-center w-full border-b pb-3">
        <p className="text-xl font-semibold">Patients History</p>
        <form onSubmit={handleSearch} className="flex gap-2 items-center">
          <Input
            type="text"
            placeholder="Search by Name"
            value={searchByName}
            onChange={(e) => setSearchByName(e.target.value)}
            className="min-w-[250px] w-full"
          />
          <Button type='submit' disabled={loading}>{`${loading ? "loading..." : "Search"}`}</Button>
        </form>
      </div>

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
              <th className="px-6 py-4">Total Visits</th>
              <th className="px-6 py-4 w-[10%] text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && patients.length === 0 ? (
              <tr>
                <td colSpan={9}>
                  <div className="flex justify-center py-4">
                    <Loading />
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={9}>
                  <div className="flex justify-center py-4 text-red">
                    {error}
                  </div>
                </td>
              </tr>
            ) : patients.length === 0 ? (
              <tr>
                <td colSpan={9}>
                  <div className="flex justify-center py-4">
                    No patients found
                  </div>
                </td>
              </tr>
            ) : (
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
                        <td className="px-6 py-2">{p.patientId}</td>
                        <td className="px-6 py-2">{p.name}</td>
                        <td className="px-6 py-2">{p.guardianName}</td>
                        <td className="px-6 py-2">{p.gender}</td>
                        <td className="px-6 py-2">{p.age}</td>
                        <td className="px-6 py-2">{p.cnicNumber || '-'}</td>
                        <td className="px-6 py-2">{p.phoneNumber || '-'}</td>
                        <td className="px-6 py-2 text-center">
                          {p.totalVisits || '-'}
                        </td>
                        <td className="px-6 py-2 flex items-center justify-center">
                          <Link
                            to={`${routePaths.PATIENT_HISTORY}/${p.patientId}`}
                            className="p-1 cursor-pointer rounded-md group bg-white border border-dark transition-all ease-linear duration-200"
                          >
                            <svg
                              className="w-[18px] h-[18px] text-white group-hover:text-dark"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 512 513.11"
                            >
                              <use href="/assets/svg/history-icon.svg#history-icon" />
                            </svg>
                          </Link>
                        </td>
                      </tr>
                    )
                  })
                }
              </InfiniteScrollObserver>
            )}
          </tbody>
        </table>
        {loadingMore && patients.length > 0 && (
          <div className="flex justify-center py-4">
            <Loading />
          </div>
        )}
      </div>
    </div>
  )
}

export default AllPatients
