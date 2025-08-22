import { SidebarRoutes } from '../../routes/routes.ts'
import { Link } from 'react-router-dom'

interface RouteItem {
  name: string
  link: string
}

export const Sidebar = () => {
  return (
    <aside>
      <ul className="px-3">
        {SidebarRoutes.map((elem: RouteItem, index: number) => (
          <li
            key={index}
            className="text-white py-2 cursor-pointer hover:text-red transition-all ease-linear duration-300 flex items-center gap-2"
          >
            <svg className='w-[15px] h-[15px] text-white' viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <use href='/assets/svg/dashboard-icon.svg#dashboard-icon' />
            </svg>
            <Link to={elem.link}>{elem.name}</Link>
          </li>
        ))}
      </ul>
    </aside>
  )
}
