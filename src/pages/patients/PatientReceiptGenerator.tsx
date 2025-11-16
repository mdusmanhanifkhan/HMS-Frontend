import { useEffect, useState } from 'react'
import Button from '../../components/button/Button'
import { GroupInput } from '../../components/input/GroupInput'
import { Input } from '../../components/input/Input'
import { Label } from '../../components/input/Label'
import Dropdown from '../../components/input/Dropdown'
import { useParams } from 'react-router-dom'
import ReceiptTemplate from './ReceiptTemplate'

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
const PatientReceiptGenerator = () => {
  const { id: patientId } = useParams()
  const API_BASE = import.meta.env.VITE_API_BASE_URL
    const token = localStorage.getItem('token')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [departments, setDepartments] = useState<Department[]>([])
  const [showPatientInfo, setShowPatientInfo] = useState(false)

  const [form, setForm] = useState<any>({
    name: '',
    guardianName: '',
    gender: '',
    dob: '',
    age: '',
    maritalStatus: '',
    bloodGroup: '',
    phoneNumber: '',
    cnic: '',
    address: '',
    welfareRecord: null,
    department: null as Department | null,
    doctor: null as Doctor | null,
    procedure: null as Procedure | null,
    discountPercentage: 0, // editable discount
    fees: '',
  })

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(
          `${API_BASE}/api/department-doctor-procedure-tree` ,{
            headers:{
                 Authorization: `Bearer ${token}`,
            }
          }
        )
        if (!res.ok) throw new Error('Failed to fetch departments')
        const data = await res.json()
        setDepartments(data.data || [])
      } catch (err: any) {
        setError(err.message || 'Error fetching departments')
      } finally {
        setLoading(false)
      }
    }

    fetchDepartments()
  }, [])

  // Fetch patient info
  useEffect(() => {
    const fetchPatient = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(
          `${API_BASE}/api/patient/${patientId}` , {
            headers:{
                 Authorization: `Bearer ${token}`,
            }
          }
        )
        if (!res.ok) throw new Error('Failed to fetch patient')

        const data = await res.json()
        if (!data?.data) {
          setError('No patient found with this ID')
          setShowPatientInfo(false)
        } else {
          setForm((prev: any) => ({
            ...prev,
            ...data.data,
            discountPercentage:
              data.data?.welfareRecord?.discountPercentage || 0,
          }))
          setShowPatientInfo(true)
        }
      } catch (err: any) {
        setError(err.message || 'Error fetching patient')
      } finally {
        setLoading(false)
      }
    }

    if (patientId) fetchPatient()
  }, [patientId])

  // Handlers
  const handleDepartmentSelect = (dep: Department) => {
    setForm((prev: any) => ({
      ...prev,
      department: dep,
      doctor: null,
      procedure: null,
      fees: '',
    }))
  }

  const handleDoctorSelect = (doc: Doctor) => {
    setForm((prev: any) => ({
      ...prev,
      doctor: doc,
      procedure: null,
      fees: '',
    }))
  }

  const handleProcedureSelect = (proc: Procedure) => {
    calculateFee(proc.fee, form.discountPercentage)
    setForm((prev: any) => ({
      ...prev,
      procedure: proc,
    }))
  }

  const handleDiscountChange = (value: number) => {
    setForm((prev: any) => ({
      ...prev,
      discountPercentage: value,
    }))
    // Recalculate fee
    if (form.procedure) calculateFee(form.procedure.fee, value)
  }

  const calculateFee = (originalFee: number, discount: number) => {
    const discountedFee = originalFee - (originalFee * discount) / 100
    setForm((prev: any) => ({
      ...prev,
      fees: discountedFee.toFixed(2),
    }))
  }

  // Generate receipt
 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  if (!form.department || !form.doctor || !form.procedure) {
    alert('Please select department, doctor, and procedure.')
    return
  }

  const receiptHTML = ReceiptTemplate({ patient: form })
  const originalContent = document.body.innerHTML

  // Replace page content with receipt
  document.body.innerHTML = receiptHTML

  // Trigger print
  window.print()

  // Restore original content after printing
  document.body.innerHTML = originalContent
}


  return (
    <form onSubmit={handleSubmit}>
      <p className="text-xl font-semibold underline">Patient Receipt</p>

      {error && <p className="text-red-500 mt-3">{error}</p>}

      {showPatientInfo && (
        <>
          <div className="grid min-[1440px]:grid-cols-3 max-w-[1000px] gap-x-3 gap-y-4 mt-6">
            {/* Basic Info */}
            <div className="flex items-center gap-3 col-span-full">
              <p className="text-3xl font-semibold whitespace-nowrap">
                Basic Information
              </p>
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
              <p className="text-3xl font-semibold whitespace-nowrap">
                Doctor Information
              </p>
              <div className="h-[3px] rounded-full w-full bg-gray"></div>
            </div>
            <div className="border border-gray rounded-xl col-span-full p-5 grid grid-cols-3 gap-5">
              <GroupInput>
                <Label>Department</Label>
                <Dropdown
                  options={departments}
                  selected={form.department}
                  onSelect={handleDepartmentSelect}
                  placeholder="Select Department"
                />
              </GroupInput>
              <GroupInput>
                <Label>Doctor</Label>
                <Dropdown
                  options={form.department ? form.department.doctors : []}
                  selected={form.doctor}
                  onSelect={handleDoctorSelect}
                  placeholder="Select Doctor"
                />
              </GroupInput>
              <GroupInput>
                <Label>Procedure</Label>
                <Dropdown
                  options={form.doctor ? form.doctor.procedures : []}
                  selected={form.procedure}
                  onSelect={handleProcedureSelect}
                  placeholder="Select Procedure"
                />
              </GroupInput>
              {/* <GroupInput>
                <Label>Discount (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  value={form.discountPercentage || 0}
                  onChange={(e) => handleDiscountChange(Number(e.target.value))}
                />
              </GroupInput>
              <GroupInput> */}
              <GroupInput>
                <Label>Discount (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  min={0}
                  max={100}
                  value={form.discountPercentage || ''}
                  placeholder="0"
                  onChange={(e) => {
                    const value = Number(e.target.value)
                    const validValue = isNaN(value)
                      ? 0
                      : Math.min(Math.max(value, 0), 100)
                    handleDiscountChange(validValue)
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
        </>
      )}
    </form>
  )
}

export default PatientReceiptGenerator
