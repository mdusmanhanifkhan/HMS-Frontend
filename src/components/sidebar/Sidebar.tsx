import { SidebarRoutes } from "../../constants/routes.js";

export const Sidebar = () => {
  return (
    <aside>
      {SidebarRoutes.map((elem, index) => (
        <ul className="px-3" key={index}>
          <li className="text-white py-2 cursor-pointer hover:text-red-800 transition-all ease-linear duration-300">{elem.name}</li>
        </ul>
      ))}
    </aside>
  );
};
