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

const BulkUploadDepartment: React.FC = () => {
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
      const response = await fetch(`${API_BASE}/api/departments/bulk-upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const data: {
        success: boolean
        message?: string
        inserted?: number
        skipped?: number
        skippedRows?: SkippedRow[]
      } = await response.json()

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
        <h1 className="text-xl font-semibold">Bulk Upload Departments</h1>
        <Button to={routePaths.DEPARTMENTS} asLink>
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

      {/* Content */}
      <div className="flex gap-8 p-6 bg-gray-50 rounded-lg">
        
        {/* LEFT: Upload */}
        <div className="flex-1 flex flex-col gap-4">

          {/* Success */}
          {success && (
            <div className="p-4 bg-green-100 text-green-800 rounded-lg">
              <p>✅ Inserted: {success.inserted}</p>
              <p>⚠ Skipped: {success.skipped}</p>

              {success.skippedRows.length > 0 && (
                <div className="mt-3 max-h-40 overflow-auto text-sm">
                  <table className="w-full border">
                    <thead className="bg-green-200">
                      <tr>
                        <th className="p-2 text-left">Row Data</th>
                        <th className="p-2 text-left">Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      {success.skippedRows.map((item, idx) => (
                        <tr key={idx} className="border-t">
                          <td className="p-2">{JSON.stringify(item.row)}</td>
                          <td className="p-2">{item.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="p-4 bg-red-100 text-red-800 rounded-lg">
              {error}
            </div>
          )}

          {/* Upload Box */}
          <label
            htmlFor="upload-excel"
            className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg bg-white cursor-pointer hover:bg-gray-100 transition-all"
          >
            <svg
              className="w-12 h-12 text-gray-400 mb-4"
              xmlns="http://www.w3.org/2000/svg"
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

            <p className="text-sm text-gray-400 mt-1">
              Only .xlsx or .xls files
            </p>

            <input
              id="upload-excel"
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={loading}
            className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-all w-fit"
          >
            {loading ? 'Uploading...' : 'Upload'}
          </Button>
        </div>

        {/* RIGHT: Instructions */}
        <div className="flex-1 p-5 rounded-lg bg-white border shadow-sm">
          <h3 className="text-lg font-semibold mb-3">
            Department Upload Instructions
          </h3>

          <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm">
            <li>
              Excel must contain <strong>Department Name</strong> (required).
            </li>
            <li>
              Optional fields: <strong>Short Code, Location, Description</strong>.
            </li>
            <li>
              <strong>Status</strong> values allowed: active, true, 1, yes.
            </li>
            <li>
              Time fields: <strong>timeFrom</strong> and <strong>timeTo</strong>.
            </li>
            <li>
              All departments will be created as <strong>OPD type</strong>.
            </li>
            <li>
              Duplicate entries will be skipped automatically.
            </li>
            <li>Maximum file size: 5MB.</li>
            <li>Click Upload after selecting file.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default BulkUploadDepartment