// pages/pharmacy/Supplier.tsx
import { useEffect, useState } from "react";
import Button from "../../../components/button/Button";
import { Input } from "../../../components/input/Input";
import { routePaths } from "../../../constants/routePaths";
import { Link } from "react-router-dom";
import Loading from "../../../components/loading/Loading";

interface CompanyType {
  id: number;
  name: string;
}

interface SupplierType {
  id: number;
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  city?: string;
  country?: string;
  openingBalance?: number;
  creditLimit?: number;
  paymentTerms?: string;
  isActive: boolean;
  companies?: CompanyType[];
}

const Supplier = () => {
  const [suppliers, setSuppliers] = useState<SupplierType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_BASE}/api/supplier`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (res.status === 401 || res.status === 403) {
        throw new Error("Unauthorized. Please login again.");
      }

      if (!res.ok) {
        throw new Error("Failed to fetch suppliers");
      }

      const data = await res.json();
      setSuppliers(data.data || []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const filteredSuppliers = suppliers.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-10 relative">
      {/* Header */}
      <div className="flex justify-between items-center w-full border-b pb-3">
        <p className="text-xl font-semibold">Suppliers Management</p>
        <div className="flex items-center gap-5 min-w-100">
          {/* Search Input */}
          <div className="flex items-center gap-2 py-1.5 w-full rounded-lg border px-2 border-gray">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 20 20"
            >
              <g stroke="none" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <g stroke="#000" strokeWidth="2" transform="translate(-1687 -1941)">
                  <g transform="translate(1688 1942)">
                    <circle cx="7.5" cy="7.5" r="7.5"></circle>
                    <path d="M18 18l-5.2-5.2"></path>
                  </g>
                </g>
              </g>
            </svg>

            <Input
              type="text"
              placeholder="Search supplier..."
              variant="none"
              className="outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Button asLink={true} to={routePaths.ADD_SUPPLIER}>
            + Add Supplier
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="relative overflow-x-auto shadow-lg rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-white uppercase bg-dark">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Contact Person</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">City</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={8}>
                  <div className="flex justify-center py-4">
                    <Loading />
                  </div>
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={8} className="py-4 text-center text-red-500">
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && filteredSuppliers.length === 0 && (
              <tr>
                <td colSpan={8} className="py-6 text-center">
                  No suppliers found.
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              filteredSuppliers.length > 0 &&
              filteredSuppliers.map((sup) => (
                <tr key={sup.id} className="bg-[#DFDEDE] border-b border-gray-200">
                  <td className="px-6 py-4 font-medium text-gray-900">{sup.id}</td>
                  <td className="px-6 py-4">{sup.name}</td>
                  <td className="px-6 py-4">{sup.contactPerson || "-"}</td>
                  <td className="px-6 py-4">{sup.phone || "-"}</td>
                  <td className="px-6 py-4">{sup.email || "-"}</td>
                  <td className="px-6 py-4">{sup.city || "-"}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <span
                        className={`w-[10px] h-[10px] rounded-full ${
                          sup.isActive ? "bg-[#00cc00]" : "bg-[#cc0000]"
                        } block`}
                      ></span>
                      {sup.isActive ? "Active" : "Inactive"}
                    </div>
                  </td>
                  <td className="px-6 py-4 flex items-center gap-2">
                    {/* Edit */}
                    <Link
                      to={`${routePaths.EDIT_SUPPLIER}/${sup.id}`}
                      className="bg-dark p-1 rounded-md group hover:bg-white border border-dark transition-all ease-linear duration-200"
                    >
                      <svg
                        className="w-[18px] h-[18px] text-white group-hover:text-dark"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <use href="/assets/svg/edit-icon.svg#edit-icon" />
                      </svg>
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Supplier;