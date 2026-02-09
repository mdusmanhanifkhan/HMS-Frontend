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

interface Filters {
  medicine: string
  batchNo: string
  expiry: string
}

const Stock = () => {
  const [stockList, setStockList] = useState<StockItem[]>([])
  const [filteredStock, setFilteredStock] = useState<StockItem[]>([])
  const [filters, setFilters] = useState<Filters>({
    medicine: '',
    batchNo: '',
    expiry: '',
  })
  const [loading, setLoading] = useState(false)
  const API_BASE = import.meta.env.VITE_API_BASE_URL
  const token = localStorage.getItem('token') || ''

  // Fetch stock from API
  const fetchStock = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/stock-list`, {
        headers: { Authorization: `Bearer ${token}` },
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

  // Client-side filtering
  useEffect(() => {
    let filtered = stockList.filter((item) => item.balanceQty > 0) // hide zero stock

    if (filters.medicine) {
      filtered = filtered.filter((item) =>
        item.medicine.name.toLowerCase().includes(filters.medicine.toLowerCase())
      )
    }

    if (filters.batchNo) {
      filtered = filtered.filter((item) =>
        item.batchNo.toLowerCase().includes(filters.batchNo.toLowerCase())
      )
    }

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

  // Group stock by medicine
  const groupedStock = filteredStock.reduce<Record<number, StockItem & { batches: StockItem[] }>>(
    (acc, item) => {
      if (!acc[item.medicine.id]) {
        acc[item.medicine.id] = { ...item, batches: [] }
      }
      acc[item.medicine.id].batches.push(item)
      return acc
    },
    {}
  )

  const groupedStockList = Object.values(groupedStock)

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

  {!loading && groupedStockList.length === 0 && (
    <tr>
      <td colSpan={10} className="py-6 text-center">
        No stock found
      </td>
    </tr>
  )}

  {!loading &&
    groupedStockList.map((med, index) => {
      const totalQty = med.batches.reduce((sum, b) => sum + b.balanceQty, 0)
      
      // Filter out batches with zero balance
      const validBatches = med.batches.filter((b) => b.balanceQty > 0)
      if (validBatches.length === 0) return null

      return validBatches.map((b, batchIndex) => {
        const today = new Date()
        const expiry = new Date(b.expiryDate)
        let status = 'Normal'
        if (expiry <= new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000)) status = 'Near Expiry'

        return (
          <tr key={b.id} className="border-b hover:bg-gray-50">
            {batchIndex === 0 && (
              <>
                <td className="px-6 py-4 font-medium text-gray-900" rowSpan={validBatches.length}>
                  {index + 1}
                </td>
                <td className="px-6 py-4" rowSpan={validBatches.length}>
                  {med.medicine.name}
                </td>
                <td className="px-6 py-4" rowSpan={validBatches.length}>
                  {med.medicine.companyName || '-'}
                </td>
                <td className="px-6 py-4">{b.batchNo}</td>
                <td className="px-6 py-4">{expiry.toLocaleDateString()}</td>
                <td className="px-6 py-4" rowSpan={validBatches.length}>
                  {med.medicine.packing || '-'}
                </td>
                <td className="px-6 py-4 text-center font-semibold" rowSpan={validBatches.length}>
                  {totalQty}
                </td>
                <td className="px-6 py-4">{b.rate.toFixed(2)}</td>
                <td className="px-6 py-4">{med.medicine.salePrice?.toFixed(2) || '-'}</td>
                <td className="px-6 py-4">{status}</td>
              </>
            )}
            {batchIndex > 0 && (
              <>
                <td className="px-6 py-4">{b.batchNo}</td>
                <td className="px-6 py-4">{expiry.toLocaleDateString()}</td>
                <td className="px-6 py-4">{b.rate.toFixed(2)}</td>
                <td className="px-6 py-4">{med.medicine.salePrice?.toFixed(2) || '-'}</td>
                <td className="px-6 py-4">{status}</td>
              </>
            )}
          </tr>
        )
      })
    })}
</tbody>

        </table>
      </div>
    </div>
  )
}

export default Stock
