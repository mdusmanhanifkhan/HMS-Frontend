import { useState, useEffect } from "react";
import Button from "../../components/button/Button";
import { GroupInput } from "../../components/input/GroupInput";
import { Input } from "../../components/input/Input";
import { Label } from "../../components/input/Label";
import TextArea from "../../components/input/TextArea";
import Dropdown from "../../components/input/dropdown";

type Procedure = {
  id: number;
  name: string;
  fee: number;
};

type Doctor = {
  id: number;
  name: string;
  procedures: Procedure[];
};

type Department = {
  id: number;
  name: string;
  doctors: Doctor[];
};

const PatientReceiptGenerator = () => {
  const [form, setForm] = useState({
    fullName: "",
    guardianName: "",
    gender: "",
    dob: "",
    age: "",
    maritalStatus: "",
    bloodGroup: "",
    phone: "",
    cnic: "",
    address: "",
    department: null as Department | null,
    doctor: null as Doctor | null,
    procedure: null as Procedure | null,
    fees: "",
  });

  // Example hierarchy
  const departments: Department[] = [
    {
      id: 1,
      name: "Dental",
      doctors: [
        {
          id: 1,
          name: "Dr. Ahmed",
          procedures: [
            { id: 1, name: "Tooth Extraction", fee: 2000 },
            { id: 2, name: "Root Canal", fee: 5000 },
          ],
        },
        {
          id: 2,
          name: "Dr. Ali",
          procedures: [{ id: 3, name: "Teeth Cleaning", fee: 1500 }],
        },
      ],
    },
    {
      id: 2,
      name: "Ortho",
      doctors: [
        {
          id: 3,
          name: "Dr. Sara",
          procedures: [
            { id: 4, name: "Bone Fracture Checkup", fee: 3000 },
            { id: 5, name: "Joint Replacement", fee: 20000 },
          ],
        },
      ],
    },
    {
      id: 3,
      name: "Eye",
      doctors: [
        {
          id: 4,
          name: "Dr. Bilal",
          procedures: [
            { id: 6, name: "Eye Checkup", fee: 1000 },
            { id: 7, name: "Cataract Surgery", fee: 15000 },
          ],
        },
      ],
    },
  ];

  // Simulate fetching patient info by ID
  useEffect(() => {
    const fetchedPatient = {
      fullName: "Ali Khan",
      guardianName: "Mr. Khan",
      gender: "Male",
      dob: "2000-01-01",
      age: "24",
      maritalStatus: "Single",
      bloodGroup: "O+",
      phone: "0300-1234567",
      cnic: "35202-1234567-1",
      address: "Lahore, Pakistan",
    };

    setForm((prev) => ({
      ...prev,
      ...fetchedPatient,
    }));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleDepartmentSelect = (dep: Department) => {
    setForm((prev) => ({
      ...prev,
      department: dep,
      doctor: null,
      procedure: null,
      fees: "",
    }));
  };

  const handleDoctorSelect = (doc: Doctor) => {
    setForm((prev) => ({
      ...prev,
      doctor: doc,
      procedure: null,
      fees: "",
    }));
  };

  const handleProcedureSelect = (proc: Procedure) => {
    setForm((prev) => ({
      ...prev,
      procedure: proc,
      fees: proc.fee.toString(),
    }));
  };
  
 const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.department || !form.doctor || !form.procedure) {
      alert("Please select department, doctor, and procedure.");
      return;
    }

    setTimeout(() => {
      window.print(); 
    }, 100); 
  };


  return (
    <form onSubmit={handleSubmit}>
      <p className="text-3xl font-semibold">New Patient Receipt</p>

      <div className="grid min-[1440px]:grid-cols-3 max-w-[1000px] gap-x-3 gap-y-4 mt-6">
        {/* Patient info (prefilled) */}
        <GroupInput>
          <Label>Full Name</Label>
          <Input id="fullName" value={form.fullName} onChange={handleChange} />
        </GroupInput>

        <GroupInput>
          <Label>Guardian</Label>
          <Input
            id="guardianName"
            value={form.guardianName}
            onChange={handleChange}
          />
        </GroupInput>

        <GroupInput>
          <Label>Gender</Label>
          <Input id="gender" value={form.gender} onChange={handleChange} />
        </GroupInput>

        <GroupInput>
          <Label>DOB</Label>
          <Input id="dob" type="date" value={form.dob} onChange={handleChange} />
        </GroupInput>

        <GroupInput>
          <Label>Age</Label>
          <Input id="age" value={form.age} onChange={handleChange} />
        </GroupInput>

        <GroupInput>
          <Label>Phone</Label>
          <Input id="phone" value={form.phone} onChange={handleChange} />
        </GroupInput>

        <GroupInput className="col-span-2">
          <Label>Address</Label>
          <TextArea
            id="address"
            value={form.address}
            onChange={handleChange}
          />
        </GroupInput>

        {/* Department */}
        <GroupInput>
          <Label>Department</Label>
          <Dropdown
            options={departments}
            selected={form.department}
            onSelect={handleDepartmentSelect}
            placeholder="Select Department"
          />
        </GroupInput>

        {/* Doctor (filtered by department) */}
        <GroupInput>
          <Label>Doctor</Label>
          <Dropdown
            options={form.department ? form.department.doctors : []}
            selected={form.doctor}
            onSelect={handleDoctorSelect}
            placeholder="Select Doctor"
          />
        </GroupInput>

        {/* Procedure (filtered by doctor) */}
        <GroupInput>
          <Label>Procedure</Label>
          <Dropdown
            options={form.doctor ? form.doctor.procedures : []}
            selected={form.procedure}
            onSelect={handleProcedureSelect}
            placeholder="Select Procedure"
          />
        </GroupInput>

        {/* Fee (auto-filled from procedure) */}
        <GroupInput>
          <Label>Fee</Label>
          <Input id="fees" value={form.fees} readOnly />
        </GroupInput>

        {/* Submit */}
        <div className="col-span-full mx-auto">
          <Button type="submit">Generate Receipt</Button>
        </div>
      </div>
    </form>
  );
};

export default PatientReceiptGenerator;
