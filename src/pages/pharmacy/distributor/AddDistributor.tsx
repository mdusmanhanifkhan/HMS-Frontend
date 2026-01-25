// import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
// import { Label } from '../../../components/input/Label'
// import Button from '../../../components/button/Button'
// import { routePaths } from '../../../constants/routePaths'
// import { GroupInput } from '../../../components/input/GroupInput'
// import ToggleButton from '../../../components/button/ToggleButton'
// import { Input } from '../../../components/input/Input'
// import TextArea from '../../../components/input/TextArea'
// import MultiSelectedDropdown from '../../../components/input/MultiSelectedDropdown'

// const API_BASE = import.meta.env.VITE_API_BASE_URL
// const token = localStorage.getItem('token')
// interface CompanyOption {
//   id: number | string
//   name: string
// }
// interface DistributorForm {
//   isActive: boolean
//   name: string
//   contactPerson: string
//   phone: string
//   mobile: string
//   email: string
//   website: string
//   address1: string
//   address2: string
//   city: string
//   state: string
//   country: string
//   postalCode: string
//   ntn: string
//   gst: string
//   drugLicense: string
//   registrationNo: string
//   openingBalance: string
//   balanceType: string
//   creditLimit: string
//   paymentTerms: string
//   bankName: string
//   bankAccount: string
//   iban: string
//   remarks: string
//   companies: [],
// }

// export default function AddDistributor() {
//   const [form, setForm] = useState<DistributorForm>({
//     isActive: true,
//     name: '',
//     contactPerson: '',
//     phone: '',
//     mobile: '',
//     email: '',
//     website: '',
//     address1: '',
//     address2: '',
//     city: '',
//     state: '',
//     country: 'Pakistan',
//     postalCode: '',
//     ntn: '',
//     gst: '',
//     drugLicense: '',
//     registrationNo: '',
//     openingBalance: '',
//     balanceType: '',
//     creditLimit: '',
//     paymentTerms: '',
//     bankName: '',
//     bankAccount: '',
//     iban: '',
//     companies: [],
//     remarks: '',
//   })

//   const [loading, setLoading] = useState(false)
//    const [companies, setCompanies] = useState<CompanyOption[]>([])
//   const [selectedCompanies, setSelectedCompanies] = useState<CompanyOption[]>([])

//   // Fetch companies on mount
//   useEffect(() => {
//     const fetchCompanies = async () => {
//       try {
//         const res = await fetch(`${API_BASE}/api/company`, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         const data = await res.json()
//         setCompanies(data.data || [])
//       } catch (err) {
//         console.error('Failed to fetch companies', err)
//       }
//     }
//     fetchCompanies()
//   }, [])

//   const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target
//     setForm((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleToggle = (val: boolean) => {
//     setForm((prev) => ({ ...prev, isActive: val }))
//   }

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault()
//     setLoading(true)

//     try {
//       const res = await fetch(`${API_BASE}/api/distributors`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(form),
//       })
//       await res.json()
//       alert('Distributor added successfully ✅')

//       // Reset form
//       setForm({
//         isActive: true,
//         name: '',
//         contactPerson: '',
//         phone: '',
//         mobile: '',
//         email: '',
//         website: '',
//         address1: '',
//         address2: '',
//         city: '',
//         state: '',
//         country: 'Pakistan',
//         postalCode: '',
//         ntn: '',
//         gst: '',
//         drugLicense: '',
//         registrationNo: '',
//         openingBalance: '',
//         balanceType: '',
//         creditLimit: '',
//         paymentTerms: '',
//         bankName: '',
//         bankAccount: '',
//         iban: '',
//         remarks: '',
//         companies:[]
//       })
//     } catch (err) {
//       console.error(err)
//       alert('Server error, please try again')
//     } finally {
//       setLoading(false)
//     }
//   }


//  const handleSelectCompany = (company: CompanyOption) => {
//   setSelectedCompanies((prev) => [...prev, company])
//   setForm((prev) => ({ ...prev, companies: [...prev.companies, company] }))
// }
//  const handleRemoveCompany = (company: CompanyOption) => {
//   setSelectedCompanies((prev) => prev.filter((c) => c.id !== company.id))
//   setForm((prev) => ({
//     ...prev,
//     companies: prev.companies.filter((c) => c.id !== company.id),
//   }))
// }
// console.log(companies)
//   return (
//     <form className="flex flex-col gap-10" onSubmit={handleSubmit}>
//       {/* Header */}
//       <div className="flex justify-between items-center border-b pb-3">
//         <p className="text-xl font-semibold w-full">Add Distributor</p>
//         <Button to={routePaths.PROCEDURE} asLink>
//           Back
//         </Button>
//       </div>

//       <div className="grid grid-cols-3 gap-4 max-w-[1100px]">

//         {/* Status */}
//         <GroupInput className="col-span-full">
//           <Label>Status</Label>
//           <ToggleButton id="isActive" value={form.isActive} onChange={handleToggle} />
//         </GroupInput>

