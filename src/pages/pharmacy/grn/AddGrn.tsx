// import { useEffect, useState } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import Button from '../../../components/button/Button'
// import { Input } from '../../../components/input/Input'
// import { Label } from '../../../components/input/Label'
// import { GroupInput } from '../../../components/input/GroupInput'
// import TextArea from '../../../components/input/TextArea'
// import { routePaths } from '../../../constants/routePaths'

// /* ================= TYPES ================= */

// type Medicine = {
//   id: number
//   name: string
//   unitPacking?: string
// }

// type POItem = {
//   medicineId: number
//   orderedQty: number
//   rate: number
//   discountPercent: number
//   taxPercent: number
//   medicine: Medicine
// }

// type GRNItem = {
//   medicineId: number
//   medicineName: string
//   unit: string
//   orderedQty: number
//   acceptedQty: number
//   bonusQty: number
//   balanceQty: number
//   batchNo: string
//   expiryDate: string
//   previousRate: number
//   purchaseRate: number
//   saleRate: number
//   discountPercent: number
//   taxPercent: number
//   amount: number
// }

// type PO = {
//   id: number
//   poNo: string
//   poDate: string
//   distributorId: number
//   distributor: { name: string }
//   departmentId?: number
//   items: POItem[]
// }

// /* ================= CONFIG ================= */

// const API_BASE = import.meta.env.VITE_API_BASE_URL
// const token = localStorage.getItem('token')

// /* ================= COMPONENT ================= */

// export default function AddGrn() {
//   const { id } = useParams()
//   const navigate = useNavigate()

//   const [po, setPo] = useState<PO | null>(null)
//   const [items, setItems] = useState<GRNItem[]>([])
//   const [grnNo, setGrnNo] = useState('')
//   const [grnDate, setGrnDate] = useState('')
//   const [invoiceNo, setInvoiceNo] = useState('')
//   const [remarks, setRemarks] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [message, setMessage] = useState<{
//     type: 'success' | 'error'
//     text: string
//   } | null>(null)

//   /* ================= FETCH PO ================= */
//   useEffect(() => {
//     const fetchPO = async () => {
//       const res = await fetch(`${API_BASE}/api/po/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       const json = await res.json()
//       const poData: PO = json.data ?? json

//       setPo(poData)

//       setItems(
//         poData.items.map((item) => ({
//           medicineId: item.medicineId,
//           medicineName: item.medicine.name,
//           unit: item.medicine.unitPacking ?? '-',
//           orderedQty: item.orderedQty,
//           acceptedQty: 0,
//           bonusQty: 0,
//           balanceQty: item.orderedQty,
//           batchNo: '',
//           expiryDate: '',
//           previousRate: item.rate,
//           purchaseRate: item.rate,
//           saleRate: 0,
//           discountPercent: item.discountPercent,
//           taxPercent: item.taxPercent,
//           amount: 0,
//         }))
//       )
//     }

//     fetchPO()
//   }, [id])

//   /* ================= UPDATE ITEM ================= */
//   const updateItem = <K extends keyof GRNItem>(
//     index: number,
//     field: K,
//     value: GRNItem[K]
//   ) => {
//     const copy = [...items]
//     const item = copy[index]
//     item[field] = value
//     item.balanceQty = item.orderedQty - item.acceptedQty
//     item.amount = item.acceptedQty * item.purchaseRate
//     setItems(copy)
//   }

//   const grnTotal = items.reduce((sum, i) => sum + i.amount, 0)

//   /* ================= SUBMIT ================= */
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!po) return

//     if (!grnNo || !grnDate) {
//       setMessage({ type: 'error', text: 'GRN No and GRN Date are required' })
//       return
//     }

//     setLoading(true)
//     setMessage(null)

//     try {
//       const res = await fetch(`${API_BASE}/api/grn`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           grnNo,
//           grnDate,
//           poId: po.id,
//           poNo: po.poNo,
//           poDate: po.poDate,
//           distributorId: po.distributorId,
//           departmentId: po.departmentId ?? null,
//           invoiceNo,
//           remarks,
//           items: items.map((i) => ({
//             medicineId: i.medicineId,
//             orderedQty: i.orderedQty,
//             receivedQty: i.acceptedQty,
//             bonusQty: i.bonusQty,
//             batchNo: i.batchNo,
//             expiryDate: i.expiryDate,
//             rate: i.purchaseRate,
//             saleRate: i.saleRate,
//             discountPercent: i.discountPercent,
//             taxPercent: i.taxPercent,
//           })),
//         }),
//       })

//       const json = await res.json()

//       if (!res.ok) throw new Error(json.message)
//       setMessage({ type: 'success', text: 'GRN created successfully' })
//       setTimeout(() => navigate(routePaths.GRN), 1200)
//     } catch (err: unknown) {
//       if (err instanceof Error) {
//         setMessage({ type: 'error', text: err.message })
//       } else {
//         setMessage({ type: 'error', text: 'Failed to save GRN' })
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   if (!po) return <p>Loading...</p>

