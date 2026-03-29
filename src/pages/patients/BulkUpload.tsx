import { useState } from 'react'
import Button from '../../components/button/Button'
import { routePaths } from '../../constants/routePaths'

interface SkippedRow {
  row: Record<string, string | number | undefined>
  reason: string
}

interface UploadResult {
  inserted: number
  skipped: number
  skippedRows: SkippedRow[]
}

const BulkUpload: React.FC = () => {
  const API_BASE = import.meta.env.VITE_API_BASE_URL
  const token = localStorage.getItem('token')

  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<UploadResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    setSuccess(null)
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      if (!selectedFile.name.match(/\.(xlsx|xls)$/)) {
        setError('Only Excel files (.xlsx or .xls) are allowed.')
        return
      }
      setFile(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select an Excel file to upload.')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(`${API_BASE}/api/patients/bulk-upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const data: { success: boolean; message?: string; inserted?: number; skipped?: number; skippedRows?: SkippedRow[] } =
        await response.json()

      if (response.ok && data.success) {
        setSuccess({
          inserted: data.inserted ?? 0,
          skipped: data.skipped ?? 0,
          skippedRows: data.skippedRows ?? [],
        })
      } else {
        setError(data.message || 'Upload failed.')
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err)
        setError(err.message)
      } else {
        console.error('Unexpected error', err)
        setError('Server error')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-3">
        <h1 className="text-xl font-semibold">Bulk Upload Patients</h1>
        <Button to={routePaths.PATIENTS} asLink>
          <svg
            className="w-3.5 h-3.5 -scale-x-100 mr-1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 640"
          >
            <use href="/assets/svg/arrow-icon.svg#arrow-icon" />
          </svg>
          Back
        </Button>
      </div>

      {/* Upload & Instructions */}
      <div className="flex gap-8 p-6 bg-gray-50 rounded-lg">
        {/* Left: Upload Panel */}
        <div className="flex-1 flex flex-col gap-4">
          {success && (
            <div className="p-4 bg-green-100 text-green-800 rounded-lg">
              <p>✅ Successfully inserted: {success.inserted}</p>
              <p>⚠ Skipped rows: {success.skipped}</p>
              {success.skippedRows.length > 0 && (
                <ul className="list-disc list-inside text-sm mt-2 max-h-40 overflow-auto">
                  {success.skippedRows.map((row, idx) => (
                    <li key={idx}>
                      Row: {JSON.stringify(row.row)} - Reason: {row.reason}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-100 text-red-800 rounded-lg">{error}</div>
          )}

          <label
            htmlFor="upload-excel"
            className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg bg-white cursor-pointer hover:bg-gray-100 transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <p className="text-lg font-medium text-gray-700">
              {file ? file.name : 'Click to upload Excel file'}
            </p>
            <p className="text-sm text-gray-400 mt-1">Only .xlsx or .xls files</p>
            <input
              id="upload-excel"
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          <Button
            onClick={handleUpload}
            disabled={loading}
            className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-all w-fit"
          >
            {loading ? 'Uploading...' : 'Upload'}
          </Button>
        </div>

        {/* Right: Instructions */}
        <div className="flex-1 p-5 rounded-lg bg-white">
          <h3 className="text-lg font-semibold mb-3">Upload Instructions</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm">
            <li>Ensure the Excel file contains patient details in proper columns.</li>
            <li>
              Required fields: <strong>Name</strong> and <strong>Phone Number</strong>.
            </li>
            <li>
              Optional fields: Guardian Name, Gender, Age, Marital Status, Blood
              Group, CNIC, Address.
            </li>
            <li>Duplicate patients (based on patientId) will be skipped automatically.</li>
            <li>Maximum file size: 5MB.</li>
            <li>After selecting a file, click <strong>Upload</strong> to import patients.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default BulkUpload