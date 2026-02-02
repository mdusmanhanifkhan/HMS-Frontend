import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Button from '../../../components/button/Button'
import { Input } from '../../../components/input/Input'
import { Label } from '../../../components/input/Label'
import { GroupInput } from '../../../components/input/GroupInput'
import Dropdown from '../../../components/input/Dropdown'

interface Distributor {
  id: number
  name: string
  contactPerson?: string
  phone?: string
}

interface POItem {
  id: number
  medicineId: number
  orderedQty: number
  rate: number
  totalAmount: number
}

interface PurchaseOrder {
  id: number
  poNo: string
  poDate: string
  distributor: Distributor
  totalAmount: number
  items: POItem[]
  status: string
  remarks?: string
}
type Option = {
  id: number | string
  name: string
}

// Account type dropdown options
const accountOptions = [
  { id: 'CASH', name: 'CASH' },
  { id: 'BANK', name: 'BANK' },
  { id: 'CREDIT', name: 'CREDIT' },
  { id: 'ADVANCE', name: 'ADVANCE' },
  { id: 'OTHER', name: 'OTHER' },
]

const PurchaseOrderPayment = () => {
  const { id: poId } = useParams<{ id: string }>()
  const [po, setPo] = useState<PurchaseOrder | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  // Ledger fields
  const [debit, setDebit] = useState<number | ''>('')
  const [credit, setCredit] = useState<number | ''>('')
  const [accountType, setAccountType] = useState<Option | null>(null)
  const [accountRefId, setAccountRefId] = useState<string | undefined>('')
  const [approvedBy, setApprovedBy] = useState<string>('')
  const [remarks, setRemarks] = useState<string>('')

  const API_BASE = import.meta.env.VITE_API_BASE_URL
  const token = localStorage.getItem('token')

  // Fetch PO details
  useEffect(() => {
    if (!poId || !token) return

    const fetchPO = async () => {
      setLoading(true)
      try {
        const res = await fetch(`${API_BASE}/api/po/${poId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || 'Failed to fetch PO')
        setPo(data)
        // Prefill debit/credit with PO total
        setDebit(data.totalAmount)
        setCredit(0)
      } catch (err: unknown) {
        if (err instanceof Error) setMessage(err.message)
        else setMessage('Something went wrong')
      } finally {
        setLoading(false)
      }
    }

    fetchPO()
  }, [poId, token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) {
      setMessage('Authentication token missing')
      return
    }

    if (!accountType) {
      setMessage('Account Type is required')
      return
    }

    try {
      setLoading(true)
      const res = await fetch(`${API_BASE}/api/ledger-entry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          refType: 'PO',
          refId: poId,
          debit,
          credit,
          accountType: accountType.name,
          accountRefId: accountRefId || null,
          approvedBy,
          remarks,
        }),
      })

      const data = await res.json()
      if (!res.ok)
        throw new Error(data.message || 'Failed to create ledger entry')

      setMessage('Ledger entry created successfully!')
      // Reset form
      setDebit(po?.totalAmount || '')
      setCredit(0)
      setAccountType(null)
      setAccountRefId('')
      setApprovedBy('')
      setRemarks('')
    } catch (err: unknown) {
      if (err instanceof Error) setMessage(err.message)
      else setMessage('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl p-4">
      <h2 className="text-xl font-semibold mb-4">PO Payment - ID: {poId}</h2>

      {message && (
        <div className="mb-4 text-center text-red-500 font-medium">
          {message}
        </div>
      )}

      {/* Show PO details */}
      {po && (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50 grid grid-cols-2 gap-4">
          <div>
            <strong>PO No:</strong> {po.poNo}
          </div>
          <div>
            <strong>Date:</strong> {new Date(po.poDate).toLocaleDateString()}
          </div>
          <div>
            <strong>Distributor:</strong> {po.distributor.name}
          </div>
          <div>
            <strong>Total Amount:</strong> {po.totalAmount}
          </div>
          <div className="col-span-2">
            <strong>Status:</strong> {po.status}
          </div>
          {po.remarks && (
            <div className="col-span-2">
              <strong>Remarks:</strong> {po.remarks}
            </div>
          )}
        </div>
      )}

      {/* Ledger entry form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
        <GroupInput>
          <Label htmlFor="debit">Debit</Label>
          <Input
            type="number"
            id="debit"
            value={debit}
            onChange={(e) =>
              setDebit(e.target.value === '' ? '' : Number(e.target.value))
            }
            placeholder="Enter debit amount"
          />
        </GroupInput>

        <GroupInput>
          <Label htmlFor="credit">Credit</Label>
          <Input
            type="number"
            id="credit"
            value={credit}
            onChange={(e) =>
              setCredit(e.target.value === '' ? '' : Number(e.target.value))
            }
            placeholder="Enter credit amount"
          />
        </GroupInput>

        <GroupInput>
          <Label htmlFor="accountType">Account Type</Label>
          <Dropdown
            options={accountOptions}
            selected={accountType}
            onSelect={(opt) => setAccountType(opt)}
            placeholder="Select account type..."
          />
        </GroupInput>

        <GroupInput>
          <Label htmlFor="approvedBy">Approved By</Label>
          <Input
            type="text"
            id="approvedBy"
            value={approvedBy}
            onChange={(e) => setApprovedBy(e.target.value)}
            placeholder="Enter approver ID"
          />
        </GroupInput>

        <GroupInput>
          <Label htmlFor="remarks">Remarks</Label>
          <Input
            type="text"
            id="remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Optional remarks"
          />
        </GroupInput>

        <GroupInput>
          <Label htmlFor="accountRefId">Account Ref ID</Label>
          <Input
            type="text"
            id="accountRefId"
            value={accountRefId}
            onChange={(e) => setAccountRefId(e.target.value)}
            placeholder="Optional account reference"
          />
        </GroupInput>

        <div></div>
        <div></div>

        <Button type="submit" disabled={loading} className="w-fit">
          {loading ? 'Submitting...' : 'Submit Payment'}
        </Button>
      </form>
    </div>
  )
}

export default PurchaseOrderPayment
