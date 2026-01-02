import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Button from '../../components/button/Button'
import { routePaths } from '../../constants/routePaths'
import ReceiptTemplate from '../patients/ReceiptTemplate'
import Loading from '../../components/loading/Loading'

export interface PatientInfo {
  id: number
  patientId: number
  name: string
  guardianName: string
  gender: string
  age: number
  dob?: string | null
  phoneNumber?: string | null
  address: string
}

export interface VisitRecord {
  patientId: number
  visitDate: string
  fee: number
  discount: number
  finalFee: number
  notes: string
  createdBy?: {
    id: number
    name: string
    email: string
  }
  doctor?: { name: string }
  department?: { name: string }
  procedure?: { name: string }
}

const PatientHistory = () => {
  const { id: patientId } = useParams<{ id: string }>()
  const API_BASE = import.meta.env.VITE_API_BASE_URL
  const token = localStorage.getItem('token') || ''

  const [patient, setPatient] = useState<PatientInfo | null>(null)
  const [records, setRecords] = useState<VisitRecord[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchHistory = async () => {
      if (!patientId) return
      setLoading(true)

      try {
        const res = await fetch(
          `${API_BASE}/api/medical-records/${patientId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )

        const result: {
          data?: { patient: PatientInfo; records: VisitRecord[] }
          message?: string
        } = await res.json()

        if (!res.ok) {
          setError(result?.message || 'Failed to fetch patient history')
          setPatient(null)
          setRecords([])
          return
        }

        if (!result?.data) {
          setError('No visit history found for this patient')
          setPatient(null)
          setRecords([])
        } else {
          setPatient(result.data.patient)
          setRecords(result.data.records || [])
          setError(null)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [patientId, API_BASE, token])

  return (
    <div className="p-5">
      <div className="flex justify-between items-center border-b pb-3">
        <p className="text-xl font-semibold">Patient History</p>

        <Button to={routePaths.PATIENT_HISTORY} asLink>
          <svg
            className="w-3.5 h-3.5 -scale-x-100"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 640"
          >
            <use href="/assets/svg/arrow-icon.svg#arrow-icon" />
          </svg>
          Back
        </Button>
      </div>

      {loading && <Loading />}
      {error && <p className="text-red mt-10 text-center">{error}</p>}

      {!loading && !error && patient && (
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
              <p>Full Name: {patient.name}</p>
              <p>Guardian: {patient.guardianName}</p>
              <p>Gender: {patient.gender}</p>
              <p>DOB: {patient.dob || 'N/A'}</p>
              <p>Age: {patient.age}</p>
              <p>Phone: {patient.phoneNumber || '-'}</p>
              <p>Address: {patient.address}</p>
            </div>
          </div>

          <div className="col-span-full mt-4">
            <div className="relative overflow-x-auto shadow-lg rounded-lg">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-white uppercase bg-dark">
                  <tr>
                    <th className="px-6 py-4">MR ID</th>
                    <th className="px-6 py-4">Doctor</th>
                    <th className="px-6 py-4">Department</th>
                    <th className="px-6 py-4">Procedure</th>
                    <th className="px-6 py-4">Fee</th>
                    <th className="px-6 py-4">Discount</th>
                    <th className="px-6 py-4">Net Fee</th>
                    <th className="px-6 py-4 text-center">Created By</th>
                    <th className="px-6 py-4">Visit Date</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {records.length === 0 ? (
                    <tr>
                      <td colSpan={9}>
                        <div className="flex justify-center py-4">
                          No records found
                        </div>
                      </td>
                    </tr>
                  ) : (
                    records.map((r, index) => (
                      <tr
                        key={index}
                        className="bg-[#DFDEDE] border-b hover:bg-gray-100"
                      >
                        <td className="px-6 py-2">{r.patientId}</td>
                        <td className="px-6 py-2">{r.doctor?.name || '-'}</td>
                        <td className="px-6 py-2">
                          {r.department?.name || '-'}
                        </td>
                        <td className="px-6 py-2">
                          {r.procedure?.name || '-'}
                        </td>
                        <td className="px-6 py-2">{r.fee}</td>
                        <td className="px-6 py-2">{r.discount}</td>
                        <td className="px-6 py-2">{r.finalFee}</td>
                        <td className="px-6 py-2 text-center">
                          {r?.createdBy?.name || '-'}
                        </td>
                        <td className="px-6 py-2">
                          {new Date(r.visitDate).toLocaleString()}
                        </td>
                        <td className="px-6 py-2 flex items-center gap-2">
                          <button
                            onClick={() => {
                              const printablePatient = {
                                ...patient,
                                phoneNumber: patient.phoneNumber ?? '',
                                procedure: {
                                  id: 0,
                                  name: r.procedure?.name || 'Service',
                                  fee: Number(r.fee ?? 0),
                                },
                                department: r.department
                                  ? {
                                      id: 0,
                                      name: r.department.name,
                                    }
                                  : { id: 0, name: '-' },
                                doctor: r.doctor
                                  ? {
                                      id: 0,
                                      name: r.doctor.name,
                                    }
                                  : { id: 0, name: 'General OPD' },
                                discountPercentage: r.discount,
                                netFees: r.finalFee,
                                fee: r.fee,
                              }

                              // Generate receipt HTML using the template you already have
                              const receiptHTML = ReceiptTemplate({
                                patient: printablePatient,
                              })

                              const printWindow = window.open('', '_blank')
                              if (!printWindow) return

                              printWindow.document.open()
                              printWindow.document.write(receiptHTML)
                              printWindow.document.close()
                              printWindow.focus()

                              printWindow.onload = () => {
                                setTimeout(() => {
                                  printWindow.print()
                                  printWindow.close()
                                }, 300)
                              }
                            }}
                            className="bg-dark p-1 rounded-md group hover:bg-white border border-dark transition-all ease-linear duration-200 cursor-pointer"
                          >
                            <svg
                              className="w-[18px] h-[18px] text-white group-hover:text-dark"
                              viewBox="0 0 12 12"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <use href="/assets/svg/printer-icon.svg#printer-icon" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default PatientHistory
