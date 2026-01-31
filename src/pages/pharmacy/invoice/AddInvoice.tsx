// import { useEffect, useState } from 'react'
// import Button from '../../../components/button/Button'
// import { GroupInput } from '../../../components/input/GroupInput'
// import { Input } from '../../../components/input/Input'
// import { Label } from '../../../components/input/Label'
// import TextArea from '../../../components/input/TextArea'
// import Dropdown from '../../../components/input/Dropdown'
// import { routePaths } from '../../../constants/routePaths'

// type Option = {
//   id: number
//   name: string
// }

// type InvoiceItem = {
//   medicine: Option | null
//   batch: string
//   expiry: string
//   qty: number
//   purchasePrice: number
//   salesTax: number
//   advanceTax: number
//   total: number
// }

// const API_BASE = import.meta.env.VITE_API_BASE_URL
// const token = localStorage.getItem('token')

// export default function AddInvoice() {
//   const [companies, setCompanies] = useState<Option[]>([])
//   const [distributors, setDistributors] = useState<Option[]>([])
//   const [medicines, setMedicines] = useState<Option[]>([])

//   const [selectedCompany, setSelectedCompany] = useState<Option | null>(null)
//   const [selectedDistributor, setSelectedDistributor] =
//     useState<Option | null>(null)

//   const [items, setItems] = useState<InvoiceItem[]>([
//     {
//       medicine: null,
//       batch: '',
//       expiry: '',
//       qty: 0,
//       purchasePrice: 0,
//       salesTax: 0,
//       advanceTax: 0,
//       total: 0,
//     },
//   ])

//   /* ---------------- FETCH DROPDOWNS ---------------- */
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const headers = {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         }

//         const [companyRes, distributorRes, medicineRes] =
//           await Promise.all([
//             fetch(`${API_BASE}/api/company`, { headers }),
//             fetch(`${API_BASE}/api/distributor`, { headers }),
//             fetch(`${API_BASE}/api/medicine`, { headers }),
//           ])

//         const companyJson = await companyRes.json()
//         const distributorJson = await distributorRes.json()
//         const medicineJson = await medicineRes.json()

//         // ✅ IMPORTANT: use `.data`
//         setCompanies(companyJson.data || [])
//         setDistributors(distributorJson.data || [])
//         setMedicines(medicineJson.data || [])
//       } catch (error) {
//         console.error('Dropdown fetch error:', error)
//       }
//     }

//     fetchData()
//   }, [])

//   /* ---------------- ITEM HANDLING ---------------- */

//   const handleAddItem = () => {
//     setItems([
//       ...items,
//       {
//         medicine: null,
//         batch: '',
//         expiry: '',
//         qty: 0,
//         purchasePrice: 0,
//         salesTax: 0,
//         advanceTax: 0,
//         total: 0,
//       },
//     ])
//   }

//   const handleRemoveItem = (index: number) => {
//     const updated = [...items]
//     updated.splice(index, 1)
//     setItems(updated)
//   }

//   const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
//     const updated = [...items]
//     updated[index][field] = value

//     const item = updated[index]
//     item.total =
//       item.qty * item.purchasePrice +
//       (item.qty * item.purchasePrice * item.salesTax) / 100 +
//       (item.qty * item.purchasePrice * item.advanceTax) / 100

//     setItems(updated)
//   }

//   /* ---------------- SUBMIT ---------------- */

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()

//     const payload = {
//       companyId: selectedCompany?.id,
//       distributorId: selectedDistributor?.id,
//       items: items.map((i) => ({
//         medicineId: i.medicine?.id,
//         batch: i.batch,
//         expiry: i.expiry,
//         qty: i.qty,
//         purchasePrice: i.purchasePrice,
//         salesTax: i.salesTax,
//         advanceTax: i.advanceTax,
//         total: i.total,
//       })),
//     }

//     console.log('FINAL PAYLOAD:', payload)
//   }

//   return (
//     <form onSubmit={handleSubmit} className="flex flex-col gap-10">
//       {/* HEADER */}
//       <div className="flex justify-between items-center border-b pb-3">
//         <p className="text-xl font-semibold">Add Invoice</p>
//         <Button to={routePaths.PROCEDURE} asLink>
//           Back
//         </Button>
//       </div>

//       {/* HEADER FIELDS */}
//       <div className="grid grid-cols-3 gap-4">
//         <GroupInput>
//           <Label>Invoice Date</Label>
//           <Input type="date" />
//         </GroupInput>

//         <GroupInput>
//           <Label>Distributor</Label>
//           <Dropdown
//             options={distributors}
//             selected={selectedDistributor}
//             onSelect={setSelectedDistributor}
//             placeholder="Select Distributor"
//           />
//         </GroupInput>

//         <GroupInput>
//           <Label>Company</Label>
//           <Dropdown
//             options={companies}
//             selected={selectedCompany}
//             onSelect={setSelectedCompany}
//             placeholder="Select Company"
//           />
//         </GroupInput>

//         <GroupInput className="col-span-full">
//           <Label>Remarks</Label>
//           <TextArea />
//         </GroupInput>
//       </div>

//       {/* ITEMS */}
//       <table className="w-full border">
//         <thead>
//           <tr>
//             <th>Medicine</th>
//             <th>Batch</th>
//             <th>Expiry</th>
//             <th>Qty</th>
//             <th>Price</th>
//             <th>Sales %</th>
//             <th>Advance %</th>
//             <th>Total</th>
//             <th></th>
//           </tr>
//         </thead>

//         <tbody>
//           {items.map((item, i) => (
//             <tr key={i}>
//               <td>
//                 <Dropdown
//                   options={medicines}
//                   selected={item.medicine}
//                   onSelect={(val) => updateItem(i, 'medicine', val)}
//                   placeholder="Select Medicine"
//                 />
//               </td>

//               <td>
//                 <Input
//                   value={item.batch}
//                   onChange={(e) =>
//                     updateItem(i, 'batch', e.target.value)
//                   }
//                 />
//               </td>

//               <td>
//                 <Input
//                   type="month"
//                   value={item.expiry}
//                   onChange={(e) =>
//                     updateItem(i, 'expiry', e.target.value)
//                   }
//                 />
//               </td>

//               <td>
//                 <Input
//                   type="number"
//                   value={item.qty}
//                   onChange={(e) =>
//                     updateItem(i, 'qty', Number(e.target.value))
//                   }
//                 />
//               </td>

//               <td>
//                 <Input
//                   type="number"
//                   value={item.purchasePrice}
//                   onChange={(e) =>
//                     updateItem(i, 'purchasePrice', Number(e.target.value))
//                   }
//                 />
//               </td>

//               <td>
//                 <Input
//                   type="number"
//                   value={item.salesTax}
//                   onChange={(e) =>
//                     updateItem(i, 'salesTax', Number(e.target.value))
//                   }
//                 />
//               </td>

//               <td>
//                 <Input
//                   type="number"
//                   value={item.advanceTax}
//                   onChange={(e) =>
//                     updateItem(i, 'advanceTax', Number(e.target.value))
//                   }
//                 />
//               </td>

//               <td>
//                 <Input value={item.total} disabled />
//               </td>

//               <td>
//                 <Button type="button" onClick={() => handleRemoveItem(i)}>
//                   ✕
//                 </Button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <Button type="button" onClick={handleAddItem}>
//         + Add Medicine
//       </Button>

//       <div className="flex gap-4">
//         <Button type="submit">Save Invoice</Button>
//         <Button type="reset">Clear</Button>
//       </div>
//     </form>
//   )
// }



export const AddInvoice = () => {
  return (
    <div>AddInvoice</div>
  )
}
