// import { useState, useEffect, useRef } from 'react'
// import type { ChangeEvent, FormEvent } from 'react'
// import { Input } from '../../../components/input/Input'
// import { Label } from '../../../components/input/Label'
// import { GroupInput } from '../../../components/input/GroupInput'
// import Dropdown from '../../../components/input/Dropdown'

// interface IndentItem {
//   medicineId: string
//   requestedQty: number
//   remarks?: string
// }

// interface IndentForm {
//   requestedBy: string
//   departmentId: string
//   remarks?: string
//   items: IndentItem[]
// }

// interface Option {
//   id: string
//   name: string
// }

// const API_BASE = import.meta.env.VITE_API_BASE_URL
// const token = localStorage.getItem('token')

// const AddIndent = () => {
//   const [form, setForm] = useState<IndentForm>({
//     requestedBy: localStorage.getItem('userId') || '',
//     departmentId: '',
//     remarks: '',
//     items: [{ medicineId: '', requestedQty: 0, remarks: '' }],
//   })

//   const [departments, setDepartments] = useState<Option[]>([])
//   const [medicines, setMedicines] = useState<Option[]>([])

//   const createButtonRef = useRef<HTMLButtonElement | null>(null)

//   // Fetch departments
//   useEffect(() => {
//     fetch(`${API_BASE}/department`, {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//       .then((res) => res.json())
//       .then((data) => setDepartments(data))
//       .catch(console.error)
//   }, [])

//   // Fetch medicines
//   useEffect(() => {
//     fetch(`${API_BASE}/api/medicine`, {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//       .then((res) => res.json())
//       .then((data) => setMedicines(data))
//       .catch(console.error)
//   }, [])

//   const handleChange = (
//     e: ChangeEvent<HTMLInputElement>,
//     index?: number,
//     field?: keyof IndentItem
//   ) => {
//     if (typeof index === 'number' && field) {
//       const newItems = [...form.items]
//       newItems[index][field] =
//         field === 'requestedQty' ? Number(e.target.value) : e.target.value
//       setForm({ ...form, items: newItems })
//     } else {
//       setForm({ ...form, [e.target.name]: e.target.value })
//     }
//   }

//   const addItem = () => {
//     setForm({
//       ...form,
//       items: [...form.items, { medicineId: '', requestedQty: 0, remarks: '' }],
//     })
//   }

//   const removeItem = (index: number) => {
//     const newItems = [...form.items]
//     newItems.splice(index, 1)
//     setForm({ ...form, items: newItems })
//   }

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault()
//     try {
//       const response = await fetch(`${API_BASE}/pharmacy/indent`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(form),
//       })

//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.message || 'Something went wrong')
//       }

//       alert('Indent Created Successfully!')
//       setForm({
//         requestedBy: localStorage.getItem('userId') || '',
//         departmentId: '',
//         remarks: '',
//         items: [{ medicineId: '', requestedQty: 0, remarks: '' }],
//       })
//     } catch (error: any) {
//       console.error(error)
//       alert(error.message)
//     }
//   }

//   return (
//     <div className="max-w-3xl mx-auto p-4 bg-white shadow rounded-md">
//       <h2 className="text-xl font-semibold mb-4">Create Indent</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Department */}
//         <GroupInput>
//           <Label className="block mb-1 font-medium">Department</Label>
//           <Dropdown
//             options={departments}
//             selected={
//               departments.find((d) => d.id === form.departmentId) || null
//             }
//             onSelect={(option) =>
//               setForm({ ...form, departmentId: option.id })
//             }
//             placeholder="Select department"
//           />
//         </GroupInput>

//         {/* Remarks */}
//         <GroupInput>
//           <Label className="block mb-1 font-medium">Remarks</Label>
//           <Input
//             name="remarks"
//             value={form.remarks}
//             onChange={handleChange}
//             placeholder="Enter remarks (optional)"
//           />
//         </GroupInput>

//         {/* Items */}
//         <div>
//           <label className="block mb-2 font-medium">Items</label>
//           {form.items.map((item, index) => (
//             <div key={index} className="flex gap-2 mb-2 items-end">
//               <div className="flex-1">
//                 <label className="block text-sm mb-1">Medicine</label>
//                 <Dropdown
//                   options={medicines}
//                   selected={
//                     medicines?.find((m) => m.id === item.medicineId) || null
//                   }
//                   onSelect={(option) => {
//                     handleChange(
//                       { target: { value: option.id, name: 'medicineId' } } as any,
//                       index,
//                       'medicineId'
//                     )
//                   }}
//                   placeholder="Select medicine"
//                 />
//               </div>
//               <div className="flex-1">
//                 <label className="block text-sm mb-1">Requested Qty</label>
//                 <Input
//                   type="number"
//                   value={item.requestedQty}
//                   onChange={(e) => handleChange(e, index, 'requestedQty')}
//                   placeholder="Qty"
//                   onKeyDown={(e) => {
//                     if (e.key === 'Enter') {
//                       e.preventDefault()
//                       addItem()
//                     } else if (
//                       e.key === 'Tab' &&
//                       index === form.items.length - 1
//                     ) {
//                       e.preventDefault()
//                       createButtonRef.current?.focus()
//                     }
//                   }}
//                 />
//               </div>
//               <div className="flex-1">
//                 <label className="block text-sm mb-1">Remarks</label>
//                 <Input
//                   value={item.remarks}
//                   onChange={(e) => handleChange(e, index, 'remarks')}
//                   placeholder="Remarks"
//                   onKeyDown={(e) => {
//                     if (e.key === 'Enter') {
//                       e.preventDefault()
//                       addItem()
//                     } else if (
//                       e.key === 'Tab' &&
//                       index === form.items.length - 1
//                     ) {
//                       e.preventDefault()
//                       createButtonRef.current?.focus()
//                     }
//                   }}
//                 />
//               </div>
//               <button
//                 type="button"
//                 onClick={() => removeItem(index)}
//                 className="text-red-500 font-bold"
//               >
//                 X
//               </button>
//             </div>
//           ))}
//         </div>

//         <button
//           type="submit"
//           ref={createButtonRef}
//           className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
//         >
//           Create Indent
//         </button>
//       </form>
//     </div>
//   )
// }

// export default AddIndent



const AddIndent = () => {
  return (
    <div>AddIndent</div>
  )
}

export default AddIndent