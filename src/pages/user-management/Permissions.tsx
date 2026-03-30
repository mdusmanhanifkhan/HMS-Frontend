// import { useEffect, useState } from 'react'
// import { Link } from 'react-router-dom'
// import Button from '../../components/button/Button'
// import { routePaths } from '../../constants/routePaths'
// import Loading from '../../components/loading/Loading'
// import { Input } from '../../components/input/Input'

// /* ================= TYPES ================= */

// interface Role {
//   id: number
//   name: string
// }

// interface Permission {
//   id: number
//   name: string
//   description: string
//   assigned?: boolean
// }

// interface User {
//   id: number
//   name: string
//   email: string
//   role?: Role
//   status: boolean
//   permissions?: Permission[]
// }

// interface ApiResponse {
//   success: boolean
//   users: User[]
// }

// /* ================= COMPONENT ================= */

// const Permissions: React.FC = () => {
//   const [users, setUsers] = useState<User[]>([])
//   const [permissions, setPermissions] = useState<Permission[]>([])
//   const [loading, setLoading] = useState<boolean>(false)
//   const [error, setError] = useState<string | null>(null)
//   const [searchTerm, setSearchTerm] = useState<string>('')
//   const [debouncedSearch, setDebouncedSearch] = useState<string>('')

//   const API_BASE = import.meta.env.VITE_API_BASE_URL
//   const token = localStorage.getItem('token')

//   /* ================= DEBOUNCE ================= */
//   useEffect(() => {
//     const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500)
//     return () => clearTimeout(timer)
//   }, [searchTerm])

//   /* ================= FETCH USERS ================= */
//   useEffect(() => {
//     const controller = new AbortController()
//     const fetchUsers = async () => {
//       if (!token) return setError('Authentication token missing')
//       try {
//         setLoading(true)
//         setError(null)

//         // Fetch users
//         let url = `${API_BASE}/api/users`
//         if (debouncedSearch.trim()) {
//           url = `${API_BASE}/api/users/search?query=${encodeURIComponent(
//             debouncedSearch
//           )}`
//         }
//         const userRes = await fetch(url, {
//           headers: { Authorization: `Bearer ${token}` },
//           signal: controller.signal,
//         })
//         if (!userRes.ok) throw new Error('Failed to fetch users')
//         const userData: ApiResponse = await userRes.json()

//         // Fetch permissions
//         const permRes = await fetch(`${API_BASE}/api/permissions`, {
//           headers: { Authorization: `Bearer ${token}` },
//           signal: controller.signal,
//         })
//         if (!permRes.ok) throw new Error('Failed to fetch permissions')
//         const permData: Permission[] = await permRes.json()
        
//         // Map permissions for each user
//         const usersWithPermissions = userData.users.map(user => {
//           const assignedPerms = permData.map(p => ({
//             ...p,
//             assigned: p.roles.some(r => r.roleId === user.role?.id)
//           }))
//           return { ...user, permissions: assignedPerms }
//         })

//         setUsers(usersWithPermissions)
//         setPermissions(permData)
//       } catch (err: unknown) {
//         if (err instanceof Error && err.name !== 'AbortError') {
//           setError(err.message)
//         }
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchUsers()
//     return () => controller.abort()
//   }, [debouncedSearch, token])

//   /* ================= TOGGLE PERMISSION ================= */
//   const togglePermission = async (
//     userId: number,
//     permissionName: string,
//     assigned: boolean
//   ) => {
//     if (!token) return
//     try {
//       setLoading(true)
//       const res = await fetch(`${API_BASE}/api/users/${userId}/permissions`, {
//         method: 'POST',
//         headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
//         body: JSON.stringify({ permission: permissionName, assigned }),
//       })
//       if (!res.ok) throw new Error('Failed to update permission')

//       // Update local state
//       setUsers(prev =>
//         prev.map(u =>
//           u.id === userId
//             ? {
//                 ...u,
//                 permissions: u.permissions?.map(p =>
//                   p.name === permissionName ? { ...p, assigned } : p
//                 ),
//               }
//             : u
//         )
//       )
//     } catch (err: unknown) {
//       if (err instanceof Error) setError(err.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   /* ================= UI ================= */
//   return (
//     <div className="flex flex-col gap-10">
//       <div className="flex justify-between items-center border-b pb-3">
//         <p className="text-xl font-semibold">Permission Management</p>
//         <div className="flex gap-4 min-w-[400px]">
//           <div className="flex items-center border rounded-lg px-2 w-full">
//             <Input
//               type="text"
//               placeholder="Search user..."
//               variant="none"
//               className="outline-none w-full"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//           <Link to={routePaths.CREATE_PERMISSION}>
//             <Button>+ Create Permission</Button>
//           </Link>
//         </div>
//       </div>

//       <div className="overflow-x-auto shadow rounded-lg">
//         <table className="w-full text-sm">
//           <thead className="bg-dark text-white">
//             <tr>
//               <th className="text-start px-6 py-3">ID</th>
//               <th className="text-start px-6 py-3">Name</th>
//               <th className="text-start px-6 py-3">Email</th>
//               <th className="text-start px-6 py-3">Role</th>
//               <th className="text-start px-6 py-3">Status</th>
//               <th className="text-start px-6 py-3">Permissions</th>
//               <th className="text-start px-6 py-3">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan={7} className="text-center py-6">
//                   <Loading />
//                 </td>
//               </tr>
//             ) : error ? (
//               <tr>
//                 <td colSpan={7} className="text-red-500 text-center py-6">{error}</td>
//               </tr>
//             ) : users.length === 0 ? (
//               <tr>
//                 <td colSpan={7} className="text-center py-6 text-gray-500">No users found</td>
//               </tr>
//             ) : (
//               users.map(user => (
//                 <tr key={user.id} className="border-b bg-gray-50">
//                   <td className="px-6 py-4">{user.id}</td>
//                   <td className="px-6 py-4">{user.name}</td>
//                   <td className="px-6 py-4">{user.email}</td>
//                   <td className="px-6 py-4">{user.role?.name || '-'}</td>
//                   <td className="px-6 py-4">
//                     <span className={`px-2 py-1 rounded text-xs ${user.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
//                       {user.status ? 'Active' : 'Inactive'}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 flex flex-wrap gap-2 max-w-80">
//                     {user.permissions?.map(p => (
//                       <label key={p.name} className="flex items-center gap-1">
                        
//                         * {p.name}
//                       </label>
//                     ))}
//                   </td>
//                   <td className="px-6 py-4 ">
//                     <Button>Delete</Button>
//                   </td>
                  
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   )
// }

// export default Permissions