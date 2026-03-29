import { useState } from 'react'
import * as yup from 'yup'
import ErrorMessage from '../../../components/error-handling/ErrorMessage'
import SuccessMessage from '../../../components/error-handling/SuccessMessage'
import { GroupInput } from '../../../components/input/GroupInput'
import { Label } from '../../../components/input/Label'
import { Input } from '../../../components/input/Input'
import TextArea from '../../../components/input/TextArea'
import Button from '../../../components/button/Button'


const checkUpSchema = yup.object().shape({
  bloodPressure: yup.string().nullable(),
  pulseRate: yup.number().nullable(),
  temperature: yup.number().nullable(),
  sugarLevel: yup.number().nullable(),
  oxygenSaturation: yup.number().nullable(),
  weight: yup.number().nullable(),
  height: yup.number().nullable(),
  bmi: yup.number().nullable(),
  notes: yup.string().nullable(),
})

interface Props {
  patientId: number
  medicalRecordId: number
}

const AddPatientVitals: React.FC<Props> = () => {
  const initialForm = {
    bloodPressure: '',
    pulseRate: '',
    temperature: '',
    sugarLevel: '',
    oxygenSaturation: '',
    weight: '',
    height: '',
    bmi: '',
    notes: '',
  }
const patientId = 1
const medicalRecordId =2
  const [form, setForm] = useState(initialForm)
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<null | string>(null)
  const [success, setSuccess] = useState<null | string>(null)

  const API_BASE = import.meta.env.VITE_API_BASE_URL
  const token = localStorage.getItem('token')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, type, value } = e.target

    const newValue =
      type === 'checkbox' && e.target instanceof HTMLInputElement
        ? e.target.checked
        : value

    setForm((prev) => ({
      ...prev,
      [id]: newValue,
    }))

    setFieldErrors((prev) => ({
      ...prev,
      [id]: '',
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      await checkUpSchema.validate(form, { abortEarly: false })
      setFieldErrors({})

      const res = await fetch(`${API_BASE}/api/patient-vitals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          patientId,
          medicalRecordId,
        }),
      })

      const resData = await res.json()

      if (!res.ok) {
        setError(resData?.errors?.general || resData?.message || 'Something went wrong')
        return
      }

      setSuccess(resData?.message)
      setForm(initialForm)
    } catch (err: unknown) {
      if (err instanceof yup.ValidationError) {
        const newErrors: { [key: string]: string } = {}

        err.inner.forEach((e) => {
          if (e.path) newErrors[e.path] = e.message
        })

        setFieldErrors(newErrors)
      } else if (err instanceof Error) {
        setError(err.message || 'Something went wrong')
      } else {
        setError('An unknown error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {error && <ErrorMessage msg={error} />}
      {success && <SuccessMessage msg={success} />}

      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-6 max-w-4xl">
        <p className="text-xl font-semibold col-span-full">Add Patient Vitals / Nursing Check</p>

        <GroupInput>
          <Label htmlFor="bloodPressure">Blood Pressure</Label>
          <Input
            id="bloodPressure"
            placeholder="e.g., 120/80"
            value={form.bloodPressure}
            onChange={handleChange}
          />
          {fieldErrors.bloodPressure && (
            <p className="text-red text-xs">{fieldErrors.bloodPressure}</p>
          )}
        </GroupInput>

        <GroupInput>
          <Label htmlFor="pulseRate">Pulse Rate (bpm)</Label>
          <Input
            id="pulseRate"
            type="number"
            value={form.pulseRate}
            onChange={handleChange}
          />
          {fieldErrors.pulseRate && (
            <p className="text-red text-xs">{fieldErrors.pulseRate}</p>
          )}
        </GroupInput>

        <GroupInput>
          <Label htmlFor="temperature">Temperature (°C)</Label>
          <Input
            id="temperature"
            type="number"
            step="0.1"
            value={form.temperature}
            onChange={handleChange}
          />
        </GroupInput>

        <GroupInput>
          <Label htmlFor="sugarLevel">Sugar Level (mg/dL)</Label>
          <Input
            id="sugarLevel"
            type="number"
            value={form.sugarLevel}
            onChange={handleChange}
          />
        </GroupInput>

        <GroupInput>
          <Label htmlFor="oxygenSaturation">Oxygen Saturation (%)</Label>
          <Input
            id="oxygenSaturation"
            type="number"
            value={form.oxygenSaturation}
            onChange={handleChange}
          />
        </GroupInput>

        <GroupInput>
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            value={form.weight}
            onChange={handleChange}
          />
        </GroupInput>

        <GroupInput>
          <Label htmlFor="height">Height (cm)</Label>
          <Input
            id="height"
            type="number"
            value={form.height}
            onChange={handleChange}
          />
        </GroupInput>

        <GroupInput className='max-w-72 col-span-2'>
          <Label htmlFor="bmi">BMI</Label>
          <Input
            id="bmi"
            type="number"
            step="0.1"
            value={form.bmi}
            onChange={handleChange}
          />
        </GroupInput>

        <GroupInput className='col-span-full max-w-96'>
          <Label htmlFor="notes">Notes / Remarks</Label>
          <TextArea
            id="notes"
            placeholder="Any additional observations"
            value={form.notes}
            onChange={handleChange}
          />
        </GroupInput>

        <div className="mt-4">
          <Button type="submit">
            {isLoading ? 'Saving...' : 'Save Vitals'}
          </Button>
        </div>
      </form>
    </>
  )
}

export default AddPatientVitals
