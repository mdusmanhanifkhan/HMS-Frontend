import React, { useState, ChangeEvent } from 'react'
import Button from '../../components/button/Button'

interface UploadItem {
  title: string
  endpoint: string
}

const AllUploads: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>({})
  const [loading, setLoading] = useState<string | null>(null)
  const [message, setMessage] = useState<string>('')
  const [error, setError] = useState<string>('')

  const API_BASE = import.meta.env.VITE_API_BASE_URL as string
  const token = localStorage.getItem('token') || ''

  const uploadList: UploadItem[] = [
    { title: 'Patients', endpoint: '/api/patients/bulk-upload' },
    { title: 'Doctors', endpoint: '/api/doctors/bulk-upload' },
    { title: 'Medical Records', endpoint: '/api/medical-records/bulk-upload' },
    { title: 'Departments', endpoint: '/api/departments/bulk-upload' },
    { title: 'Procedures', endpoint: '/api/procedures/bulk-upload' },
    { title: 'Fee Policies', endpoint: '/api/fee-policies/bulk-upload' },
  ]

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    title: string
  ) => {
    setMessage('')
    setError('')

    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles((prev) => ({
        ...prev,
        [title]: e.target.files![0],
      }))
    }
  }

  const handleUpload = async (item: UploadItem) => {
    const file = selectedFiles[item.title]

    if (!file) {
      setError(`Please select a file for ${item.title}`)
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      setLoading(item.title)
      setMessage('')
      setError('')

      const response = await fetch(`${API_BASE}${item.endpoint}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Upload failed')
      }

      setMessage(
        `${item.title} Upload Successful! Inserted: ${result.inserted}, Skipped: ${result.skipped}`
      )

      setSelectedFiles((prev) => ({
        ...prev,
        [item.title]: null,
      }))
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Bulk Upload Data
      </h1>

      {message && (
        <p className="mb-4 text-green-600 font-medium text-center">
          {message}
        </p>
      )}

      {error && (
        <p className="mb-4 text-red-600 font-medium text-center">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {uploadList.map((item) => (
          <div
            key={item.title}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
          >
            <h2 className="text-lg font-semibold mb-4 text-center">
              {item.title}
            </h2>

            <input
              type="file"
              accept=".xlsx"
              onChange={(e) => handleFileChange(e, item.title)}
              className="mb-4 block w-full"
            />

            <div className="flex justify-center">
              <Button
                onClick={() => handleUpload(item)}
                disabled={loading === item.title}
              >
                {loading === item.title
                  ? 'Uploading...'
                  : `Upload ${item.title}`}
              </Button>
            </div>

            <p className="mt-3 text-xs text-gray-500 text-center">
              Supported format: .xlsx
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllUploads
