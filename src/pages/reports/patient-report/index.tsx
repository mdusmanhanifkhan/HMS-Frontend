import { useState } from 'react'
import * as Yup from 'yup'
import Button from '../../../components/button/Button'
import SuccessMessage from '../../../components/error-handling/SuccessMessage'
import ErrorMessage from '../../../components/error-handling/ErrorMessage'

interface Errors {
  fromDate?: string
  toDate?: string
}

const PatientReport: React.FC = () => {
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const API_BASE = import.meta.env.VITE_API_BASE_URL
  const token = localStorage.getItem('token') || ''

  // ✅ Yup validation schema
  const schema = Yup.object().shape({
    fromDate: Yup.date().required('From Date is required'),
    toDate: Yup.date()
      .required('To Date is required')
      .min(Yup.ref('fromDate'), 'To Date cannot be before From Date'),
  })

  const downloadReport = async () => {
    setErrors({})
    setError('')
    setSuccess('')

    try {
      // ✅ Validate form
      await schema.validate({ fromDate, toDate }, { abortEarly: false })

      setLoading(true)

      const response = await fetch(
        `${API_BASE}/api/medical-records/export/excel?from=${fromDate}&to=${toDate}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to download report')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = `medical-records-${fromDate}-to-${toDate}.xlsx`
      document.body.appendChild(link)
      link.click()
      link.remove()

      setSuccess('Report downloaded successfully!')
    } catch (err: unknown) {
      if (err instanceof Yup.ValidationError) {
        const validationErrors: Errors = {}
        err.inner.forEach((e) => {
          if (e.path) {
            validationErrors[e.path as keyof Errors] = e.message
          }
        })
        setErrors(validationErrors)
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h1 className="text-2xl font-semibold mb-6 text-center">
        Patient Report in Excel
      </h1>

      {success && <SuccessMessage msg={success} />}
      {error && <ErrorMessage msg={error} />}

      <div className="flex flex-col gap-4">
        <label className="flex flex-col">
          From Date:
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border px-2 py-1 rounded mt-1"
          />
          {errors.fromDate && (
            <span className="text-red-500 text-sm mt-1">{errors.fromDate}</span>
          )}
        </label>

        <label className="flex flex-col">
          To Date:
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border px-2 py-1 rounded mt-1"
          />
          {errors.toDate && (
            <span className="text-red-500 text-sm mt-1">{errors.toDate}</span>
          )}
        </label>

        <Button
          onClick={downloadReport}
          disabled={loading}
          className="w-fit mx-auto"
        >
          {loading ? 'Downloading...' : 'Download Excel Report'}
        </Button>
      </div>
    </div>
  )
}

export default PatientReport
