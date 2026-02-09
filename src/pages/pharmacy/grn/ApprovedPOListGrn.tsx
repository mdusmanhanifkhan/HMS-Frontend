// import { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import Loading from '../../../components/loading/Loading'
// import Button from '../../../components/button/Button'
// import { routePaths } from '../../../constants/routePaths'

// /* -------------------- Types -------------------- */
// interface Option {
//   id: number
//   name: string
//   phone?: string
// }

// interface POItem {
//   id: number
//   medicineId: number
//   orderedQty: number
//   rate: number
//   discountPercent?: number
//   taxPercent?: number
//   totalAmount: number
//   medicine?: Option
// }

// interface PO {
//   id: number
//   poNo: string
//   poDate: string
//   distributor: Option
//   status: 'OPEN' | 'APPROVED' | 'CANCELLED' | string
//   paymentType: string
//   netAmount: number
//   approvedBy?: number | null
//   approvedAt?: string | null
//   pdfUrl?: string | null
//   items: POItem[]
//   grns: any[]
// }

// /* -------------------- Component -------------------- */
// const ApprovedPOListGrn = () => {
//   const [pos, setPos] = useState<PO[]>([])
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   const API_BASE = import.meta.env.VITE_API_BASE_URL
//   const token = localStorage.getItem('token')
//   const navigate = useNavigate()

//   /* -------------------- Fetch POs -------------------- */
//   const fetchPOs = async () => {
//     if (!token) return setError('Authentication token missing')

//     setLoading(true)
//     setError(null)

//     try {
//       const res = await fetch(`${API_BASE}/api/get-all-pos`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       if (!res.ok) throw new Error('Failed to fetch POs')

//       const data = await res.json()
//       setPos(Array.isArray(data?.data) ? data.data : [])
//     } catch (err: unknown) {
//       setError(err instanceof Error ? err.message : 'Something went wrong')
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchPOs()
//   }, [token])

//   /* -------------------- Navigation on Approve -------------------- */
//   const handleApprove = (poId: number) => {
//     navigate(`${routePaths.PURCHASE_ORDER_APPROVEL}/${poId}`)
//   }

//   /* -------------------- Helper: Status Badge -------------------- */
//   const renderStatus = (status: string) => {
//     // Map real status strings to colors
//     const colors: Record<string, string> = {
//       OPEN: '#3B82F6', // Blue
//       APPROVED: '#FACC15', // Yellow
//       CANCELLED: '#EF4444', // Red
//       PAID: '#22C55E', // Green
//       PARTIALPAID: '#F97316', // Orange
//       PAIDLATER: '#A855F7', // Purple
//       FULL: '#22C55E', // Treat full paid as green
//       '50% payment now, 50% after receiving goods': '#F97316', // Orange
//       ADVANCE: '#A855F7', // Purple example
//       // Add more mappings as needed
//     }

//     const bgColor = colors[status] || '#6B7280' // fallback gray

//     return (
//       <span
//         className="px-2 py-1 rounded-full text-white text-sm font-semibold"
//         style={{ backgroundColor: bgColor }}
//       >
//         {status}
//       </span>
//     )
//   }

//   /* -------------------- Helper: Can Create GRN -------------------- */
//   // const canCreateGRN = (po: PO) => {
//   //   const paymentTypes = [
//   //     'FULL_AFTER_RECEIVE',
//   //     'PARTIAL_50_AFTER_RECEIVE',
//   //     'ADVANCE',
//   //     'WITHIN_30_DAYS',
//   //     'OPEN',
//   //     'APPROVED',
//   //     'PAID',
//   //     'PARTIALPAID',
//   //     'PAIDLATER',
//   //     'FULL',
//   //     '50% payment now, 50% after receiving goods',
//   //     'ADVANCE',
//   //   ]
//   //   const statuses = ['PAID', 'PARTIALPAID', 'PAIDLATER']

//   //   return (
//   //     statuses.includes(po.status) &&
//   //     paymentTypes.includes(po.paymentType) &&
//   //     (!po.grns || po.grns.length === 0)
//   //   )
//   // }