//   /* ================= UI ================= */
//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       {/* HEADER CARD */}
//       <div className="bg-white rounded-xl shadow p-6 grid grid-cols-4 gap-4">
//         <h2 className="col-span-4 text-xl font-semibold">
//           Goods Receipt Note (GRN)
//         </h2>

//         <GroupInput>
//           <Label>GRN No</Label>
//           <Input value={grnNo} onChange={(e) => setGrnNo(e.target.value)} />
//         </GroupInput>

//         <GroupInput>
//           <Label>GRN Date</Label>
//           <Input
//             type="date"
//             value={grnDate}
//             onChange={(e) => setGrnDate(e.target.value)}
//           />
//         </GroupInput>

//         <GroupInput>
//           <Label>PO No</Label>
//           <Input value={po.poNo} disabled />
//         </GroupInput>

//         <GroupInput>
//           <Label>Distributor</Label>
//           <Input value={po.distributor.name} disabled />
//         </GroupInput>

//         <GroupInput className="col-span-2">
//           <Label>Invoice / DC No</Label>
//           <Input
//             value={invoiceNo}
//             onChange={(e) => setInvoiceNo(e.target.value)}
//           />
//         </GroupInput>

//         <GroupInput className="col-span-4">
//           <Label>Remarks</Label>
//           <TextArea
//             rows={2}
//             value={remarks}
//             onChange={(e) => setRemarks(e.target.value)}
//           />
//         </GroupInput>
//       </div>

//       {/* ITEMS TABLE */}
//       <div className="bg-white rounded-xl shadow overflow-x-auto">
//         <table className="w-full text-sm">
//           <thead className="bg-gray-100">
//             <tr>
//               {[
//                 'Item',
//                 'Unit',
//                 'DosageForm',
//                 'Ordered',
//                 'Accepted',
//                 'Bonus',
//                 'Balance',
//                 'Batch',
//                 'Expiry',
//                 'Prev',
//                 'Purchase',
//                 'Sale',
//                 'Amount',
//               ].map((h) => (
//                 <th key={h} className="px-3 py-2 text-left">
//                   {h}
//                 </th>
//               ))}
//             </tr>
//           </thead>

//           <tbody>
//             {items.map((item, i) => (
//               <tr key={i} className="border-t hover:bg-gray-50">
//                 <td className="px-3">{item.medicineName}</td>
//                 <td className="px-3">{item.unit}</td>
//                 <td className="px-3">{item?.dosageForm?.name}</td>
//                 <td className="px-3">{item.orderedQty}</td>

//                 <td className="px-3">
//                   <Input
//                     type="number"
//                     min={0}
//                     value={item.acceptedQty}
//                     onChange={(e) =>
//                       updateItem(i, 'acceptedQty', +e.target.value)
//                     }
//                     className='rounded-none'
//                   />
//                 </td>

//                 <td className="px-3">
//                   <Input
//                     type="number"
//                     min={0}
//                     value={item.bonusQty}
//                     onChange={(e) => updateItem(i, 'bonusQty', +e.target.value)}
//                   />
//                 </td>

//                 <td className="px-3 text-gray-500">{item.balanceQty}</td>

//                 <td className="px-3">
//                   <Input
//                     value={item.batchNo}
//                     onChange={(e) => updateItem(i, 'batchNo', e.target.value)}
//                   />
//                 </td>

//                 <td className="px-3">
//                   <Input
//                     type="date"
//                     value={item.expiryDate}
//                     onChange={(e) =>
//                       updateItem(i, 'expiryDate', e.target.value)
//                     }
//                   />
//                 </td>

//                 <td className="px-3 text-gray-500">{item.previousRate}</td>

//                 <td className="px-3">
//                   <Input
//                     type="number"
//                     min={0}
//                     value={item.purchaseRate}
//                     onChange={(e) =>
//                       updateItem(i, 'purchaseRate', +e.target.value)
//                     }
//                   />
//                 </td>

//                 <td className="px-3">
//                   <Input
//                     type="number"
//                     min={0}
//                     value={item.saleRate}
//                     onChange={(e) => updateItem(i, 'saleRate', +e.target.value)}
//                   />
//                 </td>

//                 <td className="px-3 font-semibold">{item.amount}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* FOOTER */}
//       <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow">
//         <div className="text-lg font-semibold">
//           Total: {grnTotal.toFixed(2)}
//         </div>

//         <Button type="submit" disabled={loading}>
//           {loading ? 'Saving...' : 'Save GRN'}
//         </Button>
//       </div>

//       {message && (
//         <div
//           className={`p-3 rounded ${
//             message.type === 'success'
//               ? 'bg-green-100 text-green-700'
//               : 'bg-red-100 text-red-700'
//           }`}
//         >
//           {message.text}
//         </div>
//       )}
//     </form>
//   )
// }



const AddGrn = () => {
  return (
    <div>AddGrn</div>
  )
}

export default AddGrn