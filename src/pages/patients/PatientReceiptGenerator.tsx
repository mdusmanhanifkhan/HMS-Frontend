// import { useEffect, useState } from 'react'
// import Button from '../../components/button/Button'
// import { GroupInput } from '../../components/input/GroupInput'
// import { Input } from '../../components/input/Input'
// import { Label } from '../../components/input/Label'
// import Dropdown from '../../components/input/Dropdown'
// import { useParams } from 'react-router-dom'
// import ReceiptTemplate from './ReceiptTemplate'

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
// const PatientReceiptGenerator = () => {
//   const { id: patientId } = useParams()
//   const API_BASE = import.meta.env.VITE_API_BASE_URL
//     const token = localStorage.getItem('token')

//   const [error, setError] = useState<string | null>(null)
//   const [departments, setDepartments] = useState<Department[]>([])
//   const [showPatientInfo, setShowPatientInfo] = useState(false)

//   const [form, setForm] = useState<any>({
//     name: '',
//     guardianName: '',
//     gender: '',
//     dob: '',
//     age: '',
//     maritalStatus: '',
//     bloodGroup: '',
//     phoneNumber: '',
//     cnic: '',
//     address: '',
//     welfareRecord: null,
//     department: null as Department | null,
//     doctor: null as Doctor | null,
//     procedure: null as Procedure | null,
//     discountPercentage: 0, // editable discount
//     fees: '',
//   })

//   // Fetch departments
//   useEffect(() => {
//     const fetchDepartments = async () => {
     
//       setError(null)
//       try {
//         const res = await fetch(
//           `${API_BASE}/api/department-doctor-procedure-tree` ,{
//             headers:{
//                  Authorization: `Bearer ${token}`,
//             }
//           }
//         )
//         if (!res.ok) throw new Error('Failed to fetch departments')
//         const data = await res.json()
//         setDepartments(data.data || [])
//       } catch (err: any) {
//         setError(err.message || 'Error fetching departments')
//       } 
//     }

//     fetchDepartments()
//   }, [])

//   // Fetch patient info
//   useEffect(() => {
//     const fetchPatient = async () => {
    
//       setError(null)
//       try {
//         const res = await fetch(
//           `${API_BASE}/api/patient/${patientId}` , {
//             headers:{
//                  Authorization: `Bearer ${token}`,
//             }
//           }
//         )
//         if (!res.ok) throw new Error('Failed to fetch patient')

//         const data = await res.json()
//         if (!data?.data) {
//           setError('No patient found with this ID')
//           setShowPatientInfo(false)
//         } else {
//           setForm((prev: any) => ({
//             ...prev,
//             ...data.data,
//             discountPercentage:
//               data.data?.welfareRecord?.discountPercentage || 0,
//           }))
//           setShowPatientInfo(true)
//         }
//       } catch (err: any) {
//         setError(err.message || 'Error fetching patient')
//       } 
//     }

//     if (patientId) fetchPatient()
//   }, [patientId])

//   // Handlers
//   const handleDepartmentSelect = (dep: Department) => {
//     setForm((prev: any) => ({
//       ...prev,
//       department: dep,
//       doctor: null,
//       procedure: null,
//       fees: '',
//     }))
//   }

//   const handleDoctorSelect = (doc: Doctor) => {
//     setForm((prev: any) => ({
//       ...prev,
//       doctor: doc,
//       procedure: null,
//       fees: '',
//     }))
//   }

//   const handleProcedureSelect = (proc: Procedure) => {
//     calculateFee(proc.fee, form.discountPercentage)
//     setForm((prev: any) => ({
//       ...prev,
//       procedure: proc,
//     }))
//   }

//   const handleDiscountChange = (value: number) => {
//     setForm((prev: any) => ({
//       ...prev,
//       discountPercentage: value,
//     }))
//     // Recalculate fee
//     if (form.procedure) calculateFee(form.procedure.fee, value)
//   }

//   const calculateFee = (originalFee: number, discount: number) => {
//     const discountedFee = originalFee - (originalFee * discount) / 100
//     setForm((prev: any) => ({
//       ...prev,
//       fees: discountedFee.toFixed(2),
//     }))
//   }

//   // Generate receipt
//  const handleSubmit = (e: React.FormEvent) => {
//   e.preventDefault()
//   if (!form.department || !form.doctor || !form.procedure) {
//     alert('Please select department, doctor, and procedure.')
//     return
//   }

