import { useEffect, useState } from 'react'
import Button from '../../components/button/Button'
import { GroupInput } from '../../components/input/GroupInput'
import { Input } from '../../components/input/Input'
import { Label } from '../../components/input/Label'
import { useParams } from 'react-router-dom'

const AddWelfarePatient = () => {
  const { id: patientId } = useParams()
  const [error, setError] = useState<string | null>(null)
  const [showPatientInfo, setShowPatientInfo] = useState(false)

  const [form, setForm] = useState({
    // Patient Info
    name: '',
    guardianName: '',
    gender: '',
    dob: '',
    age: '',
    phoneNumber: '',
    address: '',

    // Financial Info
    monthlyIncome: '',
    sourceOfIncome: '',
    houseOwnership: '',
    houseType: '',
    vehicleOwnership: '',
    familyMembers: '',
    workingMembers: '',
    educationLevel: '',
    financialRemarks: '',

    // Welfare Info
    welfareCategory: '',
    discountType: '',
    discountPercentage: '',
    startDate: '',
    endDate: '',
    approvedBy: '',
    referredBy: '',
    remarks: '',

    // Verification
    verificationStatus: '',
    verifiedBy: '',
    verificationDate: '',
    approvalDate: '',
    nextReviewDate: '',
  })

  const API_BASE = import.meta.env.VITE_API_BASE_URL
  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchPatient = async () => {
      setError(null)
      try {
        const res = await fetch(`${API_BASE}/api/patient/${patientId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!res.ok) throw new Error('Failed to fetch patient')
        const data = await res.json()
        if (!data) {
          setError('No patient found with this ID')
          setShowPatientInfo(false)
        } else {
          setForm((prev) => ({ ...prev, ...data.data }))
          setShowPatientInfo(true)
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('Error fetching patient')
        }
      }
    }
    fetchPatient()
  }, [patientId, token])

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setError(null)

    try {
      const res = await fetch('http://localhost:3000/api/welfare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          patientId: Number(patientId),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Failed to save welfare record')
      }

      console.log('Server response:', data)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Something went wrong while saving record')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <p className="text-xl font-semibold underline">Welfare Management</p>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {showPatientInfo && (
        <>
          {/* === Basic Patient Info === */}
          <div className="grid min-[1440px]:grid-cols-3 max-w-[1000px] gap-x-3 gap-y-4 mt-6">
            <div className="flex items-center gap-3 col-span-full">
              <p className="text-3xl font-semibold whitespace-nowrap">
                🧍 Basic Information
              </p>
              <div className="h-[3px] rounded-full w-full bg-gray"></div>
            </div>

            <div className="border border-gray rounded-xl col-span-full p-5 grid grid-cols-3 gap-5">
              <p>Full Name: {form.name}</p>
              <p>Guardian: {form.guardianName}</p>
              <p>Gender: {form.gender}</p>
              <p>DOB: {form.dob}</p>
              <p>Age: {form.age}</p>
              <p>Phone: {form.phoneNumber}</p>
              <p>Address: {form.address}</p>
            </div>

            {/* === Financial & Social Info === */}
            <div className="flex items-center gap-3 col-span-full mt-6">
              <p className="text-3xl font-semibold whitespace-nowrap">
                💰 Financial & Social Information
              </p>
              <div className="h-[3px] rounded-full w-full bg-gray"></div>
            </div>

            <div className="border border-gray rounded-xl col-span-full p-5 grid grid-cols-3 gap-5">
              <GroupInput>
                <Label>Monthly Income (PKR)</Label>
                <Input
                  value={form.monthlyIncome}
                  onChange={(e) =>
                    handleChange('monthlyIncome', e.target.value)
                  }
                />
              </GroupInput>
              <GroupInput>
                <Label>Source of Income</Label>
                <Input
                  value={form.sourceOfIncome}
                  onChange={(e) =>
                    handleChange('sourceOfIncome', e.target.value)
                  }
                />
              </GroupInput>
              <GroupInput>
                <Label>House Ownership</Label>
                <Input
                  value={form.houseOwnership}
                  onChange={(e) =>
                    handleChange('houseOwnership', e.target.value)
                  }
                />
              </GroupInput>
              <GroupInput>
                <Label>House Type</Label>
                <Input
                  value={form.houseType}
                  onChange={(e) => handleChange('houseType', e.target.value)}
                />
              </GroupInput>
              <GroupInput>
                <Label>Vehicle Ownership</Label>
                <Input
                  value={form.vehicleOwnership}
                  onChange={(e) =>
                    handleChange('vehicleOwnership', e.target.value)
                  }
                />
              </GroupInput>
              <GroupInput>
                <Label>Family Members</Label>
                <Input
                  value={form.familyMembers}
                  onChange={(e) =>
                    handleChange('familyMembers', e.target.value)
                  }
                />
              </GroupInput>
              <GroupInput>
                <Label>Working Members</Label>
                <Input
                  value={form.workingMembers}
                  onChange={(e) =>
                    handleChange('workingMembers', e.target.value)
                  }
                />
              </GroupInput>
              <GroupInput>
                <Label>Education Level</Label>
                <Input
                  value={form.educationLevel}
                  onChange={(e) =>
                    handleChange('educationLevel', e.target.value)
                  }
                />
              </GroupInput>
              <GroupInput className="col-span-full">
                <Label>Financial Remarks</Label>
                <Input
                  value={form.financialRemarks}
                  onChange={(e) =>
                    handleChange('financialRemarks', e.target.value)
                  }
                />
              </GroupInput>
            </div>

            {/* === Welfare Details === */}
            <div className="flex items-center gap-3 col-span-full mt-6">
              <p className="text-3xl font-semibold whitespace-nowrap">
                🏥 Welfare Details
              </p>
              <div className="h-[3px] rounded-full w-full bg-gray"></div>
            </div>

            <div className="border border-gray rounded-xl col-span-full p-5 grid grid-cols-3 gap-5">
              <GroupInput>
                <Label>Welfare Category</Label>
                <Input
                  placeholder="Zakat / NGO / Employee Family"
                  value={form.welfareCategory}
                  onChange={(e) =>
                    handleChange('welfareCategory', e.target.value)
                  }
                />
              </GroupInput>
              <GroupInput>
                <Label>Discount Type</Label>
                <Input
                  placeholder="OPD / Lab / Pharmacy / All Services"
                  value={form.discountType}
                  onChange={(e) => handleChange('discountType', e.target.value)}
                />
              </GroupInput>
              <GroupInput>
                <Label>Discount Percentage (%)</Label>
                <Input
                  type="number"
                  value={form.discountPercentage}
                  onChange={(e) =>
                    handleChange('discountPercentage', e.target.value)
                  }
                />
              </GroupInput>
              <GroupInput>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                />
              </GroupInput>
              <GroupInput>
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                />
              </GroupInput>
              <GroupInput>
                <Label>Approved By</Label>
                <Input
                  placeholder="Admin / Welfare Officer / Doctor"
                  value={form.approvedBy}
                  onChange={(e) => handleChange('approvedBy', e.target.value)}
                />
              </GroupInput>
              <GroupInput>
                <Label>Referred By</Label>
                <Input
                  placeholder="Doctor / NGO / Staff"
                  value={form.referredBy}
                  onChange={(e) => handleChange('referredBy', e.target.value)}
                />
              </GroupInput>
              <GroupInput className="col-span-full">
                <Label>Remarks / Notes</Label>
                <Input
                  placeholder="Reason for welfare approval"
                  value={form.remarks}
                  onChange={(e) => handleChange('remarks', e.target.value)}
                />
              </GroupInput>
            </div>

            {/* === Verification & Approval === */}
            <div className="flex items-center gap-3 col-span-full mt-6">
              <p className="text-3xl font-semibold whitespace-nowrap">
                ✅ Verification & Approval
              </p>
              <div className="h-[3px] rounded-full w-full bg-gray"></div>
            </div>

            <div className="border border-gray rounded-xl col-span-full p-5 grid grid-cols-3 gap-5">
              <GroupInput>
                <Label>Verification Status</Label>
                <Input
                  placeholder="Pending / Verified / Rejected"
                  value={form.verificationStatus}
                  onChange={(e) =>
                    handleChange('verificationStatus', e.target.value)
                  }
                />
              </GroupInput>
              <GroupInput>
                <Label>Verified By</Label>
                <Input
                  value={form.verifiedBy}
                  onChange={(e) => handleChange('verifiedBy', e.target.value)}
                />
              </GroupInput>
              <GroupInput>
                <Label>Verification Date</Label>
                <Input
                  type="date"
                  value={form.verificationDate}
                  onChange={(e) =>
                    handleChange('verificationDate', e.target.value)
                  }
                />
              </GroupInput>
              <GroupInput>
                <Label>Approval Date</Label>
                <Input
                  type="date"
                  value={form.approvalDate}
                  onChange={(e) => handleChange('approvalDate', e.target.value)}
                />
              </GroupInput>
              <GroupInput>
                <Label>Next Review Date</Label>
                <Input
                  type="date"
                  value={form.nextReviewDate}
                  onChange={(e) =>
                    handleChange('nextReviewDate', e.target.value)
                  }
                />
              </GroupInput>
            </div>

            {/* === Submit Button === */}
            <div className="col-span-full mx-auto mt-8">
              <Button type="submit">Save Welfare Record</Button>
            </div>
          </div>
        </>
      )}
    </form>
  )
}

export default AddWelfarePatient
