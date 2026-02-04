import { useEffect, useState } from 'react'
import { GroupInput } from '../../../components/input/GroupInput'
import { Label } from '../../../components/input/Label'
import { Input } from '../../../components/input/Input'
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
  const [filters, setFilters] = useState({
    medicine: '',
    batchNo: '',
    expiry: '',
  })
  const [loading, setLoading] = useState(false)
  const API_BASE = import.meta.env.VITE_API_BASE_URL
  const token = localStorage.getItem('token')

  const fetchStock = async () => {
    setLoading(true)
    try {
      // 1. Construct query parameters
      const params = new URLSearchParams()
      if (filters.medicine) params.append('medicineName', filters.medicine)
      if (filters.batchNo) params.append('batchNo', filters.batchNo)
      if (filters.expiry) params.append('expiryFilter', filters.expiry)

      // 2. Use API_BASE and append params
      // Note: Use a template literal to combine the base URL and endpoint
      const url = `${API_BASE}/api/stock-list?${params.toString()}`

      // 3. Include Authorization header with Bearer token
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()
      if (data.success) {
        setStockList(data.data)
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

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-3">
        <p className="text-xl font-semibold">Stock / Inventory</p>
      </div>

      {/* FILTER SECTION */}
      <div className="grid grid-cols-4 gap-4 max-w-[1200px] bg-gray-50 p-4 rounded-lg">
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

        <div className="col-span-full flex gap-3">
          <Button type="button" onClick={fetchStock}>
            Search
          </Button>
          <Button
            type="button"
            onClick={() => {
              setFilters({ medicine: '', batchNo: '', expiry: '' })
              fetchStock()
            }}
          >
            Reset
          </Button>
        </div>
      </div>

      {/* STOCK TABLE */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">#</th>
              <th className="p-2 border">Medicine</th>
              <th className="p-2 border">Company</th>
              <th className="p-2 border">Batch No</th>
              <th className="p-2 border">Expiry</th>
              <th className="p-2 border">Packing</th>
              <th className="p-2 border">Qty In Stock</th>
              <th className="p-2 border">Purchase Price</th>
              <th className="p-2 border">Sale Price</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : stockList.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center p-4">
                  No stock found
                </td>
              </tr>
            ) : (
              stockList.map((item, index) => {
                const today = new Date()
                const expiry = new Date(item.expiryDate)
                let status = 'Normal'
                let statusColor = 'bg-green-100 text-green-700'
                if (item.balanceQty <= 0) {
                  status = 'Out of Stock'
                  statusColor = 'bg-red-100 text-red-700'
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
                    className={
                      status === 'Near Expiry'
                        ? 'bg-yellow-50'
                        : status === 'Out of Stock'
                          ? 'bg-red-50'
                          : ''
                    }
                  >
                    <td className="p-2 border">{index + 1}</td>
                    <td className="p-2 border">{item.medicine?.name}</td>
                    <td className="p-2 border">
                      {item.medicine?.companyName || '-'}
                    </td>
                    <td className="p-2 border">{item.batchNo}</td>
                    <td className="p-2 border">
                      {expiry.toLocaleDateString()}
                    </td>
                    <td className="p-2 border">
                      {item.medicine?.packing || '-'}
                    </td>
                    <td className="p-2 border text-center font-semibold">
                      {item.balanceQty}
                    </td>
                    <td className="p-2 border">{item.rate.toFixed(2)}</td>
                    <td className="p-2 border">
                      {item.medicine?.salePrice?.toFixed(2) || '-'}
                    </td>
                    <td className="p-2 border">
                      <span className={`px-2 py-1 rounded ${statusColor}`}>
                        {status}
                      </span>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Stock
