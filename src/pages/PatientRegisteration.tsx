import { GroupInput } from "../components/input/GroupInput"
import { Input } from "../components/input/Input"
import { Label } from "../components/input/Label"

const PatientRegisteration = () => {
  return (
    <>
      <p className="text-3xl font-semibold">New Patient</p>

      <div className="grid min-[1440px]:grid-cols-4 gap-x-3 gap-y-4 mt-6">

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
          <Input placeholder="Male / Female / Other" />
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
          <Input placeholder="Enter full address" />
        </GroupInput>

        <GroupInput>
          <Label>Emergency Contact Name</Label>
          <Input placeholder="Enter name" />
        </GroupInput>

        <GroupInput>
          <Label>Emergency Contact Number</Label>
          <Input placeholder="03XX-XXXXXXX" />
        </GroupInput>

        {/* OPD Info */}
        <GroupInput>
          <Label>Department</Label>
          <Input placeholder="Select Department" />
        </GroupInput>

        <GroupInput>
          <Label>Doctor</Label>
          <Input placeholder="Select Doctor" />
        </GroupInput>

        <GroupInput>
          <Label>Visit Type</Label>
          <Input placeholder="New / Follow-up" />
        </GroupInput>

        <GroupInput>
          <Label>Visit Date</Label>
          <Input type="date" />
        </GroupInput>

        <GroupInput>
          <Label>Registration Fee</Label>
          <Input type="number" placeholder="Enter Fee" />
        </GroupInput>

        <GroupInput>
          <Label>Payment Method</Label>
          <Input placeholder="Cash / Card / Other" />
        </GroupInput>

        {/* Medical Info */}
        <GroupInput className="col-span-2">
          <Label>Allergies</Label>
          <Input placeholder="e.g. Penicillin, Dust, etc." />
        </GroupInput>

        <GroupInput className="col-span-2">
          <Label>Medical History</Label>
          <Input placeholder="Enter existing conditions if any" />
        </GroupInput>
      </div>
    </>
  )
}

export default PatientRegisteration
