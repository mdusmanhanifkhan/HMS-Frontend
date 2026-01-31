import React, { useState, useEffect } from 'react'
import { Label } from '../../../components/input/Label'
import Button from '../../../components/button/Button'
import { routePaths } from '../../../constants/routePaths'
import { GroupInput } from '../../../components/input/GroupInput'
import ToggleButton from '../../../components/button/ToggleButton'
import { Input } from '../../../components/input/Input'
import TextArea from '../../../components/input/TextArea'
import MultiSelectedDropdown from '../../../components/input/MultiSelectedDropdown'

const API_BASE = import.meta.env.VITE_API_BASE_URL
const token = localStorage.getItem('token')

interface CompanyOption {
  id: number | string
  name: string
}

interface DistributorForm {
  isActive: boolean
  name: string
  contactPerson: string
  phone: string
  mobile: string
  email: string
  website: string
  address1: string
  address2: string
  city: string
  state: string
  country: string
  postalCode: string
  ntn: string
  gst: string
  drugLicense: string
  registrationNo: string
  openingBalance: number
  balanceType: string
  creditLimit: number
  paymentTerms: string
  bankName: string
  bankAccount: string
  iban: string
  remarks: string
  companies: (number | string)[] 
}

export default function AddDistributor() {
  const [form, setForm] = useState<DistributorForm>({
    isActive: true,
    name: '',
    contactPerson: '',
    phone: '',
    mobile: '',
    email: '',
    website: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    country: 'Pakistan',
    postalCode: '',
    ntn: '',
    gst: '',
    drugLicense: '',
    registrationNo: '',
    openingBalance: 0,
    balanceType: '',
    creditLimit: 0,
    paymentTerms: '',
    bankName: '',
    bankAccount: '',
    iban: '',
    remarks: '',
    companies: [],
  })

  const [loading, setLoading] = useState(false)
  const [companies, setCompanies] = useState<CompanyOption[]>([])
  const [selectedCompanies, setSelectedCompanies] = useState<CompanyOption[]>(
    []
  )

  // Fetch companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/company`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        setCompanies(data.data || [])
      } catch (err) {
        console.error('Failed to fetch companies', err)
      }
    }
    fetchCompanies()
  }, [])

  // ✅ Only push company ID into form
  const handleSelectCompany = (company: CompanyOption) => {
    // prevent duplicate
    if (form.companies.includes(company.id)) return

    setSelectedCompanies((prev) => [...prev, company])
    setForm((prev) => ({
      ...prev,
      companies: [...prev.companies, company.id],
    }))
  }

  const handleRemoveCompany = (company: CompanyOption) => {
    setSelectedCompanies((prev) => prev.filter((c) => c.id !== company.id))
    setForm((prev) => ({
      ...prev,
      companies: prev.companies.filter((id) => id !== company.id),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        name: form.name,
        contactPerson: form.contactPerson,
        phone: form.phone,
        mobile: form.mobile,
        email: form.email,
        website: form.website,
        status: form.isActive,
        addressLine1: form.address1,
        addressLine2: form.address2,
        city: form.city,
        state: form.state,
        country: form.country,
        postalCode: form.postalCode,
        ntnNumber: form.ntn,
        gstNumber: form.gst,
        drugLicenseNo: form.drugLicense,
        registrationNo: form.registrationNo,
        openingBalance: Number(form.openingBalance) || 0,
        creditLimit: Number(form.creditLimit) || 0,
        balanceType: form.balanceType,
        paymentTerms: form.paymentTerms,
        bankName: form.bankName,
        bankAccountNo: form.bankAccount,
        iban: form.iban,
        remarks: form.remarks,
        companyIds: form.companies.map((id) => Number(id)),
      }

      const res = await fetch(`${API_BASE}/api/distributors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.message || data.general_error || 'Validation error')
        return
      }

      alert('Distributor added successfully ✅')

      setForm({
        isActive: true,
        name: '',
        contactPerson: '',
        phone: '',
        mobile: '',
        email: '',
        website: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        country: 'Pakistan',
        postalCode: '',
        ntn: '',
        gst: '',
        drugLicense: '',
        registrationNo: '',
        openingBalance: 0,
        balanceType: '',
        creditLimit: 0,
        paymentTerms: '',
        bankName: '',
        bankAccount: '',
        iban: '',
        remarks: '',
        companies: [],
      })
      setSelectedCompanies([])
    } catch (err) {
      console.error(err)
      alert('Server error, please try again')
    } finally {
      setLoading(false)
    }
  }

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

    setForm((prev) => ({
      ...prev,
      [name]: finalValue,
    }))
  }

  return (
    <form className="flex flex-col gap-10" onSubmit={handleSubmit}>
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-3">
        <p className="text-xl font-semibold w-full">Add Distributor</p>
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
          <Label>Distributor Name</Label>
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
          <Label>Mobile</Label>
          <Input name="mobile" value={form.mobile} onChange={handleChange} />
        </GroupInput>

        <GroupInput>
          <Label>Email</Label>
          <Input name="email" value={form.email} onChange={handleChange} />
        </GroupInput>

        <GroupInput>
          <Label>Website</Label>
          <Input name="website" value={form.website} onChange={handleChange} />
        </GroupInput>

        {/* ADDRESS */}
        <GroupInput>
          <Label>Address Line 1</Label>
          <TextArea
            name="address1"
            value={form.address1}
            onChange={handleChange}
          />
        </GroupInput>

        <GroupInput>
          <Label>Address Line 2</Label>
          <TextArea
            name="address2"
            value={form.address2}
            onChange={handleChange}
          />
        </GroupInput>

        <GroupInput>
          <Label>City</Label>
          <Input name="city" value={form.city} onChange={handleChange} />
        </GroupInput>

        <GroupInput>
          <Label>State / Province</Label>
          <Input name="state" value={form.state} onChange={handleChange} />
        </GroupInput>

        <GroupInput>
          <Label>Country</Label>
          <Input name="country" value={form.country} onChange={handleChange} />
        </GroupInput>

        <GroupInput>
          <Label>Postal Code</Label>
          <Input
            name="postalCode"
            value={form.postalCode}
            onChange={handleChange}
          />
        </GroupInput>

        {/* BUSINESS */}
        <GroupInput>
          <Label>NTN Number</Label>
          <Input name="ntn" value={form.ntn} onChange={handleChange} />
        </GroupInput>

        <GroupInput>
          <Label>GST Number</Label>
          <Input name="gst" value={form.gst} onChange={handleChange} />
        </GroupInput>

        <GroupInput>
          <Label>Drug License No</Label>
          <Input
            name="drugLicense"
            value={form.drugLicense}
            onChange={handleChange}
          />
        </GroupInput>

        <GroupInput>
          <Label>Registration No</Label>
          <Input
            name="registrationNo"
            value={form.registrationNo}
            onChange={handleChange}
          />
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
          <Label>Balance Type</Label>
          <Input
            name="balanceType"
            value={form.balanceType}
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

        <GroupInput>
          <Label>Bank Name</Label>
          <Input
            name="bankName"
            value={form.bankName}
            onChange={handleChange}
          />
        </GroupInput>

        <GroupInput>
          <Label>Bank Account No</Label>
          <Input
            name="bankAccount"
            value={form.bankAccount}
            onChange={handleChange}
          />
        </GroupInput>

        <GroupInput>
          <Label>IBAN</Label>
          <Input name="iban" value={form.iban} onChange={handleChange} />
        </GroupInput>

        {/* COMPANIES */}
        <GroupInput>
          <Label>Select Companies</Label>
          <MultiSelectedDropdown
            options={companies}
            selected={selectedCompanies}
            onSelect={handleSelectCompany}
            onRemove={handleRemoveCompany}
            placeholder="Select companies..."
          />
        </GroupInput>

        {/* REMARKS */}
        <GroupInput className="col-span-full">
          <Label>Remarks</Label>
          <TextArea
            name="remarks"
            value={form.remarks}
            onChange={handleChange}
          />
        </GroupInput>
      </div>

      {/* ACTION */}
      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Distributor'}
        </Button>
        <Button type="reset">Clear</Button>
      </div>
    </form>
  )
}
