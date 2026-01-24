import { GroupInput } from '../../../components/input/GroupInput'
import { Label } from '../../../components/input/Label'
import { Input } from '../../../components/input/Input'
// import Dropdown from '../../../components/input/Dropdown'
import Button from '../../../components/button/Button'

const Stock = () => {
  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex justify-between items-center border-b pb-3">
        <p className="text-xl font-semibold">Stock / Inventory</p>
      </div>

      {/* FILTER SECTION */}
      <div className="grid grid-cols-4 gap-4 max-w-[1200px] bg-gray-50 p-4 rounded-lg">

        <GroupInput>
          <Label>Company</Label>
          {/* <Dropdown
            placeholder="All Companies"
            options={[
              { id: 'getz', name: 'Getz Pharma' },
              { id: 'gsk', name: 'GSK' },
            ]}
          /> */}
        </GroupInput>

        <GroupInput>
          <Label>Medicine</Label>
          <Input placeholder="Search Medicine Name" />
        </GroupInput>

        <GroupInput>
          <Label>Batch No</Label>
          <Input placeholder="Search Batch" />
        </GroupInput>

        <GroupInput>
          <Label>Expiry Filter</Label>
          {/* <Dropdown
            placeholder="All"
            options={[
              { id: 'normal', name: 'Normal' },
              { id: 'near', name: 'Near Expiry (3 Months)' },
              { id: 'expired', name: 'Expired' },
              { id: 'out', name: 'Out of Stock' },
            ]}
          /> */}
        </GroupInput>

        <div className="col-span-full flex gap-3">
          <Button type="button">Search</Button>
          <Button type="button">Reset</Button>
        </div>
      </div>

      {/* STOCK TABLE */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">#</th>
              <th className="p-2 border">Medicine</th>
              <th className="p-2 border">Company</th>
              <th className="p-2 border">Batch No</th>
              <th className="p-2 border">Expiry</th>
              <th className="p-2 border">Packing</th>
              <th className="p-2 border">Qty In Stock</th>
              <th className="p-2 border">Purchase Price</th>
              <th className="p-2 border">Sale Price</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>

          <tbody>
            {/* Example Row */}
            <tr>
              <td className="p-2 border">1</td>
              <td className="p-2 border">TOOTSIAL WITH MULATHI 120ML</td>
              <td className="p-2 border">FOCUZ</td>
              <td className="p-2 border">24HHH143</td>
              <td className="p-2 border">07/2026</td>
              <td className="p-2 border">120 ML</td>
              <td className="p-2 border text-center font-semibold">10</td>
              <td className="p-2 border">115.00</td>
              <td className="p-2 border">120.00</td>
              <td className="p-2 border">
                <span className="px-2 py-1 rounded bg-green-100 text-green-700">
                  Normal
                </span>
              </td>
            </tr>

            {/* Near Expiry Example */}
            <tr className="bg-yellow-50">
              <td className="p-2 border">2</td>
              <td className="p-2 border">ARIA 60ML SYP</td>
              <td className="p-2 border">XYZ Pharma</td>
              <td className="p-2 border">25J123</td>
              <td className="p-2 border text-red-600 font-semibold">02/2026</td>
              <td className="p-2 border">60 ML</td>
              <td className="p-2 border text-center font-semibold">3</td>
              <td className="p-2 border">95.00</td>
              <td className="p-2 border">110.00</td>
              <td className="p-2 border">
                <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700">
                  Near Expiry
                </span>
              </td>
            </tr>

            {/* Out of Stock Example */}
            <tr className="bg-red-50">
              <td className="p-2 border">3</td>
              <td className="p-2 border">ZOTTER 200MG</td>
              <td className="p-2 border">Getz</td>
              <td className="p-2 border">25L99</td>
              <td className="p-2 border">10/2027</td>
              <td className="p-2 border">1x10</td>
              <td className="p-2 border text-center font-bold text-red-600">0</td>
              <td className="p-2 border">122.00</td>
              <td className="p-2 border">135.00</td>
              <td className="p-2 border">
                <span className="px-2 py-1 rounded bg-red-100 text-red-700">
                  Out of Stock
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default Stock