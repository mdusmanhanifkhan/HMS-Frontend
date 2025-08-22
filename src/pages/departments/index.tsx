import { Link } from "react-router-dom";
import Button from "../../components/button/Button";
import { routePaths } from "../../constants/routePaths";
import { useEffect, useState } from "react";

const Departments = () => {
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:3000/api/department", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          signal: controller.signal,
        });

        if (!res.ok) throw new Error(`Error: ${res.status}`);

        const data = await res.json();
        setDepartments(data.data || []);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.message || "Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();

    return () => controller.abort();
  }, []);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-between items-center w-full border-b pb-3">
        <p className="text-xl font-semibold">Department Management</p>
        <Link to={routePaths.ADD_DEPARTMENT}>
          <Button>+ Add Department</Button>
        </Link>
      </div>

      {loading ? (
        <p>Loading departments...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="relative overflow-x-auto shadow-lg rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right">
            <thead className="text-xs text-white uppercase bg-dark">
              <tr>
                <th scope="col" className="px-6 py-3">ID</th>
                <th scope="col" className="px-6 py-3">Department Name</th>
                <th scope="col" className="px-6 py-3">Short Code</th>
                <th scope="col" className="px-6 py-3">Description</th>
                <th scope="col" className="px-6 py-3">Location</th>
                <th scope="col" className="px-6 py-3">Timings</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {departments.length > 0 ? (
                departments.map((dept, index) => (
                  <tr
                    key={dept.id}
                    className="bg-[#DFDEDE] border-b border-gray-200"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {dept.id}
                    </td>
                    <td className="px-6 py-4">{dept.name}</td>
                    <td className="px-6 py-4">{dept.shortCode || "-"}</td>
                    <td className="px-6 py-4">{dept.description || "-"}</td>
                    <td className="px-6 py-4">{dept.location || "-"}</td>
                    <td className="px-6 py-4">
                      {dept.timeFrom && dept.timeTo
                        ? `${dept.timeFrom} - ${dept.timeTo}`
                        : "-"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <span
                          className={`w-[10px] h-[10px] rounded-full ${
                            dept.status ? "bg-[#00cc00]" : "bg-[#cc0000]"
                          } block`}
                        ></span>
                        {dept.status ? "Active" : "Inactive"}
                      </div>
                    </td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      {/* Edit Button */}
                      <button className="bg-dark p-1 rounded-md group hover:bg-white border border-dark transition-all">
                        <svg
                          className="w-[18px] h-[18px] text-white group-hover:text-dark"
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <use href="/assets/svg/edit-icon.svg#edit-icon" />
                        </svg>
                      </button>

                      {/* View Button */}
                      <button className="bg-dark p-1 rounded-md group hover:bg-white border border-dark transition-all">
                        <svg
                          className="w-[18px] h-[18px] text-white group-hover:text-dark"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 8 8"
                        >
                          <use href="/assets/svg/eye-icon.svg#eye-icon" />
                        </svg>
                      </button>

                      {/* Delete Button */}
                      <button className="bg-dark p-1 rounded-md group hover:bg-white border border-dark transition-all">
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
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-6 text-gray-500"
                  >
                    No departments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Departments;
