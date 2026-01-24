import { Label } from '../../../components/input/Label'
import Button from '../../../components/button/Button'
import { GroupInput } from '../../../components/input/GroupInput'
import { Input } from '../../../components/input/Input'
import Dropdown from '../../../components/input/Dropdown'
import TextArea from '../../../components/input/TextArea'
import { useState } from 'react'
import { routePaths } from '../../../constants/routePaths'

export default function AddInvoice() {
  const [items, setItems] = useState([
    { medicine: '', batch: '', expiry: '', qty: 0, purchasePrice: 0, salesTax: 0, advanceTax: 0, total: 0 },
  ])

  const handleAddItem = () => {
    setItems([...items, { medicine: '', batch: '', expiry: '', qty: 0, purchasePrice: 0, salesTax: 0, advanceTax: 0, total: 0 }])
  }

  const handleRemoveItem = (index: number) => {
    const newItems = [...items]
    newItems.splice(index, 1)
    setItems(newItems)
  }

  return (
    <form className="flex flex-col gap-10">
         <div className="flex justify-between items-center border-b pb-3">
                <p className="text-xl font-semibold w-full">Add Invoice</p>
                <Button to={routePaths.PROCEDURE} asLink>
                  <svg
                    className="w-3.5 h-3.5 -scale-x-100"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 640 640"
                  >
                    <use href="/assets/svg/arrow-icon.svg#arrow-icon" />
                  </svg>
                  Back
                </Button>
              </div>

      {/* Invoice Header */}
      <div className="grid grid-cols-3 gap-4 max-w-[1100px]">
        <GroupInput>
          <Label>Invoice Number</Label>
          <Input placeholder="Auto / Manual" />
        </GroupInput>

        <GroupInput>
          <Label>Invoice Date</Label>
          <Input type='date' />
        </GroupInput>

        <GroupInput>
          <Label>Distributor</Label>
          <Dropdown
            placeholder="Select Distributor"
            options={[
              { id: 'alhabib', name: 'Al-Habib' },
              { id: 'united', name: 'United Distributors' },
              // Fetch from API
            ]}
          />
        </GroupInput>

        <GroupInput>
          <Label>Company</Label>
          <Dropdown
            placeholder="Select Company"
            options={[
              { id: 'getz', name: 'Getz Pharma' },
              { id: 'gsk', name: 'GSK' },
              // Filter by selected distributor
            ]}
          />
        </GroupInput>

        <GroupInput className="col-span-full">
          <Label>Notes / Remarks</Label>
          <TextArea placeholder="Optional notes" />
        </GroupInput>
      </div>

      {/* Invoice Items Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th>Medicine</th>
              <th>Batch</th>
              <th>Expiry</th>
              <th>Qty</th>
              <th>Purchase Price</th>
              <th>Sales Tax</th>
              <th>Advance Tax</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>
                  <Dropdown
                    placeholder="Select Medicine"
                    options={[
                      { id: 'tootsial', name: 'Tootsial 120ml' },
                      { id: 'aria', name: 'Aria 60ml' },
                      // Filter by selected company
                    ]}
                  />
                </td>
                <td><Input placeholder="Batch Number" /></td>
                <td><Input type="month" placeholder="MM/YYYY" /></td>
                <td><Input type="number" placeholder="Qty" /></td>
                <td><Input type="number" placeholder="Purchase Price" /></td>
                <td><Input type="number" placeholder="Sales Tax %" /></td>
                <td><Input type="number" placeholder="Advance Tax %" /></td>
                <td><Input type="number" placeholder="Total" disabled /></td>
                <td>
                  <Button type="button" onClick={() => handleRemoveItem(index)}>Remove</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Button type="button" onClick={handleAddItem}>Add Medicine</Button>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-4">
        <Button type="submit">Save Invoice</Button>
        <Button type="reset">Clear</Button>
      </div>
    </form>
  )
}
