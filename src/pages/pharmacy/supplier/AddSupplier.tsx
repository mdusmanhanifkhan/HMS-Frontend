import React, { useState } from 'react'
import { Label } from '../../../components/input/Label'
import Button from '../../../components/button/Button'
import { routePaths } from '../../../constants/routePaths'
import { GroupInput } from '../../../components/input/GroupInput'
import ToggleButton from '../../../components/button/ToggleButton'
import { Input } from '../../../components/input/Input'
import TextArea from '../../../components/input/TextArea'

const API_BASE = import.meta.env.VITE_API_BASE_URL
const token = localStorage.getItem('token')

interface SupplierForm {
  isActive: boolean
  name: string
  contactPerson: string
  phone: string
  email: string
  address: string
  city: string
  country: string
  openingBalance: number
  creditLimit: number
  paymentTerms: string
  remarks: string
}

export default function AddSupplier() {
  const [form, setForm] = useState<SupplierForm>({
    isActive: true,
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    country: 'Pakistan',
    openingBalance: 0,
    creditLimit: 0,
    paymentTerms: '',
    remarks: '',
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target

    let finalValue: string | number | boolean = value

    if (type === 'checkbox' && 'checked' in e.target) {
      finalValue = (e.target as HTMLInputElement).checked
    } else if (type === 'number') {
      const numValue = (e.target as HTMLInputElement).valueAsNumber
      finalValue = isNaN(numValue) ? 0 : numValue
    }

    setForm((prev) => ({ ...prev, [name]: finalValue }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        name: form.name,
        contactPerson: form.contactPerson,
        phone: form.phone,
        email: form.email,
        address: form.address,
        city: form.city,
        country: form.country,
        openingBalance: Number(form.openingBalance) || 0,
        creditLimit: Number(form.creditLimit) || 0,
        paymentTerms: form.paymentTerms,
        isActive: form.isActive,
        remarks: form.remarks,
      }

      const res = await fetch(`${API_BASE}/api/supplier`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.message || 'Validation error')
        return
      }

      alert('Supplier added successfully ✅')

      setForm({
        isActive: true,
        name: '',
        contactPerson: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        country: 'Pakistan',
        openingBalance: 0,
        creditLimit: 0,
        paymentTerms: '',
        remarks: '',
      })
    } catch (err) {
      console.error(err)
      alert('Server error, please try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="flex flex-col gap-10" onSubmit={handleSubmit}>
      
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-3">
        <p className="text-xl font-semibold w-full">Add Supplier</p>
        <Button to={routePaths.PROCEDURE} asLink>
          Back
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4 max-w-[1100px]">
        {/* Status */}
        <GroupInput className="col-span-full">
          <Label>Status</Label>
          <ToggleButton
            id="isActive"
            checked={form.isActive}
            onChange={handleChange}
          />
        </GroupInput>

        {/* BASIC INFO */}
        <GroupInput>
          <Label>Supplier Name</Label>
          <Input name="name" value={form.name} onChange={handleChange} />
        </GroupInput>

        <GroupInput>
          <Label>Contact Person</Label>
          <Input
            name="contactPerson"
            value={form.contactPerson}
            onChange={handleChange}
          />
        </GroupInput>

        <GroupInput>
          <Label>Phone</Label>
          <Input name="phone" value={form.phone} onChange={handleChange} />
        </GroupInput>

        <GroupInput>
          <Label>Email</Label>
          <Input name="email" value={form.email} onChange={handleChange} />
        </GroupInput>

        {/* ADDRESS */}
        <GroupInput className="col-span-full">
          <Label>Address</Label>
          <TextArea name="address" value={form.address} onChange={handleChange} />
        </GroupInput>

        <GroupInput>
          <Label>City</Label>
          <Input name="city" value={form.city} onChange={handleChange} />
        </GroupInput>

        <GroupInput>
          <Label>Country</Label>
          <Input name="country" value={form.country} onChange={handleChange} />
        </GroupInput>

        {/* FINANCE */}
        <GroupInput>
          <Label>Opening Balance</Label>
          <Input
            type="number"
            name="openingBalance"
            value={form.openingBalance}
            onChange={handleChange}
          />
        </GroupInput>

        <GroupInput>
          <Label>Credit Limit</Label>
          <Input
            type="number"
            name="creditLimit"
            value={form.creditLimit}
            onChange={handleChange}
          />
        </GroupInput>

        <GroupInput>
          <Label>Payment Terms</Label>
          <Input
            name="paymentTerms"
            value={form.paymentTerms}
            onChange={handleChange}
          />
        </GroupInput>

        {/* REMARKS */}
        <GroupInput className="col-span-full">
          <Label>Remarks</Label>
          <TextArea name="remarks" value={form.remarks} onChange={handleChange} />
        </GroupInput>
      </div>

      {/* ACTION */}
      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Supplier'}
        </Button>
        <Button
          type="reset"
          onClick={() =>
            setForm({
              isActive: true,
              name: '',
              contactPerson: '',
              phone: '',
              email: '',
              address: '',
              city: '',
              country: 'Pakistan',
              openingBalance: 0,
              creditLimit: 0,
              paymentTerms: '',
              remarks: '',
            })
          }
        >
          Clear
        </Button>
      </div>
    </form>
  )
}