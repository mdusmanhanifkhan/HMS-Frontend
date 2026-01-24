import { useState } from 'react'
import { Label } from '../../../components/input/Label'
import { GroupInput } from '../../../components/input/GroupInput'
import { Input } from '../../../components/input/Input'
import Button from '../../../components/button/Button'
import TextArea from '../../../components/input/TextArea'

export default function SalesInvoice() {

  const [items, setItems] = useState([
    { medicine: '', batch: '', expiry: '', stockQty: 0, qty: 1, price: 0, discount: 0, total: 0 },
  ])

  const addRow = () => {
    setItems([
      ...items,
      { medicine: '', batch: '', expiry: '', stockQty: 0, qty: 1, price: 0, discount: 0, total: 0 },
    ])
  }

  const removeRow = (index: number) => {
    const data = [...items]
    data.splice(index, 1)
    setItems(data)
  }

  return (
    <form className="flex flex-col gap-10">

      {/* HEADER */}
      <div className="grid grid-cols-4 gap-4 max-w-[1100px]">

        <GroupInput>
          <Label>Invoice No</Label>
          <Input placeholder="Auto" disabled />
        </GroupInput>

        <GroupInput>
          <Label>Date</Label>
          <Input type="date" />
        </GroupInput>

        <GroupInput>
          <Label>Customer Name</Label>
          <Input placeholder="Walk-in / Customer Name" />
        </GroupInput>

        <GroupInput>
          <Label>Doctor Name</Label>
          <Input placeholder="Optional" />
        </GroupInput>

        <GroupInput className="col-span-full">
          <Label>Remarks</Label>
          <TextArea placeholder="Optional notes" />
        </GroupInput>
      </div>

      {/* ITEMS TABLE */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">#</th>
              <th className="p-2 border">Medicine</th>
              <th className="p-2 border">Batch</th>
              <th className="p-2 border">Expiry</th>
              <th className="p-2 border">Stock</th>
              <th className="p-2 border">Qty</th>
              <th className="p-2 border">Sale Price</th>
              <th className="p-2 border">Discount</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>

          <tbody>
            {items.map((row, index) => (
              <tr key={index}>
                <td className="p-2 border">{index + 1}</td>

                {/* Medicine */}
                <td className="p-2 border">
                </td>

                {/* Batch (from stock) */}
                <td className="p-2 border">
                </td>

                <td className="p-2 border">
                  <Input placeholder="07/2026" disabled />
                </td>

                <td className="p-2 border text-center font-semibold">
                  10
                </td>

                {/* Qty */}
                <td className="p-2 border">
                  <Input type="number" min={1} placeholder="Qty" />
                </td>

                {/* Price */}
                <td className="p-2 border">
                  <Input type="number" placeholder="Sale Price" />
                </td>

                {/* Discount */}
                <td className="p-2 border">
                  <Input type="number" placeholder="0" />
                </td>

                {/* Total */}
                <td className="p-2 border">
                  <Input type="number" placeholder="0.00" disabled />
                </td>

                <td className="p-2 border">
                  <Button type="button" onClick={() => removeRow(index)}>
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="p-3">
          <Button type="button" onClick={addRow}>
            + Add Medicine
          </Button>
        </div>
      </div>

      {/* TOTAL SECTION */}
      <div className="grid grid-cols-4 gap-4 max-w-[600px] self-end">

        <GroupInput>
          <Label>Sub Total</Label>
          <Input disabled placeholder="0.00" />
        </GroupInput>

        <GroupInput>
          <Label>Invoice Discount</Label>
          <Input placeholder="0.00" />
        </GroupInput>

        <GroupInput>
          <Label>Net Total</Label>
          <Input disabled placeholder="0.00" />
        </GroupInput>

        <GroupInput>
          <Label>Paid Amount</Label>
          <Input placeholder="0.00" />
        </GroupInput>

        <GroupInput>
          <Label>Balance</Label>
          <Input disabled placeholder="0.00" />
        </GroupInput>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-4">
        <Button type="submit">Save & Print</Button>
        <Button type="reset">Clear</Button>
      </div>

    </form>
  )
}
