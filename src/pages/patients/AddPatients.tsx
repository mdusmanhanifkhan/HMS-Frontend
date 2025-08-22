import Button from "../../components/button/Button"
import { GroupInput } from "../../components/input/GroupInput"
import { Input } from "../../components/input/Input"
import { Label } from "../../components/input/Label"
import TextArea from "../../components/input/TextArea"

const AddPatients = () => {
  return (
    <>
      <p className="text-3xl font-semibold">New Patient</p>

      <div className="grid min-[1440px]:grid-cols-3 max-w-[1000px] gap-x-3 gap-y-4 mt-6">

        <GroupInput>
          <Label>Full Name</Label>
          <Input placeholder="Enter patient name" />
        </GroupInput>

        <GroupInput>
          <Label>Father / Guardian Name</Label>
          <Input placeholder="Enter father/guardian name" />
        </GroupInput>

         <GroupInput>
          <Label>Gender</Label>
          <div className="flex items-center gap-2">
            {['Male', 'Female', 'Other'].map((g) => (
              <label key={g} className="flex items-center gap-1">
                <input
                  type="radio"
                  name="gender"
                  // checked={form.gender === g}
                  // onChange={() => setForm((p) => ({ ...p, gender: g }))}
                  className="accent-dark"
                />
                <span className="text-sm font-normal">{g}</span>
              </label>
            ))}
          </div>
        </GroupInput>

        <GroupInput>
          <Label>Date of Birth</Label>
          <Input type="date" />
        </GroupInput>

        <GroupInput>
          <Label>Age</Label>
          <Input placeholder="Years" />
        </GroupInput>

        <GroupInput>
          <Label>Marital Status</Label>
          <Input placeholder="Single / Married / Other" />
        </GroupInput>

        <GroupInput>
          <Label>Blood Group</Label>
          <Input placeholder="A+, B-, O+, etc." />
        </GroupInput>

        {/* Contact Info */}
        <GroupInput>
          <Label>Phone Number</Label>
          <Input placeholder="03XX-XXXXXXX" />
        </GroupInput>

        <GroupInput>
          <Label>CNIC / ID Card No.</Label>
          <Input placeholder="XXXXX-XXXXXXX-X" />
        </GroupInput>

        <GroupInput className="col-span-2">
          <Label>Address</Label>
          <TextArea placeholder="Enter full address" />
        </GroupInput>
        <div className="col-span-full mx-auto" >
          <Button>
            Add patient
          </Button>
        </div>
      </div>
    </>
  )
}

export default AddPatients
