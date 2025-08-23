import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/button/Button";
import { routePaths } from "../../constants/routePaths";

interface Department {
  id: number;
  name: string;
}

interface Procedure {
  id: number;
  procedureName: string;
  shortCode: string;
  description: string;
  status: boolean;
  department: Department;
}

const Procedures = () => {
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(true);

 const API_BASE = import.meta.env.VITE_API_BASE_URL

  useEffect(() => {
    const fetchProcedures = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/procedures`);
        const data = await res.json();
        setProcedures(data.data || []); // assuming API returns { success, data }
      } catch (error) {
        console.error("Error fetching procedures:", error);
        setProcedures([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProcedures();
  }, []);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-between items-center w-full border-b pb-3">
        <p className="text-xl font-semibold">Procedure Management</p>
        <Link to={routePaths.ADD_PROCEDURE}>
          <Button>+ Add Procedure</Button>
        </Link>
      </div>

      <div className="relative overflow-x-auto shadow-lg rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right">
          <thead className="text-xs text-white uppercase bg-dark">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Procedure Name</th>
              <th className="px-6 py-3">Procedure Code</th>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center">
                  Loading procedures...
                </td>
              </tr>
            ) : procedures.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  No procedures found.
                </td>
              </tr>
            ) : (
              procedures.map((proc) => (
                <tr
                  key={proc.id}
                  className="bg-[#DFDEDE] border-b border-gray-200"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {proc.id}
                  </td>
                  <td className="px-6 py-4">{proc.name}</td>
                  <td className="px-6 py-4">{proc.shortCode}</td>
                  <td className="px-6 py-4">{proc.department?.name}</td>
                  <td className="px-6 py-4">{proc.description}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <span
                        className={`w-[10px] h-[10px] rounded-full ${
                          proc.status ? "bg-[#00cc00]" : "bg-[#cc0000]"
                        } block`}
                      ></span>
                      {proc.status ? "Active" : "Inactive"}
                    </div>
                  </td>
                  <td className="px-6 py-4 flex items-center gap-2">
                    {/* Edit */}
                    <Link to={`${routePaths.EDIT_PROCEDURE}/${proc.id}`} className="bg-dark p-1 rounded-md group hover:bg-white border border-dark transition-all ease-linear duration-200">
                      <svg
                        className="w-[18px] h-[18px] text-white group-hover:text-dark"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <use href="/assets/svg/edit-icon.svg#edit-icon" />
                      </svg>
                    </Link>

                    {/* View */}
                    <button className="bg-dark p-1 rounded-md group hover:bg-white border border-dark transition-all ease-linear duration-200">
                      <svg
                        className="w-[18px] h-[18px] text-white group-hover:text-dark"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 8 8"
                      >
                        <use href="/assets/svg/eye-icon.svg#eye-icon" />
                      </svg>
                    </button>

                    {/* Delete */}
                    <button className="bg-dark p-1 rounded-md group hover:bg-white border border-dark transition-all ease-linear duration-200">
                      <svg
                        className="w-[18px] h-[18px] text-white group-hover:text-[#cc0000]"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <use href="/assets/svg/delete-icon.svg#delete-icon" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Procedures;



