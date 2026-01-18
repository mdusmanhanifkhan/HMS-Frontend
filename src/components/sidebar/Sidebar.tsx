import type { ReactNode } from 'react'
import { usePermissions } from '../../context/PermissionsContext'
import { SidebarRoutes } from '../../routes/routes'
import { NavLink } from 'react-router-dom'

interface RouteItem {
  name: string
  link: string
  permission?: string
  icon?: ReactNode
}

export const Sidebar = () => {
  const { user } = usePermissions()
  
  const filteredRoutes = SidebarRoutes.filter((route: RouteItem) => {
    if (!route.permission) return true
    return user?.role[route.permission] === true
  })

  return (
    <aside>
      <ul className="">
        {filteredRoutes.map((elem: RouteItem, index: number) => (
          <NavLink
            key={index}
            to={elem.link}
            className={({ isActive }) =>
              `${isActive ? 'text-yellow before:absolute before:w-1 before:h-full before:rounded-2xl before:bg-yellow' : 'text-white'}
        border-[#353635] py-3 cursor-pointer
       transition-all duration-300
        border-b relative flex items-center hover:text-yellow `
            }
          >
           <div className='ps-5 flex items-center gap-2 cursor-pointer'>
             {elem.icon && (
              <span className="w-[18px] h-[18px] flex items-center">
                {elem.icon}
              </span>
            )}

            <span>{elem.name}</span>
           </div>
          </NavLink>
        ))}
      </ul>
    </aside>
  )
}
