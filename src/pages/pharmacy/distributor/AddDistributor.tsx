import { Label } from '../../../components/input/Label'
import Button from '../../../components/button/Button'
import { routePaths } from '../../../constants/routePaths'
import { GroupInput } from '../../../components/input/GroupInput'
import ToggleButton from '../../../components/button/ToggleButton'
import { Input } from '../../../components/input/Input'
import TextArea from '../../../components/input/TextArea'

export default function AddDistributor() {
  return (
    <form className="flex flex-col gap-10">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-3">
        <p className="text-xl font-semibold w-full">Add Distributor</p>
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

      {/* FORM */}
      <div className="grid grid-cols-3 gap-4 max-w-[1100px]">

        {/* Status */}
        <GroupInput className="col-span-full">
          <Label>Status</Label>
          <ToggleButton id="isActive" />
        </GroupInput>

        {/* BASIC INFO */}
        <GroupInput>
          <Label>Distributor Name</Label>
          <Input placeholder="Enter Distributor Name" />
        </GroupInput>

        <GroupInput>
          <Label>Contact Person</Label>
          <Input placeholder="Enter Contact Person Name" />
        </GroupInput>

        <GroupInput>
          <Label>Phone</Label>
          <Input placeholder="Enter Phone Number" />
        </GroupInput>

        <GroupInput>
          <Label>Mobile</Label>
          <Input placeholder="Enter Mobile Number" />
        </GroupInput>

        <GroupInput>
          <Label>Email</Label>
          <Input placeholder="Enter Email Address" />
        </GroupInput>

        <GroupInput>
          <Label>Website</Label>
          <Input placeholder="Enter Website (optional)" />
        </GroupInput>

        {/* ADDRESS INFO */}
       <div className='col-span-full grid grid-cols-3 gap-4'>
         <GroupInput className="">
          <Label>Address Line 1</Label>
          <TextArea placeholder="Office Address" />
        </GroupInput>

        <GroupInput className="">
          <Label>Address Line 2</Label>
          <TextArea placeholder="Area / Street" />
        </GroupInput>
       </div>

        <GroupInput>
          <Label>City</Label>
          <Input placeholder="City" />
        </GroupInput>

        <GroupInput>
          <Label>State / Province</Label>
          <Input placeholder="Province / State" />
        </GroupInput>

        <GroupInput>
          <Label>Country</Label>
          <Input placeholder="Pakistan" />
        </GroupInput>

        <GroupInput>
          <Label>Postal Code</Label>
          <Input placeholder="Postal Code" />
        </GroupInput>

        {/* BUSINESS / LEGAL INFO */}
        <GroupInput>
          <Label>NTN Number</Label>
          <Input placeholder="Enter NTN Number" />
        </GroupInput>

        <GroupInput>
          <Label>GST Number</Label>
          <Input placeholder="Enter GST Number" />
        </GroupInput>

        <GroupInput>
          <Label>Drug License No</Label>
          <Input placeholder="Enter Drug License Number" />
        </GroupInput>

        <GroupInput>
          <Label>Registration No</Label>
          <Input placeholder="Company Registration Number" />
        </GroupInput>

        {/* FINANCIAL INFO */}
        <GroupInput>
          <Label>Opening Balance</Label>
          <Input placeholder="0.00" type="number" />
        </GroupInput>

        <GroupInput>
          <Label>Balance Type</Label>
          <Input placeholder="Debit / Credit" />
        </GroupInput>

        <GroupInput>
          <Label>Credit Limit</Label>
          <Input placeholder="Enter Credit Limit" type="number" />
        </GroupInput>

        <GroupInput>
          <Label>Payment Terms</Label>
          <Input placeholder="Cash / 7 Days / 30 Days" />
        </GroupInput>

        <GroupInput>
          <Label>Bank Name</Label>
          <Input placeholder="Enter Bank Name" />
        </GroupInput>

        <GroupInput>
          <Label>Bank Account No</Label>
          <Input placeholder="Enter Account Number" />
        </GroupInput>

        <GroupInput>
          <Label>IBAN</Label>
          <Input placeholder="Enter IBAN (optional)" />
        </GroupInput>

          <GroupInput className="col-span-full">
          <Label>Companies Supplied</Label>
        </GroupInput>

        {/* REMARKS */}
        <GroupInput className="col-span-full">
          <Label>Remarks</Label>
          <TextArea placeholder="Any notes about distributor" />
        </GroupInput>

      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-4">
        <Button type="submit">Save Distributor</Button>
        <Button type="reset">Clear</Button>
      </div>
    </form>
  )
}