//   const canCreateGRN = (po: PO) => {
//     // Only show GRN for these statuses
//     const allowedStatuses = [
//       // 'OPEN',
//       'APPROVED',
//       'PAID',
//       'PARTIALPAID',
//       'PAIDLATER',
//       'FULL',
//       '50% payment now, 50% after receiving goods',
//       'ADVANCE',
//       'FULL_AFTER_RECEIVE',
//       'PARTIAL_50_AFTER_RECEIVE',
//       'ADVANCE',
//       'WITHIN_30_DAYS',
//     ]

//     // Exclude CANCELLED
//     if (po.status === 'CANCELLED') return false

//     // If GRN already exists, cannot create
//     if (po.grns && po.grns.length > 0) return false

//     return allowedStatuses.includes(po.status)
//   }

//   const blockedStatuses = ['APPROVED', 'PAID', 'PARTIALPAID', 'PAIDLATER' , '50% payment now, 50% after receiving goods']

//   /* -------------------- Render -------------------- */
//   return (
//     <div className="flex flex-col gap-6">
//       {/* Header */}
//       <div className="flex justify-between items-center w-full border-b pb-3">
//         <p className="text-xl font-semibold">Purchase Orders Approval</p>
//       </div>

//       {/* Table */}
//       <div className="relative overflow-x-auto shadow-lg rounded-lg">
//         <table className="w-full text-sm text-left">
//           <thead className="text-xs text-white uppercase bg-dark">
//             <tr>
//               <th className="px-6 py-4">PO No</th>
//               <th className="px-6 py-4">Date</th>
//               <th className="px-6 py-4">Distributor</th>
//               <th className="px-6 py-4">Payment Type</th>
//               <th className="px-6 py-4">Net Amount</th>
//               <th className="px-6 py-4">Status</th>
//               <th className="px-6 py-4 text-end">Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {/* Loading */}
//             {loading && (
//               <tr>
//                 <td colSpan={8} className="py-4 text-center">
//                   <Loading />
//                 </td>
//               </tr>
//             )}

//             {/* Error */}
//             {!loading && error && (
//               <tr>
//                 <td colSpan={8} className="py-4 text-center text-red-500">
//                   {error}
//                 </td>
//               </tr>
//             )}

//             {/* Empty */}
//             {!loading && !error && pos.length === 0 && (
//               <tr>
//                 <td colSpan={8} className="py-6 text-center">
//                   No POs found.
//                 </td>
//               </tr>
//             )}

//             {/* POs */}
//             {!loading &&
//               pos.map((po) => (
//                 <tr
//                   key={po.id}
//                   className="bg-[#DFDEDE] border-b border-gray-200 hover:bg-gray-100 transition"
//                 >
//                   <td className="px-6 py-4">{po.poNo}</td>
//                   <td className="px-6 py-4">
//                     {new Date(po.poDate).toLocaleDateString()}
//                   </td>
//                   <td className="px-6 py-4">{po.distributor.name}</td>
//                   <td className="px-6 py-4">{po.paymentType}</td>
//                   <td className="px-6 py-4">Rs {po.netAmount.toFixed(2)}</td>
//                   <td className="px-6 py-4">{renderStatus(po.status)}</td>
//                   <td className="px-6 py-4 flex gap-2 justify-end">
//                     {/* Approve button */}
//                     {!blockedStatuses.includes(po.status) && (
//                       <button className="p-2 rounded-md bg-blue-500 text-white transition">
//                         FORWARDING_TO_ACCOUNTS
//                       </button>
//                     )}

//                     {/* Create GRN */}
//                     {canCreateGRN(po) && (
//                       <Button
//                         // variant="primary"
//                         onClick={() =>
//                           navigate(`${routePaths.ADD_GRN}/${po.id}`)
//                         }
//                       >
//                         Create GRN
//                       </Button>
//                     )}

//                     {/* View/Edit GRN */}
//                     {!canCreateGRN(po) && po.grns.length > 0 && (
//                       <Button
//                         // variant="secondary"
//                         onClick={() =>
//                           navigate(`${routePaths.VIEW_GRN}/${po.id}`)
//                         }
//                       >
//                         View/Edit GRN
//                       </Button>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   )
// }

// export default ApprovedPOListGrn




const ApprovedPOListGrn = () => {
  return (
    <div>ApprovedPOListGrn</div>
  )
}

export default ApprovedPOListGrn