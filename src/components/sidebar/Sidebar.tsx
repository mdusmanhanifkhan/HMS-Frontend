import { SidebarRoutes } from '../../routes/routes'
import { NavLink } from 'react-router-dom'

export const Sidebar = () => {

const user = localStorage.getItem("user")
const parsed = JSON.parse(user)

const role = parsed?.user?.role

  const filteredRoutes = SidebarRoutes.filter(route => {
    if (!route.permission) return true; // if no permission required → show
    return role[route.permission] === true;
  });

  return (
    <aside>
      <ul className="space-y-3">
        {filteredRoutes.map((elem, index) => (
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
