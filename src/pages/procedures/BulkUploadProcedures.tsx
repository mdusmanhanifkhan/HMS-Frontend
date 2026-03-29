import { useState } from 'react'
import Button from '../../components/button/Button'
import { routePaths } from '../../constants/routePaths'

interface RowError {
  row: Record<string, string | number | undefined>
  reason: string
}

interface UploadResult {
  inserted: number
  skipped: RowError[]
  invalidDepartmentRows: RowError[]
}

const BulkUploadProcedures: React.FC = () => {
  const API_BASE = import.meta.env.VITE_API_BASE_URL
  const token = localStorage.getItem('token')

  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<UploadResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  // 📁 File Select
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

  // 🚀 Upload
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
      const response = await fetch(`${API_BASE}/api/procedures/bulk-upload`, {
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
        skipped?: RowError[]
        invalidDepartmentRows?: RowError[]
      } = await response.json()

      if (response.ok && data.success) {
        setSuccess({
          inserted: data.inserted ?? 0,
          skipped: data.skipped ?? [],
          invalidDepartmentRows: data.invalidDepartmentRows ?? [],
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
        <h1 className="text-xl font-semibold">Bulk Upload Procedures</h1>

        <Button to={routePaths.PROCEDURE} asLink>
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

      <div className="flex gap-8 p-6 bg-gray-50 rounded-lg">

        {/* LEFT */}
        <div className="flex-1 flex flex-col gap-4">

          {/* SUCCESS */}
          {success && (
            <div className="p-4 bg-green-100 text-green-800 rounded-lg space-y-2">
              <p>✅ Inserted: {success.inserted}</p>
              <p>⚠ Skipped: {success.skipped.length}</p>
              <p>❌ Invalid Departments: {success.invalidDepartmentRows.length}</p>

              {/* Skipped */}
              {success.skipped.length > 0 && (
                <div className="mt-2 text-sm max-h-32 overflow-auto">
                  <strong>Skipped Rows:</strong>
                  <ul className="list-disc ml-4">
                    {success.skipped.map((item, i) => (
                      <li key={i}>
                        {item.reason} → {JSON.stringify(item.row)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Invalid Departments */}
              {success.invalidDepartmentRows.length > 0 && (
                <div className="mt-2 text-sm max-h-32 overflow-auto">
                  <strong>Invalid Department Rows:</strong>
                  <ul className="list-disc ml-4">
                    {success.invalidDepartmentRows.map((item, i) => (
                      <li key={i}>
                        {item.reason} → {JSON.stringify(item.row)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="p-4 bg-red-100 text-red-800 rounded-lg">
              {error}
            </div>
          )}

          {/* Upload Box */}
          <label
            htmlFor="upload-excel"
            className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg bg-white cursor-pointer hover:bg-gray-100"
          >
            <p className="text-lg font-medium">
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

          <Button onClick={handleUpload} disabled={loading}>
            {loading ? 'Uploading...' : 'Upload'}
          </Button>
        </div>

        {/* RIGHT */}
        <div className="flex-1 p-5 bg-white rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-3">
            Procedure Upload Instructions
          </h3>

          <ul className="list-disc list-inside text-sm space-y-2">
            <li>
              Required: <strong>name</strong>
            </li>
            <li>
              Provide either <strong>departmentId</strong> OR{' '}
              <strong>departmentName</strong>
            </li>
            <li>
              Optional: <strong>shortCode, description</strong>
            </li>
            <li>
              Status allowed: active, true, 1, yes
            </li>
            <li>
              Invalid departments will be listed separately
            </li>
            <li>
              Duplicate procedures will be skipped automatically
            </li>
            <li>Max file size: 5MB</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default BulkUploadProcedures