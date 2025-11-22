import { SidebarRoutes } from '../../routes/routes.ts'
import { NavLink } from 'react-router-dom'

interface RouteItem {
  name: string
  link: string
}

export const Sidebar = () => {
  return (
    <aside>
      <ul className=" space-y-3">
        {SidebarRoutes.map((elem: RouteItem, index: number) => (
          <NavLink
            key={index}
            to={elem.link}
            className={({ isActive }) =>
              `${isActive ? 'text-red' : 'text-white'}  px-3 border-[#353635] py-2 cursor-pointer hover:text-red transition-all ease-linear duration-300 flex items-center gap-2 border-b`
            }
          >
            <svg
              className="w-[15px] h-[15px]"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <use href="/assets/svg/dashboard-icon.svg#dashboard-icon" />
            </svg>
            {elem.name}
          </NavLink>
        ))}
      </ul>
    </aside>
  )
}
