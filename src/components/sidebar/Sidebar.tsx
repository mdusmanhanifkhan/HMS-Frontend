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
console.log(user)
  const filteredRoutes = SidebarRoutes.filter((route: RouteItem) => {
    if (!route.permission) return true
    return user?.role[route.permission] === true
  })

  return (
    <aside>
      <ul className="space-y-3">
        {filteredRoutes.map((elem: RouteItem, index: number) => (
          <NavLink
            key={index}
            to={elem.link}
            className={({ isActive }) =>
              `${isActive ? 'text-red' : 'text-white'}
       px-3 border-[#353635] py-2 cursor-pointer
       hover:text-red transition-all duration-300
       flex items-center gap-2 border-b`
            }
          >
            {elem.icon && (
              <span className="w-[18px] h-[18px] flex items-center">
                {elem.icon}
              </span>
            )}

            <span>{elem.name}</span>
          </NavLink>
        ))}
      </ul>
    </aside>
  )
}
