// import { useState, useEffect } from 'react'
// import * as Yup from 'yup'
// import Button from '../../components/button/Button'
// import { GroupInput } from '../../components/input/GroupInput'
// import { Input } from '../../components/input/Input'
// import { Label } from '../../components/input/Label'
// import ToggleButton from '../../components/button/ToggleButton'
// import Dropdown from '../../components/input/Dropdown'
// import { routePaths } from '../../constants/routePaths'

// interface Role {
//   id: number
//   name: string
// }

// interface UserForm {
//   status: boolean
//   name: string
//   email: string
//   password: string
//   roleId: number | null
// }

// // Yup validation schema
// const userSchema = Yup.object().shape({
//   name: Yup.string().required('Full name is required'),
//   email: Yup.string().email('Invalid email').required('Email is required'),
//   password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
//   roleId: Yup.number().required('Role is required'),
// })

// const CreateUser: React.FC = () => {
//   const [form, setForm] = useState<UserForm>({
//     status: true,
//     name: '',
//     email: '',
//     password: '',
//     roleId: null,
//   })
//   const [roles, setRoles] = useState<Role[]>([])
//   const [errors, setErrors] = useState<Record<string, string>>({})
//   const [successMsg, setSuccessMsg] = useState<string | null>(null)
//   const [errorMsg, setErrorMsg] = useState<string | null>(null)
//   const [isLoading, setIsLoading] = useState(false)

//   const API_BASE = import.meta.env.VITE_API_BASE_URL
//   const token = localStorage.getItem('token') // SuperAdmin token required

//   // Fetch roles from API
//   useEffect(() => {
//     const fetchRoles = async () => {
//       if (!token) return
//       try {
//         const res = await fetch(`${API_BASE}/api/role`, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         const data = await res.json()
//         if (!res.ok) throw new Error(data.message || 'Failed to fetch roles')
//         setRoles(data.data || [])
//       } catch (err: unknown) {
//         if (err instanceof Error) setErrorMsg(err.message)
//       }
//     }
//     fetchRoles()
//   }, [API_BASE, token])

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { id, value, type, checked } = e.target
//     setForm(prev => ({
//       ...prev,
//       [id]: type === 'checkbox' ? checked : value,
//     }))
//     setErrors(prev => ({ ...prev, [id]: '' }))
//   }

//   const handleSelectRole = (role: Role) => {
//     setForm(prev => ({ ...prev, roleId: role.id }))
//     setErrors(prev => ({ ...prev, roleId: '' }))
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)
//     setSuccessMsg(null)
//     setErrorMsg(null)

//     try {
//       await userSchema.validate(form, { abortEarly: false })

//       const payload = {
//         name: form.name,
//         email: form.email,
//         password: form.password,
//         status: form.status,
//         roleId: form.roleId,
//       }

//       const res = await fetch(`${API_BASE}/api/register`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       })

//       const data = await res.json()
//       if (!res.ok) throw new Error(data.message || 'Failed to create user')

//       setSuccessMsg('✅ User created successfully!')
//       setForm({ status: true, name: '', email: '', password: '', roleId: null })
//       setErrors({})
//     } catch (err: unknown) {
//       if (err instanceof Yup.ValidationError) {
//         const fieldErrors: Record<string, string> = {}
//         err.inner.forEach(e => {
//           if (e.path) fieldErrors[e.path] = e.message
//         })
//         setErrors(fieldErrors)
//       } else if (err instanceof Error) {
//         setErrorMsg(err.message || 'An unexpected error occurred')
//       }
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-xl mx-auto mt-10">
//       {/* Header */}
//       <div className="flex justify-between items-center border-b pb-3">
//         <p className="text-xl font-semibold">Create User</p>
//         <Button to={routePaths.USERS} asLink>Back</Button>
//       </div>

//       {/* Messages */}
//       {successMsg && <p className="text-green-600 font-medium">{successMsg}</p>}
//       {errorMsg && <p className="text-red-600 font-medium">{errorMsg}</p>}

//       {/* Active Status */}
//       <GroupInput>
//         <Label htmlFor="status">Active Status</Label>
//         <ToggleButton id="status" checked={form.status} onChange={handleChange} />
//       </GroupInput>

//       {/* Full Name */}
//       <GroupInput>
//         <Label htmlFor="name" required="true">Full Name</Label>
//         <Input id="name" placeholder="Enter full name" value={form.name} onChange={handleChange} />
//         {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
//       </GroupInput>

//       {/* Email */}
//       <GroupInput>
//         <Label htmlFor="email" required="true">Email</Label>
//         <Input id="email" placeholder="Enter email" value={form.email} onChange={handleChange} />
//         {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
//       </GroupInput>

//       {/* Password */}
//       <GroupInput>
//         <Label htmlFor="password" required="true">Password</Label>
//         <Input id="password" type="password" placeholder="Enter password" value={form.password} onChange={handleChange} />
//         {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
//       </GroupInput>

//       {/* Role Dropdown */}
//       <GroupInput>
//         <Label required="true">Role</Label>
//         <Dropdown
//           options={roles.map(r => ({ id: r.id, name: r.name }))}
//           selected={form.roleId ? roles.find(r => r.id === form.roleId) || null : null}
//           placeholder="Select Role"
//           onSelect={option => handleSelectRole({ id: Number(option.id), name: option.name })}
//         />
//         {errors.roleId && <p className="text-red-600 text-sm">{errors.roleId}</p>}
//       </GroupInput>

//       {/* Submit Button */}
//       <div className="mt-5">
//         <Button type="submit" disabled={isLoading}>
//           {isLoading ? 'Creating...' : 'Create User'}
//         </Button>
//       </div>
//     </form>
//   )
// }

// export default CreateUser



const CreateUser = () => {
  return (
    <div>CreateUser</div>
  )
}

export default CreateUser