//         {/* BASIC INFO */}
//         <GroupInput>
//           <Label>Distributor Name</Label>
//           <Input name="name" value={form.name} onChange={handleChange} />
//         </GroupInput>

//         <GroupInput>
//           <Label>Contact Person</Label>
//           <Input name="contactPerson" value={form.contactPerson} onChange={handleChange} />
//         </GroupInput>

//         <GroupInput>
//           <Label>Phone</Label>
//           <Input name="phone" value={form.phone} onChange={handleChange} />
//         </GroupInput>

//         <GroupInput>
//           <Label>Mobile</Label>
//           <Input name="mobile" value={form.mobile} onChange={handleChange} />
//         </GroupInput>

//         <GroupInput>
//           <Label>Email</Label>
//           <Input name="email" value={form.email} onChange={handleChange} />
//         </GroupInput>

//         <GroupInput>
//           <Label>Website</Label>
//           <Input name="website" value={form.website} onChange={handleChange} />
//         </GroupInput>

//         {/* ADDRESS */}
//         <GroupInput>
//           <Label>Address Line 1</Label>
//           <TextArea name="address1" value={form.address1} onChange={handleChange} />
//         </GroupInput>

//         <GroupInput>
//           <Label>Address Line 2</Label>
//           <TextArea name="address2" value={form.address2} onChange={handleChange} />
//         </GroupInput>

//         <GroupInput>
//           <Label>City</Label>
//           <Input name="city" value={form.city} onChange={handleChange} />
//         </GroupInput>

//         <GroupInput>
//           <Label>State / Province</Label>
//           <Input name="state" value={form.state} onChange={handleChange} />
//         </GroupInput>

//         <GroupInput>
//           <Label>Country</Label>
//           <Input name="country" value={form.country} onChange={handleChange} />
//         </GroupInput>

//         <GroupInput>
//           <Label>Postal Code</Label>
//           <Input name="postalCode" value={form.postalCode} onChange={handleChange} />
//         </GroupInput>

//         {/* BUSINESS */}
//         <GroupInput>
//           <Label>NTN Number</Label>
//           <Input name="ntn" value={form.ntn} onChange={handleChange} />
//         </GroupInput>

//         <GroupInput>
//           <Label>GST Number</Label>
//           <Input name="gst" value={form.gst} onChange={handleChange} />
//         </GroupInput>

//         <GroupInput>
//           <Label>Drug License No</Label>
//           <Input name="drugLicense" value={form.drugLicense} onChange={handleChange} />
//         </GroupInput>

//         <GroupInput>
//           <Label>Registration No</Label>
//           <Input name="registrationNo" value={form.registrationNo} onChange={handleChange} />
//         </GroupInput>

//         {/* FINANCE */}
//         <GroupInput>
//           <Label>Opening Balance</Label>
//           <Input type="number" name="openingBalance" value={form.openingBalance} onChange={handleChange} />
//         </GroupInput>

//         <GroupInput>
//           <Label>Balance Type</Label>
//           <Input name="balanceType" value={form.balanceType} onChange={handleChange} />
//         </GroupInput>

//         <GroupInput>
//           <Label>Credit Limit</Label>
//           <Input type="number" name="creditLimit" value={form.creditLimit} onChange={handleChange} />
//         </GroupInput>

//         <GroupInput>
//           <Label>Payment Terms</Label>
//           <Input name="paymentTerms" value={form.paymentTerms} onChange={handleChange} />
//         </GroupInput>

//         <GroupInput>
//           <Label>Bank Name</Label>
//           <Input name="bankName" value={form.bankName} onChange={handleChange} />
//         </GroupInput>

//         <GroupInput>
//           <Label>Bank Account No</Label>
//           <Input name="bankAccount" value={form.bankAccount} onChange={handleChange} />
//         </GroupInput>

//         <GroupInput>
//           <Label>IBAN</Label>
//           <Input name="iban" value={form.iban} onChange={handleChange} />
//         </GroupInput>
//         <GroupInput>
//           <Label>Select Companies</Label>
//           <MultiSelectedDropdown options={companies}     selected={selectedCompanies}
//             onSelect={handleSelectCompany} onRemove={handleRemoveCompany}  placeholder="Select companies..."/>
//         </GroupInput>

//         {/* REMARKS */}
//         <GroupInput className="col-span-full">
//           <Label>Remarks</Label>
//           <TextArea name="remarks" value={form.remarks} onChange={handleChange} />
//         </GroupInput>
//       </div>

//       {/* ACTION */}
//       <div className="flex gap-4">
//         <Button type="submit" disabled={loading}>
//           {loading ? 'Saving...' : 'Save Distributor'}
//         </Button>
//         <Button type="reset">Clear</Button>
//       </div>
//     </form>
//   )
// }


const AddDistributor = () => {
  return (
    <div>AddDistributor</div>
  )
}

export default AddDistributor