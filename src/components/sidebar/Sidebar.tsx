import { SidebarRoutes } from '../../routes/routes'
import { NavLink } from 'react-router-dom'

interface RouteItem {
  name: string
  link: string
  permission?: string
}

export const Sidebar = () => {
  const storedUser = localStorage.getItem("user")

  // Safe parse: handles null
  let role: Record<string, boolean> = {}

  if (storedUser) {
    const parsed = JSON.parse(storedUser)
    role = parsed?.user?.role || {}
  }

  const filteredRoutes = SidebarRoutes.filter((route: RouteItem) => {
    if (!route.permission) return true
    return role[route.permission] === true
  })

  return (
    <aside>
      <ul className="space-y-3">
        {filteredRoutes.map((elem: RouteItem, index: number) => (
          <NavLink
            key={index}
            to={elem.link}
            className={({ isActive }) =>
              `${isActive ? 'text-red' : 'text-white'} px-3 border-[#353635] py-2 cursor-pointer hover:text-red transition-all duration-300 flex items-center gap-2 border-b`
            }
          >
            <svg className="w-[15px] h-[15px]" viewBox="0 0 12 12" fill="none">
              <use href="/assets/svg/dashboard-icon.svg#dashboard-icon" />
            </svg>
            {elem.name}
          </NavLink>
        ))}
      </ul>
    </aside>
  )
}
