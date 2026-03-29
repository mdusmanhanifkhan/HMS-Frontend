// import { useEffect, useState } from 'react'
// import { useParams } from 'react-router-dom'
// import Button from '../../components/button/Button'
// import { Input } from '../../components/input/Input'
// import { Label } from '../../components/input/Label'
// import Dropdown from '../../components/input/Dropdown'
// import ReceiptTemplate from './ReceiptTemplate'
// import SuccessMessage from '../../components/error-handling/SuccessMessage'
// import { usePermissions } from '../../context/PermissionsContext'
// import { GroupInput } from '../../components/input/GroupInput'

// /* ------------------ TYPES ------------------ */
// type Procedure = {
//   id: number
//   name: string
//   fee: number
// }

// type Doctor = {
//   id: number
//   name: string
//   procedures: Procedure[]
// }

// type Department = {
//   id: number
//   name: string
//   doctors: Doctor[]
// }

// type Patient = {
//   id: number
//   patientId: number
//   name: string
//   guardianName: string
//   gender: string
//   dob: string
//   age: number
//   maritalStatus: string
//   bloodGroup: string
//   phoneNumber: string
//   address: string
//   welfareRecord?: {
//     discountPercentage?: number
//   }
// }

// /* Cart item structure */
// type CartItem = {
//   department: Department
//   doctor: Doctor
//   procedure: Procedure
// }

// /* ------------------ COMPONENT ------------------ */
// const PatientReceiptGenerator = () => {
//   const { id: patientId } = useParams()
//   const API_BASE = import.meta.env.VITE_API_BASE_URL
//   const token = localStorage.getItem('token') || ''

//   const { user } = usePermissions()

//   /* ---------- STATE ---------- */
//   const [departments, setDepartments] = useState<Department[]>([])
//   const [patient, setPatient] = useState<Patient | null>(null)

//   const [selectedDepartment, setSelectedDepartment] =
//     useState<Department | null>(null)
//   const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
//   const [selectedProcedure, setSelectedProcedure] = useState<Procedure | null>(
//     null
//   )

//   const [cart, setCart] = useState<CartItem[]>([])
//   const [discount, setDiscount] = useState<number>(0)
//   const [totalFee, setTotalFee] = useState<number>(0)
//   const [finalFee, setFinalFee] = useState<number>(0)

//   const [error, setError] = useState<string | null>(null)
//   const [success, setSuccess] = useState<string | null>(null)
//   const [loading, setLoading] = useState<boolean>(false)

//   /* ---------- FETCH DEPARTMENTS & TREE ---------- */
//   useEffect(() => {
//     const fetchDepartments = async () => {
//       try {
//         const res = await fetch(
//           `${API_BASE}/api/department-doctor-procedure-tree`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         )
//         if (!res.ok) throw new Error('Failed to fetch departments')
//         const data = await res.json()
//         setDepartments(data.data || [])
//       } catch (err: unknown) {
//         if (err instanceof Error) {
//           setError(err.message || 'Error fetching patient history')
//         } else {
//           setError('An unknown error occurred')
//         }
//       }
//     }
//     fetchDepartments()
//   }, [API_BASE, token])

//   /* ---------- FETCH PATIENT ---------- */
//   useEffect(() => {
//     const fetchPatient = async () => {
//       if (!patientId) return
//       try {
//         const res = await fetch(`${API_BASE}/api/patient/${patientId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         if (!res.ok) throw new Error('Failed to fetch patient')
//         const data = await res.json()
//         setPatient(data.data)
//         setDiscount(data.data?.welfareRecord?.discountPercentage || 0)
//       } catch (err: unknown) {
//         if (err instanceof Error) {
//           setError(err.message || 'Error fetching patient history')
//         } else {
//           setError('An unknown error occurred')
//         }
//       }
//     }
//     fetchPatient()
//   }, [patientId, API_BASE, token])

//   const addToCart = (doctor: Doctor) => {
//     if (!selectedDepartment || !selectedProcedure) return

//     const exists = cart.some(
//       (item) =>
//         item.department.id === selectedDepartment.id &&
//         item.doctor.id === doctor.id &&
//         item.procedure.id === selectedProcedure.id
//     )

//     if (exists) return

