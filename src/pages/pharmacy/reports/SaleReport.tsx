import { useEffect, useState } from 'react'
import Button from '../../../components/button/Button'
import { Input } from '../../../components/input/Input'
import Loading from '../../../components/loading/Loading'

type SaleItem = {
  id: number
  variantId: number
  quantity: number
  saleRate: number
  purchaseRate?: number
}

type Sale = {
  id: number
  saleNo: number
  saleDate: string
  customerName: string
  paymentMode: string
  netAmount: number
  discountAmount: number
  taxAmount: number
  items: SaleItem[]
}

const SaleReport = () => {
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [fromDate, setFromDate] = useState<string>('')
  const [toDate, setToDate] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState<string>('')

  const API_BASE = import.meta.env.VITE_API_BASE_URL as string
  const token = localStorage.getItem('token')

  // ✅ SET DEFAULT DATE (TODAY)
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    setFromDate(today)
    setToDate(today)
  }, [])

  // ✅ FETCH SALES (FIXED URL)
  const fetchSales = async () => {
    try {
      setLoading(true)
      setError(null)

      const url = `${API_BASE}/api/sale-report?fromDate=${fromDate}&toDate=${toDate}`

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) {
        const errJson = await res.json()
        throw new Error(errJson.message || 'Failed to fetch sales')
      }

      const json = await res.json()
      setSales(json.data ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setSales([])
    } finally {
      setLoading(false)
    }
  }

  // AUTO FETCH
  useEffect(() => {
    if (fromDate && toDate) fetchSales()
  }, [fromDate, toDate])

  // ✅ DOWNLOAD EXCEL
  const downloadExcel = () => {
    const url = `${API_BASE}/api/sales/report?fromDate=${fromDate}&toDate=${toDate}&export=excel`
    window.open(url, '_blank')
  }

  // SEARCH
  const filteredSales = sales.filter((sale) =>
    sale.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // SUMMARY
  const summary = filteredSales.reduce(
    (acc, sale) => {
      acc.totalSales += sale.netAmount
      acc.totalDiscount += sale.discountAmount
      acc.totalTax += sale.taxAmount
      sale.items.forEach((item) => {
        acc.totalQty += item.quantity
        const profit = (item.saleRate - (item.purchaseRate || 0)) * item.quantity
        acc.totalProfit += profit
      })
      return acc
    },
    { totalSales: 0, totalQty: 0, totalDiscount: 0, totalTax: 0, totalProfit: 0 }
  )

  return (
    <div className="flex flex-col gap-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4">
        <p className="text-xl font-semibold">Sales Report</p>

        <div className="flex flex-col md:flex-row items-center gap-3">
          <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />

          <Input
            type="text"
            placeholder="Search customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Button onClick={fetchSales}>Filter</Button>

          {/* ✅ EXPORT BUTTON */}
          <Button onClick={downloadExcel}>Export Excel</Button>
        </div>
      </div>

      {/* TOTALS */}
      <div className="flex flex-wrap gap-4">
        <div className="bg-gray-100 px-4 py-2 rounded shadow">Total Sales: {summary.totalSales.toFixed(2)}</div>
        <div className="bg-gray-100 px-4 py-2 rounded shadow">Total Qty: {summary.totalQty}</div>
        <div className="bg-gray-100 px-4 py-2 rounded shadow">Total Discount: {summary.totalDiscount.toFixed(2)}</div>
        <div className="bg-gray-100 px-4 py-2 rounded shadow">Total Tax: {summary.totalTax.toFixed(2)}</div>
        <div className="bg-gray-100 px-4 py-2 rounded shadow">Total Profit: {summary.totalProfit.toFixed(2)}</div>
      </div>

      {/* TABLE */}
      <div className="relative overflow-x-auto shadow-lg rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-white uppercase bg-dark">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Sale No</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Payment Mode</th>
              <th className="px-6 py-4">Net Amount</th>
              <th className="px-6 py-4">Qty</th>
              <th className="px-6 py-4">Profit</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} className="text-center py-6">
                  <Loading />
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={8} className="text-center text-red-500 py-4">
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && filteredSales.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-6">
                  No sales found
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              filteredSales.map((sale) => {
                const qty = sale.items.reduce((acc, i) => acc + i.quantity, 0)
                const profit = sale.items.reduce(
                  (acc, i) => acc + (i.saleRate - (i.purchaseRate || 0)) * i.quantity,
                  0
                )

                return (
                  <tr key={sale.id} className="bg-[#DFDEDE] border-b">
                    <td className="px-6 py-3">{sale.id}</td>
                    <td className="px-6 py-3">{sale.saleNo}</td>
                    <td className="px-6 py-3">{new Date(sale.saleDate).toLocaleDateString()}</td>
                    <td className="px-6 py-3">{sale.customerName}</td>
                    <td className="px-6 py-3">{sale.paymentMode}</td>
                    <td className="px-6 py-3">{sale.netAmount.toFixed(2)}</td>
                    <td className="px-6 py-3">{qty}</td>
                    <td className="px-6 py-3">{profit.toFixed(2)}</td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SaleReport