import * as yup from 'yup'

export const doctorSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  guardianName: yup.string(),
  gender: yup.string().required('Gender is required'),
  dateOfBirth: yup.string(),
  age: yup
    .number()
    .required('Age is required')
    .min(1, 'Age must be at least 1'),
  idCard: yup.string().required('CNIC / ID Card is required'),
  phoneNumber: yup.string().required('Mobile Number is required'),
  email: yup.string().email().required('Email is required'),
  address: yup.string(),
  specialization: yup.string(),
  qualification: yup.string(),
  subSpecialities: yup.string(),
  experience: yup.number().typeError('Experience must be a number'),
  languages: yup.string(),
  joinDate: yup.string().required('Joining Date is required'),
  departmentIds: yup
    .array()
    .min(1, 'At least one department must be selected'),
  employmentType: yup
    .string()
    .nullable()
    .required('Employment Type is required'),
  availableDays: yup
    .array()
    .min(1, 'At least one day must be selected'),
  timingFrom: yup.string(),
  timingTo: yup.string(),
  shiftType: yup
    .string()
    .nullable()
    .required('Shift Type is required'),
  maxPatients: yup
    .number()
    .required('Max patients is required')
    .min(1, 'At least 1 patient per day'),
})