//   const receiptHTML = ReceiptTemplate({ patient: form })
//   const originalContent = document.body.innerHTML

//   // Replace page content with receipt
//   document.body.innerHTML = receiptHTML

//   // Trigger print
//   window.print()

//   // Restore original content after printing
//   document.body.innerHTML = originalContent
// }


//   return (
//     <form onSubmit={handleSubmit}>
//       <p className="text-xl font-semibold underline">Patient Receipt</p>

//       {error && <p className="text-red-500 mt-3">{error}</p>}

//       {showPatientInfo && (
//         <>
//           <div className="grid min-[1440px]:grid-cols-3 max-w-[1000px] gap-x-3 gap-y-4 mt-6">
//             {/* Basic Info */}
//             <div className="flex items-center gap-3 col-span-full">
//               <p className="text-3xl font-semibold whitespace-nowrap">
//                 Basic Information
//               </p>
//               <div className="h-[3px] rounded-full w-full bg-gray"></div>
//             </div>
//             <div className="border border-gray rounded-xl col-span-full p-5 grid grid-cols-3 gap-5">
//               <p>Full Name: {form.name}</p>
//               <p>Guardian: {form.guardianName}</p>
//               <p>Gender: {form.gender}</p>
//               <p>DOB: {form.dob || 'N/A'}</p>
//               <p>Age: {form.age}</p>
//               <p>Phone: {form.phoneNumber}</p>
//               <p>Address: {form.address}</p>
//             </div>

//             {/* Doctor Info */}
//             <div className="flex items-center gap-3 col-span-full">
//               <p className="text-3xl font-semibold whitespace-nowrap">
//                 Doctor Information
//               </p>
//               <div className="h-[3px] rounded-full w-full bg-gray"></div>
//             </div>
//             <div className="border border-gray rounded-xl col-span-full p-5 grid grid-cols-3 gap-5">
//               <GroupInput>
//                 <Label>Department</Label>
//                 <Dropdown
//                   options={departments}
//                   selected={form.department}
//                   onSelect={handleDepartmentSelect}
//                   placeholder="Select Department"
//                 />
//               </GroupInput>
//               <GroupInput>
//                 <Label>Doctor</Label>
//                 <Dropdown
//                   options={form.department ? form.department.doctors : []}
//                   selected={form.doctor}
//                   onSelect={handleDoctorSelect}
//                   placeholder="Select Doctor"
//                 />
//               </GroupInput>
//               <GroupInput>
//                 <Label>Procedure</Label>
//                 <Dropdown
//                   options={form.doctor ? form.doctor.procedures : []}
//                   selected={form.procedure}
//                   onSelect={handleProcedureSelect}
//                   placeholder="Select Procedure"
//                 />
//               </GroupInput>
//               {/* <GroupInput>
//                 <Label>Discount (%)</Label>
//                 <Input
//                   id="discount"
//                   type="number"
//                   value={form.discountPercentage || 0}
//                   onChange={(e) => handleDiscountChange(Number(e.target.value))}
//                 />
//               </GroupInput>
//               <GroupInput> */}
//               <GroupInput>
//                 <Label>Discount (%)</Label>
//                 <Input
//                   id="discount"
//                   type="number"
//                   min={0}
//                   max={100}
//                   value={form.discountPercentage || ''}
//                   placeholder="0"
//                   onChange={(e) => {
//                     const value = Number(e.target.value)
//                     const validValue = isNaN(value)
//                       ? 0
//                       : Math.min(Math.max(value, 0), 100)
//                     handleDiscountChange(validValue)
//                   }}
//                 />
//               </GroupInput>
//             </div>

//             {/* Fees */}
//             <div className="flex justify-end w-full col-span-full">
//               <div className="flex flex-col items-end">
//                 <div className="flex gap-2">
//                   <Label>Original Fee:</Label>
//                   <p>{form.procedure?.fee || 0}</p>
//                 </div>
//                 <div className="flex gap-2">
//                   <Label>Discount:</Label>
//                   <p>{form.discountPercentage || 0}%</p>
//                 </div>
//                 <div className="flex gap-2 font-semibold">
//                   <Label>Final Fee:</Label>
//                   <p>{form.fees || 0}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Submit */}
//             <div className="col-span-full mx-auto">
//               <Button type="submit">Generate Receipt</Button>
//             </div>
//           </div>
//         </>
//       )}
//     </form>
//   )
// }

