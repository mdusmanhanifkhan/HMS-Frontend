import { Link } from "react-router-dom";
import Button from "../../components/button/Button";
import { routePaths } from "../../constants/routePaths";
import { useEffect, useState } from "react";

const Departments = () => {
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<any>(null);

  // fetch departments
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

  // delete department
  const handleDelete = async () => {
    if (!selectedDept) return;
    try {
      const res = await fetch(
        `http://localhost:3000/api/department/${selectedDept.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error(`Failed to delete department`);

      // remove from state
      setDepartments((prev) =>
        prev.filter((dept) => dept.id !== selectedDept.id)
      );
    } catch (err: any) {
      alert(err.message || "Something went wrong while deleting");
    } finally {
      setIsModalOpen(false);
      setSelectedDept(null);
    }
  };

  return (
    <>
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">
              Confirm Delete
            </h2>
            <p className="mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{selectedDept?.name}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded bg-gray hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded bg-red text-white hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
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
                  <th scope="col" className="px-6 py-3">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Department Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Short Code
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Timings
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {departments.length > 0 ? (
                  departments.map((dept) => (
                    <tr
                      key={dept.id}
                      className="bg-[#DFDEDE] border-b border-gray-200"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {dept.id}
                      </td>
                      <td className="px-6 py-4">{dept.name}</td>
                      <td className="px-6 py-4">
                        {dept.shortCode || "-"}
                      </td>
                      <td className="px-6 py-4">
                        {dept.description.length > 64
                          ? `${dept.description.substring(0, 64)}...`
                          : dept.description || "-"}
                      </td>
                      <td className="px-6 py-4">
                        {dept.location || "-"}
                      </td>
                      <td className="px-6 py-4">
                        {dept.timeFrom && dept.timeTo
                          ? `${dept.timeFrom} - ${dept.timeTo}`
                          : "-"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <span
                            className={`w-[10px] h-[10px] rounded-full ${
                              dept.status
                                ? "bg-[#00cc00]"
                                : "bg-[#cc0000]"
                            } block`}
                          ></span>
                          {dept.status ? "Active" : "Inactive"}
                        </div>
                      </td>
                      <td className="px-6 py-4 flex items-center gap-2">
                        {/* Edit Button */}
                        <Link to={`${routePaths.EDIT_DEPARTMENT}/${dept.id}`}  className="bg-dark p-1 rounded-md group hover:bg-white border border-dark transition-all cursor-pointer">
                          <svg
                            className="w-[18px] h-[18px] text-white group-hover:text-dark"
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <use href="/assets/svg/edit-icon.svg#edit-icon" />
                          </svg>
                        </Link>

                        {/* View Button */}
                        <button className="bg-dark p-1 rounded-md group hover:bg-white border border-dark transition-all cursor-pointer">
                          <svg
                            className="w-[18px] h-[18px] text-white group-hover:text-dark"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 8 8"
                          >
                            <use href="/assets/svg/eye-icon.svg#eye-icon" />
                          </svg>
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => {
                            setSelectedDept(dept);
                            setIsModalOpen(true);
                          }}
                          className="bg-dark p-1 rounded-md group hover:bg-white border border-dark transition-all cursor-pointer"
                        >
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
    </>
  );
};

export default Departments;
