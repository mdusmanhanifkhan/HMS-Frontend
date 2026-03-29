import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Button from '../../components/button/Button'
import { Input } from '../../components/input/Input'
import { Label } from '../../components/input/Label'
import Dropdown from '../../components/input/Dropdown'
import ReceiptTemplate from '../patients/ReceiptTemplate'
import SuccessMessage from '../../components/error-handling/SuccessMessage'
import { usePermissions } from '../../context/PermissionsContext'
import { GroupInput } from '../../components/input/GroupInput'
// import { getDailyToken } from '../../utils/dailyToken'

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

/* Cart item structure */
type CartItem = {
  department: Department
  doctor: Doctor
  procedure: Procedure
}

/* ------------------ COMPONENT ------------------ */
const PatientReceiptGenerator = () => {
  const { id: patientId } = useParams()
  // const tokenNo = getDailyToken()
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

  const [cart, setCart] = useState<CartItem[]>([])
  const [discount, setDiscount] = useState<number>(0)
  const [totalFee, setTotalFee] = useState<number>(0)
  const [finalFee, setFinalFee] = useState<number>(0)
  const [searchPatientId, setSearchPatientId] = useState<string | null>(null)

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [discountError, setDiscountError] = useState<string | null>(null)

  /* ---------- FETCH DEPARTMENTS & TREE ---------- */
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/other-department-doctor-procedure-tree`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : '',
            },
          }
        )

        const result = await res.json()

        if (!res.ok) {
          setError(result?.message || 'Unauthorized')
          return
        }

        setDepartments(result.data || [])
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('An unknown error occurred')
        }
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
        if (err instanceof Error) {
          setError(err.message || 'Error fetching patient history')
        } else {
          setError('An unknown error occurred')
        }
      }
    }
    fetchPatient()
  }, [patientId, API_BASE, token])

  const handleSearchPatientId = async () => {
    // const fetchPatient = async () => {
    if (!searchPatientId) return
    try {
      const res = await fetch(`${API_BASE}/api/patient/${searchPatientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await res.json()

      if (!res.ok || data.status === 404) {
        setError(data.general_error)
        return
      }

      if (!data?.data) {
        setError('No patient found with this ID')
        // setShowPatientInfo(false)
      } else {
        setPatient({
          id: Number(data.data.id),
          name: data.data.name || '',
          guardianName: data.data.guardianName || '',
          gender: data.data.gender || '',
          dob: data.data.dob || '',
          age: data.data.age ?? 0,
          maritalStatus: data.data.maritalStatus || '',
          bloodGroup: data.data.bloodGroup || '',
          phoneNumber: data.data.phoneNumber || '',
          // cnic: data.data.cnic || '',
          address: data.data.address || '',
          welfareRecord: data.data.welfareRecord ?? undefined,
          // department: undefined,
          // doctor: undefined,
          // procedure: undefined,
          // discountPercentage: data.data?.welfareRecord?.discountPercentage ?? 0,
          // fee: 0,
          // netFees: 0,
          patientId: data.data.patientId,
        })
        // setShowPatientInfo(true)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error fetching patient')
    }
    // }
    // fetchPatient()
  }

  /* ---------- CART FUNCTIONS ---------- */
  // const addToCart = (procedure: Procedure) => {
  //   if (!selectedDepartment || !selectedDoctor) return

  //   const exists = cart.some(
  //     (item) =>
  //       item.department.id === selectedDepartment.id &&
  //       item.doctor.id === selectedDoctor.id &&
  //       item.procedure.id === procedure.id
  //   )
  //   if (exists) return

  //   const updated = [
  //     ...cart,
  //     {
  //       department: selectedDepartment,
  //       doctor: selectedDoctor,
  //       procedure,
  //     },
  //   ]
  //   setCart(updated)
  //   calculateTotals(updated, discount)

  //   // Reset Department and Doctor after adding a procedure
  //   setSelectedDepartment(null)
  //   setSelectedDoctor(null)
  // }
  const addToCart = (doctor: Doctor) => {
    if (!selectedDepartment || !selectedProcedure) return

    const exists = cart.some(
      (item) =>
        item.department.id === selectedDepartment.id &&
        item.doctor.id === doctor.id &&
        item.procedure.id === selectedProcedure.id
    )

    if (exists) return

    const updated = [
      ...cart,
      {
        department: selectedDepartment,
        doctor,
        procedure: selectedProcedure,
      },
    ]

    setCart(updated)
    calculateTotals(updated, discount)

    // ✅ RESET after add
    setSelectedDoctor(null)
    setSelectedProcedure(null)
  }

  const removeFromCart = (index: number) => {
    const updated = cart.filter((_, i) => i !== index)
    setCart(updated)
    calculateTotals(updated, discount)
  }

  // const calculateTotals = (items: CartItem[], discountValue: number) => {
  //   const total = items.reduce((sum, item) => sum + item.procedure.fee, 0)
  //   const final = total - (total * discountValue) / 100
  //   setTotalFee(total)
  //   setFinalFee(final)
  // }
  const calculateTotals = (items: CartItem[], discountValue: number) => {
    const total = items.reduce((sum, item) => sum + item.procedure.fee, 0)
    const final = Math.max(total - discountValue, 0) // prevent negative
    setTotalFee(total)
    setFinalFee(final)
  }
  const handleDiscountChange = (value: number) => {
    if (value > totalFee) {
      setDiscountError('Discount amount cannot be more than total amount')
      setDiscount(totalFee)
      calculateTotals(cart, totalFee)
      return
    }

    setDiscountError(null)
    setDiscount(value)
    calculateTotals(cart, value)
  }

  /* ---------- SUBMIT API ---------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!patient || cart.length === 0) {
      setError('Patient and at least one procedure are required.')
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
      items: cart.map((c) => ({
        departmentId: c.department.id,
        doctorId: c.doctor.id,
        procedureId: c.procedure.id,
        fee: c.procedure.fee,
      })),
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

      // ✅ Generate receipt
      const receiptHTML = ReceiptTemplate({
        patient,
        cart,
        totalFee,
        finalFee,
        discount,
        tokenNumber: data.data.tokenNumber,
        receiptNo: data.data.receiptNo,
      })

      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(receiptHTML)
        printWindow.document.close()
        printWindow.onload = () => printWindow.print()
      }

      setSuccess('Medical record printed successfully!')
      setDepartments([])
      setDiscount(0)
      setTotalFee(0)
      setFinalFee(0)
      setCart([])
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Error saving patient')
      } else {
        setError('Server Error')
      }
    } finally {
      setLoading(false)
    }
  }

  /* ---------- DROPDOWN OPTIONS ---------- */
  const departmentOptions = departments.map((d) => ({ id: d.id, name: d.name }))
  // const doctorOptions =
  //   selectedDepartment?.doctors.map((d) => ({ id: d.id, name: d.name })) || []
  // const procedureOptions =
  //   selectedDoctor?.procedures.map((p) => ({
  //     id: p.id,
  //     name: `${p.name} (${p.fee})`,
  //     fee: p.fee,
  //   })) || []
  const doctorOptions =
    selectedDepartment && selectedProcedure
      ? selectedDepartment.doctors
          .filter((doc) =>
            doc.procedures.some((p) => p.id === selectedProcedure.id)
          )
          .map((doc) => ({
            id: doc.id,
            name: doc.name,
          }))
      : []

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

  /* ---------- RENDER ---------- */
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Patient Receipt Generator</h2>
      {error && <p className="text-red mb-2">{error}</p>}
      {discountError && (
        <p className="text-red text-sm mt-1">{discountError}</p>
      )}

      {success && <SuccessMessage msg={success} />}

      <div className="flex items-center gap-3">
        <Input
          type="text"
          placeholder="Enter MR ID"
          className="max-w-64"
          value={searchPatientId || ''}
          onChange={(e) => setSearchPatientId(e.target.value)}
          required={true}
        />
        <Button type="button" onClick={handleSearchPatientId}>
          {loading ? 'loading...' : 'Search'}
        </Button>
      </div>

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

          {/* Department Dropdown */}
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

              if (!doc || !selectedProcedure) return

              // optional: show selected briefly
              setSelectedDoctor(doc)

              // ✅ ADD EXACTLY ONCE
              addToCart(doc)
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
                max={totalFee}
                value={discount}
                onChange={(e) => handleDiscountChange(Number(e.target.value))}
              />
            </GroupInput>
          </div>

          {/* Cart Summary */}
          <div className="mt-2 p-3 rounded col-span-full">
            {/* <h3 className="font-semibold mb-2">Selected Services</h3> */}
            {cart.map((item, index) => (
              <div
                key={index}
                className="flex justify-between mb-1 border-b border-gray pb-2"
              >
                <div className="flex items-center gap-5">
                  <Button
                    type="button"
                    onClick={() => removeFromCart(index)}
                    className="!rounded-full !px-[5px] !py-0"
                  >
                    ✕
                  </Button>
                  <span>
                    {item.department.name} → {item.doctor.name} →{' '}
                    {item.procedure.name}
                  </span>
                </div>
                <span>{item.procedure.fee}</span>
              </div>
            ))}
          </div>

          <div className="mt-2 text-right col-span-full">
            <p>Total Fee: {totalFee}</p>
            <p>Discount: {discount}</p>
            <p className="font-bold">Final Fee: {finalFee}</p>
          </div>

          <Button
            type="button"
            onClick={handleSubmit}
            className="mt-4 col-span-full w-fit mx-auto"
          >
            {loading ? 'loading...' : 'Generate Receipt'}
          </Button>
        </div>
      )}
    </div>
  )
}

export default PatientReceiptGenerator
