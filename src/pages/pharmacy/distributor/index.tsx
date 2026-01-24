import Button from "../../../components/button/Button"
import { Input } from "../../../components/input/Input"
import { routePaths } from "../../../constants/routePaths"

const Distributor = () => {
  return (
       <div className="flex flex-col gap-10 relative">
      {/* Header */}
      <div className="flex justify-between items-center w-full border-b pb-3">
        <p className="text-xl font-semibold">Distributors Management</p>
        <div className="flex items-center gap-5 min-w-100">
          {/* Search Input */}
          <div className="flex items-center gap-2 py-1.5 w-full rounded-lg border px-2 border-gray placeholder:text-gray-100 placeholder:font-light">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 20 20"
              id="search"
            >
              <g
                stroke="none"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <g
                  stroke="#000"
                  strokeWidth="2"
                  transform="translate(-1687 -1941)"
                >
                  <g transform="translate(1688 1942)">
                    <circle cx="7.5" cy="7.5" r="7.5"></circle>
                    <path d="M18 18l-5.2-5.2"></path>
                  </g>
                </g>
              </g>
            </svg>
            <Input
              type="text"
              placeholder="Search distributor..."
              variant="none"
              className="outline-none"
 
            />
          </div>

            <Button asLink={true} to={routePaths.ADD_DISTRIBUTOR} >+ Add Distributors</Button>
         
        </div>
      </div>

      {/* Table */}
      <div className="relative overflow-x-auto shadow-lg rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right">
          <thead className="text-xs text-white uppercase bg-dark">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Procedure Name</th>
              <th className="px-6 py-4">Procedure Code</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
       
        </table>
      </div>

      
    </div>
  )
}

export default Distributor