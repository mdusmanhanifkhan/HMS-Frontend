import { useEffect, useState } from 'react'
import { GroupInput } from '../../../components/input/GroupInput'
import { Label } from '../../../components/input/Label'
import { Input } from '../../../components/input/Input'
import Loading from '../../../components/loading/Loading'
import Button from '../../../components/button/Button'

interface Batch {
  id: number
  batchNo: string
  expiryDate: string
  transactionType: string
  qtyIn: number
  qtyOut: number
  rate: number
  discountPercent: number | null
  discountAmount: number | null
  saleRate: number
  valueIn: number
  valueOut: number
  balanceQty: number
  balanceValue: number
  customerDiscountPercent: number | null
  customerDiscountAmount: number | null
  sku:string
}

interface Medicine {
  id: number
  name: string
  categoryId: number
  dosageFormId: number
  unitId: number
  companyId: number
  genericNameId: number
  batches: Batch[]
}

interface Filters {
  medicine: string
  batchNo: string
  expiry: string
}

const Stock = () => {
  const [stockList, setStockList] = useState<Medicine[]>([])
  const [filteredStock, setFilteredStock] = useState<Medicine[]>([])
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
    let filtered = stockList
      .map((med) => ({
        ...med,
        batches: med.batches.filter((b) => b.balanceQty > 0),
      }))
      .filter((med) => med.batches.length > 0) // remove medicines with no batches

    if (filters.medicine) {
      filtered = filtered.filter((med) =>
        med.name.toLowerCase().includes(filters.medicine.toLowerCase())
      )
    }

    if (filters.batchNo) {
      filtered = filtered
        .map((med) => ({
          ...med,
          batches: med.batches.filter((b) =>
            b.batchNo.toLowerCase().includes(filters.batchNo.toLowerCase())
          ),
        }))
        .filter((med) => med.batches.length > 0)
    }

    const today = new Date()
    if (filters.expiry === 'near') {
      filtered = filtered
        .map((med) => ({
          ...med,
          batches: med.batches.filter((b) => {
            const expiry = new Date(b.expiryDate)
            return (
              expiry > today &&
              expiry <= new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000)
            )
          }),
        }))
        .filter((med) => med.batches.length > 0)
    } else if (filters.expiry === 'expired') {
      filtered = filtered
        .map((med) => ({
          ...med,
          batches: med.batches.filter((b) => new Date(b.expiryDate) < today),
        }))
        .filter((med) => med.batches.length > 0)
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
              {/* <th className="px-6 py-4">DosageFormn</th> */}
              <th className="px-6 py-4">Batch No</th>
              <th className="px-6 py-4">Expiry</th>
              <th className="px-6 py-4">Qty</th>
              {/* <th className="px-6 py-4">Balance Qty</th> */}
              <th className="px-6 py-4">Purchase Rate</th>
              {/* <th className="px-6 py-4">Discount %</th>
              <th className="px-6 py-4">Discount Amount</th> */}
              <th className="px-6 py-4">Sale Rate</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={15}>
                  <div className="flex justify-center py-4">
                    <Loading />
                  </div>
                </td>
              </tr>
            )}

            {!loading && filteredStock.length === 0 && (
              <tr>
                <td colSpan={15} className="py-6 text-center">
                  No stock found
                </td>
              </tr>
            )}

            {!loading &&
              filteredStock.map((med) => {
                return med.batches.map((b, batchIndex) => {
                  const today = new Date()
                  const expiry = new Date(b.expiryDate)

                  let status = 'Normal'
                  let rowClass = ''
                  if (b.balanceQty === 0) {
                    status = 'Stock Zero'
                    rowClass = 'bg-[#FEE2E2] text-red font-semibold'
                  } else if (expiry < today) {
                    status = 'Expired'
                    rowClass = 'bg-[#FECACA] text-[#B91C1C] font-semibold'
                  } else if (
                    expiry <=
                    new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000)
                  ) {
                    status = 'Near Expiry'
                    rowClass = ' text-[#D97706] font-semibold'
                  }

                  return (
                    <tr
                      key={b.id}
                      className={`border-b ${rowClass}`}
                    >
                      {batchIndex === 0 && (
                        <>
                          <td
                            rowSpan={med.batches.length}
                            className="px-6 py-4 font-medium bg-white text-dark"
                          >
                            {b.id}
                          </td>
                          <td
                            rowSpan={med.batches.length}
                            className="px-6 py-4 font-medium bg-white text-dark"
                          >
                            {b.sku}
                          </td>
                        </>
                      )}
                      <td className="px-6 py-4">{b.batchNo}</td>
                      <td className="px-6 py-4">
                        {expiry.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">{b.balanceQty}</td>
                      <td className="px-6 py-4">{b.rate}</td>
                      <td className="px-6 py-4">{b.saleRate}</td>
                      <td className="px-6 py-4">{status}</td>
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
