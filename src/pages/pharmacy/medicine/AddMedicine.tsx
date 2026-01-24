import { Label } from '../../../components/input/Label'
import Button from '../../../components/button/Button'
import { routePaths } from '../../../constants/routePaths'
import { GroupInput } from '../../../components/input/GroupInput'
import ToggleButton from '../../../components/button/ToggleButton'
import { Input } from '../../../components/input/Input'
import TextArea from '../../../components/input/TextArea'

export default function AddMedicine() {
  return (
    <form className="flex flex-col gap-10">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-3">
        <p className="text-xl font-semibold w-full">Add Medicine</p>
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

      <div className="grid grid-cols-3 gap-4 max-w-[1100px]">
        {/* Status */}
        <GroupInput className="col-span-full">
          <Label>Status</Label>
          <ToggleButton id="isActive" />
        </GroupInput>

        {/* BASIC INFO */}
        <GroupInput>
          <Label>Medicine Name</Label>
          <Input placeholder="Enter Medicine Name" />
        </GroupInput>

        <GroupInput>
          <Label>Generic Name</Label>
          <Input placeholder="Enter Generic Name" />
        </GroupInput>

        <GroupInput>
          <Label>Company</Label>
        </GroupInput>

        <GroupInput>
          <Label>Category / Form</Label>
        </GroupInput>

        <GroupInput>
          <Label>Unit / Packing</Label>
          <Input placeholder="e.g., 10x10, 120ml, 1x20" />
        </GroupInput>

        <GroupInput className="col-span-full">
          <Label>Description</Label>
          <TextArea placeholder="Optional notes about medicine" />
        </GroupInput>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-4">
        <Button type="submit">Save Medicine</Button>
        <Button type="reset">Clear</Button>
      </div>
    </form>
  )
}
