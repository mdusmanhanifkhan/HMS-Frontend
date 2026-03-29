// import { useState } from 'react'
// import { usePermissions } from '../../context/PermissionsContext'
// import { SidebarRoutes } from '../../routes/routes'
// import { NavLink, useLocation } from 'react-router-dom'
// import type { ReactNode } from 'react'

// interface RouteItem {
//   name: string
//   link: string
//   permission?: string
//   icon?: ReactNode
// }

// interface Section {
//   section: string
//   items: RouteItem[]
// }

// export const Sidebar = () => {
//   const { user } = usePermissions()
//   const allowedPermissions: string[] = user?.allowedPermissions || []

//   const [openSections, setOpenSections] = useState<string[]>([])

//   const location = useLocation() // get current route

//   // Toggle section open/close
//   const toggleSection = (sectionName: string) => {
//     setOpenSections((prev) =>
//       prev.includes(sectionName)
//         ? prev.filter((s) => s !== sectionName)
//         : [...prev, sectionName]
//     )
//   }

//   // Filter sections + items
//   const filteredSections: Section[] = SidebarRoutes.map((section: Section) => {
//     const filteredItems = section.items.filter((route: RouteItem) => {
//       if (!route.permission) return true
//       return allowedPermissions.includes(route.permission)
//     })

//     return {
//       ...section,
//       items: filteredItems,
//     }
//   }).filter((section) => section.items.length > 0)

//   return (
//     <aside className="w-full mb-10">
//       {filteredSections.map((section, i) => {
//         // Check if any child route is active
//         const isChildActive = section.items.some((item) =>
//           location.pathname.startsWith(item.link)
//         )

//         // Automatically open section if child is active
//         const isOpen = openSections.includes(section.section) || isChildActive

//         return (
//           <div key={i}>
//             {/* SECTION HEADER */}
//             <div
//               onClick={() => toggleSection(section.section)}
//               className={`flex justify-between items-center px-1 py-3 cursor-pointer border-[#353635] ${
//                 isOpen
//                   ? 'bg-gray-800 text-yellow'
//                   : 'text-gray-300 text-white border-b'
//               }`}
//             >
//               <span className="text-[12px] font-semibold uppercase tracking-wide">
//                 {section.section}
//               </span>

//               {/* Arrow */}
//               <span
//                 className={`transition-transform duration-300 ${
//                   isOpen ? 'rotate-90 text-yellow' : ''
//                 }`}
//               >
//                 <svg
//                   className="transition-transform duration-300 w-4 h-4"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   viewBox="0 0 24 24"
//                 >
//                   <polyline points="9 18 15 12 9 6"></polyline>
//                 </svg>
//               </span>
//             </div>

//             {/* CHILD ITEMS */}
//             {isOpen && (
//               <ul>
//                 {section.items.map((elem, index) => (
//                   <NavLink
//                     key={index}
//                     to={elem.link}
//                     className={({ isActive }) =>
//                       `${
//                         isActive
//                           ? 'text-yellow before:absolute before:w-1 before:h-full before:rounded-2xl before:bg-yellow'
//                           : 'text-white'
//                       }
//                       border-[#353635] py-2 cursor-pointer
//                       transition-all duration-300
//                       border-b relative flex items-center hover:text-yellow`
//                     }
//                   >
//                     <div className="ps-4 flex items-center gap-2">
//                       {elem.icon && (
//                         <span className="w-[18px] h-[18px] flex items-center">
//                           {elem.icon}
//                         </span>
//                       )}
//                       <span className="text-sm">{elem.name}</span>
//                     </div>
//                   </NavLink>
//                 ))}
//               </ul>
//             )}
//           </div>
//         )
//       })}
//     </aside>
//   )
// }



export const Sidebar = () => {
  return (
    <div>Sidebar</div>
  )
}
