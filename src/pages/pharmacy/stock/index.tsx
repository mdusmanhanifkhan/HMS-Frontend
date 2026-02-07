import { useEffect, useState } from 'react'
import { GroupInput } from '../../../components/input/GroupInput'
import { Label } from '../../../components/input/Label'
import { Input } from '../../../components/input/Input'
import Loading from '../../../components/loading/Loading'
import Button from '../../../components/button/Button'

interface StockItem {
  id: number
  batchNo: string
  expiryDate: string
  qtyIn: number
  rate: number
  balanceQty: number
  medicine: {
    id: number
    name: string
    companyName?: string
    packing?: string
    salePrice?: number
  }
}

const Stock = () => {
  const [stockList, setStockList] = useState<StockItem[]>([])
  const [filteredStock, setFilteredStock] = useState<StockItem[]>([])
  const [filters, setFilters] = useState({
    medicine: '',
    batchNo: '',
    expiry: '',
  })
  const [loading, setLoading] = useState(false)
  const API_BASE = import.meta.env.VITE_API_BASE_URL
  const token = localStorage.getItem('token')

  // Fetch stock from API (once)
  const fetchStock = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/stock-list`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success) {
        setStockList(data.data)
        setFilteredStock(data.data)
      } else {
        console.error('Fetch failed:', data.message)
      }
    } catch (err) {
      console.error('Network error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStock()
  }, [])

  // Client-side filtering
  useEffect(() => {
    let filtered = [...stockList]

    if (filters.medicine)
      filtered = filtered.filter((item) =>
        item.medicine?.name
          .toLowerCase()
          .includes(filters.medicine.toLowerCase())
      )

    if (filters.batchNo)
      filtered = filtered.filter((item) =>
        item.batchNo.toLowerCase().includes(filters.batchNo.toLowerCase())
      )

    const today = new Date()
    if (filters.expiry === 'near') {
      filtered = filtered.filter((item) => {
        const expiry = new Date(item.expiryDate)
        return expiry > today && expiry <= new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000)
      })
    } else if (filters.expiry === 'expired') {
      filtered = filtered.filter((item) => new Date(item.expiryDate) < today)
    }

    setFilteredStock(filtered)
  }, [filters, stockList])

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-3">
        <p className="text-xl font-semibold">Stock / Inventory</p>
      </div>

      {/* FILTER SECTION */}
      <div className="grid grid-cols-4 gap-4 max-w-[1200px] bg-gray-50 p-4 rounded-lg items-end">
        <GroupInput>
          <Label>Medicine</Label>
          <Input
            placeholder="Search Medicine Name"
            value={filters.medicine}
            onChange={(e) =>
              setFilters({ ...filters, medicine: e.target.value })
            }
          />
        </GroupInput>

        <GroupInput>
          <Label>Batch No</Label>
          <Input
            placeholder="Search Batch"
            value={filters.batchNo}
            onChange={(e) =>
              setFilters({ ...filters, batchNo: e.target.value })
            }
          />
        </GroupInput>

        <GroupInput>
          <Label>Expiry Filter</Label>
          <select
            className="border rounded px-2 py-1"
            value={filters.expiry}
            onChange={(e) => setFilters({ ...filters, expiry: e.target.value })}
          >
            <option value="">All</option>
            <option value="near">Near Expiry (3 Months)</option>
            <option value="expired">Expired</option>
          </select>
        </GroupInput>

        <div className="flex gap-3">
          <Button
            type="button"
            onClick={() =>
              setFilters({ medicine: '', batchNo: '', expiry: '' })
            }
          >
            Reset Filters
          </Button>
        </div>
      </div>

      {/* STOCK TABLE */}
      <div className="relative overflow-x-auto shadow-lg rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-white uppercase bg-dark">
            <tr>
              <th className="px-6 py-4">#</th>
              <th className="px-6 py-4">Medicine</th>
              <th className="px-6 py-4">Company</th>
              <th className="px-6 py-4">Batch No</th>
              <th className="px-6 py-4">Expiry</th>
              <th className="px-6 py-4">Packing</th>
              <th className="px-6 py-4">Qty In Stock</th>
              <th className="px-6 py-4">Purchase Price</th>
              <th className="px-6 py-4">Sale Price</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={10}>
                  <div className="flex justify-center py-4">
                    <Loading />
                  </div>
                </td>
              </tr>
            )}

            {!loading && filteredStock.length === 0 && (
              <tr>
                <td colSpan={10} className="py-6 text-center">
                  No stock found
                </td>
              </tr>
            )}

            {!loading &&
              filteredStock.map((item, index) => {
                const today = new Date()
                const expiry = new Date(item.expiryDate)
                let status = 'Normal'
                let statusColor = 'bg-green-100 text-green-700'

                if (item.balanceQty <= 0) {
                  status = 'Out of Stock'
                  statusColor = 'bg-[#FFB8B8] text-red-700'
                } else if (
                  expiry < today ||
                  expiry <= new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000)
                ) {
                  status = 'Near Expiry'
                  statusColor = 'bg-yellow-100 text-yellow-700'
                }

                return (
                  <tr
                    key={item.id}
                    className={`bg-[#DFDEDE] border-b border-gray-200 ${statusColor}`}
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">{item.medicine?.name}</td>
                    <td className="px-6 py-4">
                      {item.medicine?.companyName || '-'}
                    </td>
                    <td className="px-6 py-4">{item.batchNo}</td>
                    <td className="px-6 py-4">{expiry.toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      {item.medicine?.packing || '-'}
                    </td>
                    <td className="px-6 py-4 text-center font-semibold">
                      {item.balanceQty}
                    </td>
                    <td className="px-6 py-4">{item.rate.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      {item.medicine?.salePrice?.toFixed(2) || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded`}>{status}</span>
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Stock