// export default PatientReceiptGenerator

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../../components/button/Button';
import { GroupInput } from '../../components/input/GroupInput';
import { Input } from '../../components/input/Input';
import { Label } from '../../components/input/Label';
import Dropdown from '../../components/input/Dropdown';
import ReceiptTemplate from './ReceiptTemplate';

// Types
type Procedure = {
  id: number;
  name: string;
  fee: number;
};

type Doctor = {
  id: number;
  name: string;
  procedures: Procedure[];
};

type Department = {
  id: number;
  name: string;
  doctors: Doctor[];
};

type WelfareRecord = {
  discountPercentage?: number;
};

type FormState = {
  id: number;
  name: string;
  guardianName: string;
  gender: string;
  dob: string;
  age: number | string;
  maritalStatus: string;
  bloodGroup: string;
  phoneNumber: string;
  cnic: string;
  address: string;
  welfareRecord?: WelfareRecord;
  department?: Department;
  doctor?: Doctor;
  procedure?: Procedure;
  discountPercentage: number;
  fees: string;
};

const PatientReceiptGenerator = () => {
  const { id: patientId } = useParams();
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem('token') || '';

  const [error, setError] = useState<string | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [showPatientInfo, setShowPatientInfo] = useState(false);

  const [form, setForm] = useState<FormState>({
    id: 0,
    name: '',
    guardianName: '',
    gender: '',
    dob: '',
    age: 0,
    maritalStatus: '',
    bloodGroup: '',
    phoneNumber: '',
    cnic: '',
    address: '',
    welfareRecord: undefined,
    department: undefined,
    doctor: undefined,
    procedure: undefined,
    discountPercentage: 0,
    fees: '',
  });

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/api/department-doctor-procedure-tree`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch departments');
        const data = await res.json();
        setDepartments(data.data || []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Error fetching departments');
      }
    };
    fetchDepartments();
  }, [API_BASE, token]);

  // Fetch patient info
  useEffect(() => {
    const fetchPatient = async () => {
      if (!patientId) return;
      try {
        const res = await fetch(`${API_BASE}/api/patient/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch patient');
        const data = await res.json();

        if (!data?.data) {
          setError('No patient found with this ID');
          setShowPatientInfo(false);
        } else {
          setForm({
            id: Number(data.data.id),
            name: data.data.name || '',
            guardianName: data.data.guardianName || '',
            gender: data.data.gender || '',
            dob: data.data.dob || '',
            age: data.data.age ?? 0,
            maritalStatus: data.data.maritalStatus || '',
            bloodGroup: data.data.bloodGroup || '',
            phoneNumber: data.data.phoneNumber || '',
            cnic: data.data.cnic || '',
            address: data.data.address || '',
            welfareRecord: data.data.welfareRecord ?? undefined,
            department: undefined,
            doctor: undefined,
            procedure: undefined,
            discountPercentage: data.data?.welfareRecord?.discountPercentage ?? 0,
            fees: '',
          });
          setShowPatientInfo(true);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Error fetching patient');
      }
    };
    fetchPatient();
  }, [patientId, API_BASE, token]);

  // Handlers
  const handleDepartmentSelect = (dep: Department) => {
    setForm((prev) => ({
      ...prev,
      department: dep,
      doctor: undefined,
      procedure: undefined,
      fees: '',
    }));
  };

  const handleDoctorSelect = (doc: Doctor) => {
    setForm((prev) => ({
      ...prev,
      doctor: doc,
      procedure: undefined,
      fees: '',
    }));
  };

  const handleProcedureSelect = (proc: Procedure) => {
    calculateFee(proc.fee, form.discountPercentage);
    setForm((prev) => ({ ...prev, procedure: proc }));
  };

  const handleDiscountChange = (value: number) => {
    setForm((prev) => ({ ...prev, discountPercentage: value }));
    if (form.procedure) calculateFee(form.procedure.fee, value);
  };

  const calculateFee = (originalFee: number, discount: number) => {
    const discountedFee = originalFee - (originalFee * discount) / 100;
    setForm((prev) => ({ ...prev, fees: discountedFee.toFixed(2) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.department || !form.doctor || !form.procedure) {
      alert('Please select department, doctor, and procedure.');
      return;
    }

    const patientData = {
      ...form,
      procedure: form.procedure!,
      welfareRecord: form.welfareRecord ?? undefined,
      age: form.age ?? 0,
    };

    const receiptHTML = ReceiptTemplate({ patient: patientData });
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = receiptHTML;
    window.print();
    document.body.innerHTML = originalContent;
  };
  

  // Dropdown options
  const departmentOptions = departments.map((dep) => ({ id: dep.id, name: dep.name }));
  const doctorOptions =
    form.department?.doctors.map((doc) => ({ id: doc.id, name: doc.name })) || [];
  const procedureOptions =
    form.doctor?.procedures.map((proc) => ({ id: proc.id, name: proc.name })) || [];

  return (
    <form onSubmit={handleSubmit}>
      <p className="text-xl font-semibold underline">Patient Receipt</p>
      {error && <p className="text-red-500 mt-3">{error}</p>}

      {showPatientInfo && (
        <div className="grid min-[1440px]:grid-cols-3 max-w-[1000px] gap-x-3 gap-y-4 mt-6">
          {/* Basic Info */}
          <div className="flex items-center gap-3 col-span-full">
            <p className="text-3xl font-semibold whitespace-nowrap">Basic Information</p>
            <div className="h-[3px] rounded-full w-full bg-gray"></div>
          </div>
          <div className="border border-gray rounded-xl col-span-full p-5 grid grid-cols-3 gap-5">
            <p>Full Name: {form.name}</p>
            <p>Guardian: {form.guardianName}</p>
            <p>Gender: {form.gender}</p>
            <p>DOB: {form.dob || 'N/A'}</p>
            <p>Age: {form.age}</p>
            <p>Phone: {form.phoneNumber}</p>
            <p>Address: {form.address}</p>
          </div>

          {/* Doctor Info */}
          <div className="flex items-center gap-3 col-span-full">
            <p className="text-3xl font-semibold whitespace-nowrap">Doctor Information</p>
            <div className="h-[3px] rounded-full w-full bg-gray"></div>
          </div>
          <div className="border border-gray rounded-xl col-span-full p-5 grid grid-cols-3 gap-5">
            <GroupInput>
              <Label>Department</Label>
              <Dropdown
                options={departmentOptions}
                selected={
                  form.department
                    ? { id: form.department.id, name: form.department.name }
                    : null
                }
                onSelect={(option) => {
                  const dep = departments.find((d) => d.id === option.id);
                  if (dep) handleDepartmentSelect(dep);
                }}
                placeholder="Select Department"
              />
            </GroupInput>

            <GroupInput>
              <Label>Doctor</Label>
              <Dropdown
                options={doctorOptions}
                selected={
                  form.doctor ? { id: form.doctor.id, name: form.doctor.name } : null
                }
                onSelect={(option) => {
                  const doc = form.department?.doctors.find((d) => d.id === option.id);
                  if (doc) handleDoctorSelect(doc);
                }}
                placeholder="Select Doctor"
              />
            </GroupInput>

            <GroupInput>
              <Label>Procedure</Label>
              <Dropdown
                options={procedureOptions}
                selected={
                  form.procedure ? { id: form.procedure.id, name: form.procedure.name } : null
                }
                onSelect={(option) => {
                  const proc = form.doctor?.procedures.find((p) => p.id === option.id);
                  if (proc) handleProcedureSelect(proc);
                }}
                placeholder="Select Procedure"
              />
            </GroupInput>

            <GroupInput>
              <Label>Discount (%)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={form.discountPercentage || ''}
                placeholder="0"
                onChange={(e) => {
                  const value = Number(e.target.value);
                  handleDiscountChange(isNaN(value) ? 0 : Math.min(Math.max(value, 0), 100));
                }}
              />
            </GroupInput>
          </div>

          {/* Fees */}
          <div className="flex justify-end w-full col-span-full">
            <div className="flex flex-col items-end">
              <div className="flex gap-2">
                <Label>Original Fee:</Label>
                <p>{form.procedure?.fee || 0}</p>
              </div>
              <div className="flex gap-2">
                <Label>Discount:</Label>
                <p>{form.discountPercentage || 0}%</p>
              </div>
              <div className="flex gap-2 font-semibold">
                <Label>Final Fee:</Label>
                <p>{form.fees || 0}</p>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="col-span-full mx-auto">
            <Button type="submit">Generate Receipt</Button>
          </div>
        </div>
      )}
    </form>
  );
};

export default PatientReceiptGenerator;
