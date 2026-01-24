import { Label } from '../../../components/input/Label'
import Button from '../../../components/button/Button'
import { routePaths } from '../../../constants/routePaths'
import { GroupInput } from '../../../components/input/GroupInput'
import ToggleButton from '../../../components/button/ToggleButton'
import { Input } from '../../../components/input/Input'

export default function AddCompany() {
  return (
    <form className="flex flex-col gap-10">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-3">
        <p className="text-xl font-semibold w-full">Add Medicine Company</p>
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

        {/* LINK DISTRIBUTOR */}
        {/* <GroupInput className="col-span-full">
          <Label>Distributor</Label>
          <Dropdown placeholder="Select Distributor" />
        </GroupInput> */}

        {/* BASIC COMPANY INFO */}
        <GroupInput>
          <Label>Company Name</Label>
          <Input placeholder="Enter Company Name" />
        </GroupInput>

        <GroupInput>
          <Label>Company Code</Label>
          <Input placeholder="Short Code (optional)" />
        </GroupInput>

        <GroupInput>
          <Label>Contact Person</Label>
          <Input placeholder="Contact Person Name" />
        </GroupInput>

        <GroupInput>
          <Label>Phone</Label>
          <Input placeholder="Phone Number" />
        </GroupInput>

        <GroupInput>
          <Label>Email</Label>
          <Input placeholder="Email Address" />
        </GroupInput>

        {/* LEGAL / REGULATORY INFO */}
        <GroupInput>
          <Label>Drug Registration No</Label>
          <Input placeholder="DRAP Registration Number" />
        </GroupInput>

        <GroupInput>
          <Label>Manufacturing License No</Label>
          <Input placeholder="Manufacturing License Number" />
        </GroupInput>

        <GroupInput>
          <Label>NTN Number</Label>
          <Input placeholder="NTN Number" />
        </GroupInput>

        <GroupInput>
          <Label>GST Number</Label>
          <Input placeholder="GST Number" />
        </GroupInput>

        {/* REMARKS */}
        <GroupInput className="col-span-full">
          <Label>Remarks</Label>
          <Input placeholder="Any notes about company" />
        </GroupInput>

      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-4">
        <Button type="submit">Save Company</Button>
        <Button type="reset">Clear</Button>
      </div>
    </form>
  )
}
