import { SidebarRoutes } from "../../routes/routes.ts";
import { Link } from "react-router-dom";

interface RouteItem {
  name: string;
  link: string;
}

export const Sidebar = () => {
  return (
    <aside>
      <ul className="px-3">
        {SidebarRoutes.map((elem: RouteItem, index: number) => (
          <li
            key={index}
            className="text-white py-2 cursor-pointer hover:text-red transition-all ease-linear duration-300"
          >
            <Link to={elem.link}>{elem.name}</Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};