//     const updated = [
//       ...cart,
//       {
//         department: selectedDepartment,
//         doctor,
//         procedure: selectedProcedure,
//       },
//     ]

//     setCart(updated)
//     calculateTotals(updated, discount)

//     // ✅ RESET after add
//     setSelectedDoctor(null)
//     setSelectedProcedure(null)
//   }

//   const removeFromCart = (index: number) => {
//     const updated = cart.filter((_, i) => i !== index)
//     setCart(updated)
//     calculateTotals(updated, discount)
//   }

//   const calculateTotals = (items: CartItem[], discountValue: number) => {
//     const total = items.reduce((sum, item) => sum + item.procedure.fee, 0)

//     const safeDiscount = Math.min(discountValue, total) 
//     const final = total - safeDiscount

//     setTotalFee(total)
//     setFinalFee(final)
//   }

//   const handleDiscountChange = (value: string) => {
//     const numericValue = value === '' ? 0 : Number(value)
//     setDiscount(numericValue)
//     calculateTotals(cart, numericValue)
//   }

//   /* ---------- SUBMIT API ---------- */
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!patient || cart.length === 0) {
//       setError('Patient and at least one procedure are required.')
//       return
//     }

//     setLoading(true)
//     setError('')
//     setSuccess('')

//     const payload = {
//       patientId: patient.patientId,
//       discount,
//       totalFee,
//       finalFee,
//       items: cart.map((c) => ({
//         departmentId: c.department.id,
//         doctorId: c.doctor.id,
//         procedureId: c.procedure.id,
//         fee: c.procedure.fee,
//       })),
//       createdByUserId: user?.id,
//     }

//     try {
//       const res = await fetch(`${API_BASE}/api/medical-records`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       })

//       const data = await res.json()

//       if (!data.success) {
//         setError(data.message || 'Failed to create medical record')
//         return
//       }

//       const receiptHTML = ReceiptTemplate({
//         patient,
//         cart,
//         totalFee,
//         finalFee,
//         discount,
//         receiptNo: data.data.receiptNo,
//         tokenNumber: data.data.tokenNumber,
//       })

//       const printWindow = window.open('', '_blank')
//       if (printWindow) {
//         printWindow.document.write(receiptHTML)
//         printWindow.document.close()
//         printWindow.onload = () => printWindow.print()
//       }

//       setSuccess('Medical record printed successfully!')
//       setDepartments([])
//       setDiscount(0)
//       setTotalFee(0)
//       setFinalFee(0)
//       setCart([])
//     } catch (err: unknown) {
//       if (err instanceof Error) {
//         setError(err.message || 'Error saving patient')
//       } else {
//         setError('Server Error')
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   /* ---------- DROPDOWN OPTIONS ---------- */
//   const departmentOptions = departments.map((d) => ({ id: d.id, name: d.name }))
//   const doctorOptions =
//     selectedDepartment && selectedProcedure
//       ? selectedDepartment.doctors
//           .filter((doc) =>
//             doc.procedures.some((p) => p.id === selectedProcedure.id)
//           )
//           .map((doc) => ({
//             id: doc.id,
//             name: doc.name,
//           }))
//       : []

//   const procedureOptions = selectedDepartment
//     ? Array.from(
//         new Map(
//           selectedDepartment.doctors
//             .flatMap((doc) => doc.procedures)
//             .map((proc) => [proc.id, proc])
//         ).values()
//       ).map((p) => ({
//         id: p.id,
//         name: `${p.name} (${p.fee})`,
//         fee: p.fee,
//       }))
//     : []

//   return (
//     <form onSubmit={handleSubmit} className="p-4">
//       <h2 className="text-xl font-semibold mb-4">Patient Receipt Generator</h2>
//       {error && <p className="text-red mb-2">{error}</p>}
//       {success && <SuccessMessage msg={success} />}

//       {patient && (
//         <div className="grid min-[1440px]:grid-cols-3 max-w-[1000px] gap-x-3 gap-y-4 mt-6">
//           {/* Basic Info */}
//           <div className="flex items-center gap-3 col-span-full">
//             <p className="text-3xl font-semibold whitespace-nowrap">
//               Basic Information
//             </p>
//             <div className="h-[3px] rounded-full w-full bg-gray"></div>
//           </div>
//           <div className="border border-gray rounded-xl col-span-full p-5 grid grid-cols-3 gap-5">
//             <p>Full Name: {patient.name}</p>
//             <p>Guardian: {patient.guardianName}</p>
//             <p>Gender: {patient.gender}</p>
//             <p>DOB: {patient.dob || 'N/A'}</p>
//             <p>Age: {patient.age}</p>
//             <p>Phone: {patient.phoneNumber}</p>
//             <p>Address: {patient.address}</p>
//           </div>

//           {/* Department Dropdown */}
//           <Dropdown
//             options={departmentOptions}
//             selected={
//               selectedDepartment
//                 ? { id: selectedDepartment.id, name: selectedDepartment.name }
//                 : null
//             }
//             onSelect={(opt) => {
//               const dep = departments.find((d) => d.id === opt.id)
//               if (dep) {
//                 setSelectedDepartment(dep)
//                 setSelectedDoctor(null)
//               }
//             }}
//             placeholder="Select Department"
//           />
//           <Dropdown
//             options={procedureOptions}
//             selected={
//               selectedProcedure
//                 ? { id: selectedProcedure.id, name: selectedProcedure.name }
//                 : null
//             }
//             onSelect={(opt) => {
//               const proc = procedureOptions.find((p) => p.id === opt.id)
//               if (proc) {
//                 setSelectedProcedure(proc)
//                 setSelectedDoctor(null)
//               }
//             }}
//             placeholder="Select Procedure"
//           />

//           <Dropdown
//             options={doctorOptions}
//             selected={
//               selectedDoctor
//                 ? { id: selectedDoctor.id, name: selectedDoctor.name }
//                 : null
//             }
//             onSelect={(opt) => {
//               const doc = selectedDepartment?.doctors.find(
//                 (d) => d.id === opt.id
//               )
//               if (!doc || !selectedProcedure) return
//               setSelectedDoctor(doc)
//               addToCart(doc)
//             }}
//             placeholder="Select Doctor"
//           />

//           {/* Discount */}
//           <div className="mt-2 col-span-full ">
//             <GroupInput className="max-w-80">
//               <Label>Discount Amount</Label>
//               <Input
//                 type="number"
//                 min={0}
//                 value={discount}
//                 onChange={(e) => handleDiscountChange(e.target.value)}
//                 placeholder="Enter discount amount"
//               />
//             </GroupInput>
//           </div>

//           {/* Cart Summary */}
//           <div className="mt-2 p-3 rounded col-span-full">
//             {cart.map((item, index) => (
//               <div
//                 key={index}
//                 className="flex justify-between mb-1 border-b border-gray pb-2"
//               >
//                 <div className="flex items-center gap-5">
//                   <Button
//                     type="button"
//                     onClick={() => removeFromCart(index)}
//                     className="!rounded-full !px-[5px] !py-0"
//                   >
//                     ✕
//                   </Button>
//                   <span>
//                     {item.department.name} → {item.doctor.name} →{' '}
//                     {item.procedure.name}
//                   </span>
//                 </div>
//                 <span>{item.procedure.fee}</span>
//               </div>
//             ))}
//           </div>

//           <div className="mt-2 text-right col-span-full">
//             <p>Total Fee: {totalFee}</p>
//             <p>Discount Rs : {discount}</p>
//             <p className="font-bold">Final Fee: {finalFee}</p>
//           </div>

//           <Button type="submit" className="mt-4 col-span-full w-fit mx-auto">
//             {loading ? 'loading...' : 'Generate Receipt'}
//           </Button>
//         </div>
//       )}
//     </form>
//   )
// }

// export default PatientReceiptGenerator

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Button from '../../components/button/Button'
import { Input } from '../../components/input/Input'
import { Label } from '../../components/input/Label'
import Dropdown from '../../components/input/Dropdown'
import ReceiptTemplate from './ReceiptTemplate'
import SuccessMessage from '../../components/error-handling/SuccessMessage'
import { usePermissions } from '../../context/PermissionsContext'
import { GroupInput } from '../../components/input/GroupInput'

/* ------------------ TYPES ------------------ */
type Procedure = {
  id: number
  name: string
  fee: number
}

type Doctor = {
  id: number
  name: string
  procedures: Procedure[]
}

type Department = {
  id: number
  name: string
  doctors: Doctor[]
}

type Patient = {
  id: number
  patientId: number
  name: string
  guardianName: string
  gender: string
  dob: string
  age: number
  maritalStatus: string
  bloodGroup: string
  phoneNumber: string
  address: string
  welfareRecord?: {
    discountPercentage?: number
  }
}

/* ------------------ COMPONENT ------------------ */
const PatientReceiptGenerator = () => {
  const { id: patientId } = useParams()
  const API_BASE = import.meta.env.VITE_API_BASE_URL
  const token = localStorage.getItem('token') || ''

  const { user } = usePermissions()

  /* ---------- STATE ---------- */
  const [departments, setDepartments] = useState<Department[]>([])
  const [patient, setPatient] = useState<Patient | null>(null)

  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null)
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [selectedProcedure, setSelectedProcedure] = useState<Procedure | null>(
    null
  )

  const [discount, setDiscount] = useState<number>(0)
  const [totalFee, setTotalFee] = useState<number>(0)
  const [finalFee, setFinalFee] = useState<number>(0)

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  /* ---------- FETCH DEPARTMENTS & TREE ---------- */
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/other-department-doctor-procedure-tree`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        if (!res.ok) throw new Error('Failed to fetch departments')
        const data = await res.json()
        setDepartments(data.data || [])
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message)
        else setError('An unknown error occurred')
      }
    }
    fetchDepartments()
  }, [API_BASE, token])

  /* ---------- FETCH PATIENT ---------- */
  useEffect(() => {
    const fetchPatient = async () => {
      if (!patientId) return
      try {
        const res = await fetch(`${API_BASE}/api/patient/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error('Failed to fetch patient')
        const data = await res.json()
        setPatient(data.data)
        setDiscount(data.data?.welfareRecord?.discountPercentage || 0)
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message)
        else setError('An unknown error occurred')
      }
    }
    fetchPatient()
  }, [patientId, API_BASE, token])

  /* ---------- CALCULATE TOTAL ---------- */
  useEffect(() => {
    if (selectedProcedure) {
      const total = selectedProcedure.fee
      const safeDiscount = Math.min(discount, total)
      setTotalFee(total)
      setFinalFee(total - safeDiscount)
    } else {
      setTotalFee(0)
      setFinalFee(0)
    }
  }, [selectedProcedure, discount])

  const handleDiscountChange = (value: string) => {
    const numericValue = value === '' ? 0 : Number(value)
    setDiscount(numericValue)
  }

  /* ---------- SUBMIT API ---------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!patient || !selectedDepartment || !selectedDoctor || !selectedProcedure) {
      setError('Please select department, doctor, and procedure.')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    const payload = {
      patientId: patient.patientId,
      discount,
      totalFee,
      finalFee,
      items: [
        {
          departmentId: selectedDepartment.id,
          doctorId: selectedDoctor.id,
          procedureId: selectedProcedure.id,
          fee: selectedProcedure.fee,
        },
      ],
      createdByUserId: user?.id,
    }

    try {
      const res = await fetch(`${API_BASE}/api/medical-records`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!data.success) {
        setError(data.message || 'Failed to create medical record')
        return
      }

      const receiptHTML = ReceiptTemplate({
        patient,
        cart: [
          {
            department: selectedDepartment,
            doctor: selectedDoctor,
            procedure: selectedProcedure,
          },
        ],
        totalFee,
        finalFee,
        discount,
        receiptNo: data.data.receiptNo,
        tokenNumber: data.data.tokenNumber,
      })

      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(receiptHTML)
        printWindow.document.close()
        printWindow.onload = () => printWindow.print()
      }

      setSuccess('Medical record printed successfully!')

      // reset selections
      setSelectedDepartment(null)
      setSelectedDoctor(null)
      setSelectedProcedure(null)
      setDiscount(0)
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message)
      else setError('Server Error')
    } finally {
      setLoading(false)
    }
  }

  /* ---------- DROPDOWN OPTIONS ---------- */
  const departmentOptions = departments.map((d) => ({ id: d.id, name: d.name }))

  const procedureOptions = selectedDepartment
    ? Array.from(
        new Map(
          selectedDepartment.doctors
            .flatMap((doc) => doc.procedures)
            .map((proc) => [proc.id, proc])
        ).values()
      ).map((p) => ({
        id: p.id,
        name: `${p.name} (${p.fee})`,
        fee: p.fee,
      }))
    : []

  const doctorOptions =
    selectedDepartment && selectedProcedure
      ? selectedDepartment.doctors
          .filter((doc) =>
            doc.procedures.some((p) => p.id === selectedProcedure.id)
          )
          .map((doc) => ({ id: doc.id, name: doc.name }))
      : []

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h2 className="text-xl font-semibold mb-4">Patient Receipt Generator</h2>
      {error && <p className="text-red mb-2">{error}</p>}
      {success && <SuccessMessage msg={success} />}

      {patient && (
        <div className="grid min-[1440px]:grid-cols-3 max-w-[1000px] gap-x-3 gap-y-4 mt-6">
          {/* Basic Info */}
          <div className="flex items-center gap-3 col-span-full">
            <p className="text-3xl font-semibold whitespace-nowrap">
              Basic Information
            </p>
            <div className="h-[3px] rounded-full w-full bg-gray"></div>
          </div>
          <div className="border border-gray rounded-xl col-span-full p-5 grid grid-cols-3 gap-5">
            <p>Full Name: {patient.name}</p>
            <p>Guardian: {patient.guardianName}</p>
            <p>Gender: {patient.gender}</p>
            <p>DOB: {patient.dob || 'N/A'}</p>
            <p>Age: {patient.age}</p>
            <p>Phone: {patient.phoneNumber}</p>
            <p>Address: {patient.address}</p>
          </div>

          {/* Dropdowns */}
          <Dropdown
            options={departmentOptions}
            selected={
              selectedDepartment
                ? { id: selectedDepartment.id, name: selectedDepartment.name }
                : null
            }
            onSelect={(opt) => {
              const dep = departments.find((d) => d.id === opt.id)
              if (dep) {
                setSelectedDepartment(dep)
                setSelectedDoctor(null)
                setSelectedProcedure(null)
              }
            }}
            placeholder="Select Department"
          />

          <Dropdown
            options={procedureOptions}
            selected={
              selectedProcedure
                ? { id: selectedProcedure.id, name: selectedProcedure.name }
                : null
            }
            onSelect={(opt) => {
              const proc = procedureOptions.find((p) => p.id === opt.id)
              if (proc) {
                setSelectedProcedure(proc)
                setSelectedDoctor(null)
              }
            }}
            placeholder="Select Procedure"
          />

          <Dropdown
            options={doctorOptions}
            selected={
              selectedDoctor
                ? { id: selectedDoctor.id, name: selectedDoctor.name }
                : null
            }
            onSelect={(opt) => {
              const doc = selectedDepartment?.doctors.find(
                (d) => d.id === opt.id
              )
              if (doc) setSelectedDoctor(doc)
            }}
            placeholder="Select Doctor"
          />

          {/* Discount */}
          <div className="mt-2 col-span-full ">
            <GroupInput className="max-w-80">
              <Label>Discount Amount</Label>
              <Input
                type="number"
                min={0}
                value={discount}
                onChange={(e) => handleDiscountChange(e.target.value)}
                placeholder="Enter discount amount"
              />
            </GroupInput>
          </div>

          {/* Selected Summary */}
          {selectedDepartment && selectedDoctor && selectedProcedure && (
            <div className="mt-2 p-3 rounded col-span-full border border-gray">
              <div className="flex justify-between">
                <span>
                  {selectedDepartment.name} → {selectedDoctor.name} →{' '}
                  {selectedProcedure.name}
                </span>
                <span>{selectedProcedure.fee}</span>
              </div>
            </div>
          )}

          <div className="mt-2 text-right col-span-full">
            <p>Total Fee: {totalFee}</p>
            <p>Discount Rs: {discount}</p>
            <p className="font-bold">Final Fee: {finalFee}</p>
          </div>

          <Button type="submit" className="mt-4 col-span-full w-fit mx-auto">
            {loading ? 'loading...' : 'Generate Receipt'}
          </Button>
        </div>
      )}
    </form>
  )
}

export default PatientReceiptGenerator
