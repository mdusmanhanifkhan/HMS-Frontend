import { createBrowserRouter } from 'react-router-dom'
import App from '../App.js'
import { routePaths } from '../constants/routePaths.ts'
import ComingSoon from '../pages/ComingSoon.tsx'
import Departments from '../pages/departments/index.tsx'
import AddDepartments from '../pages/departments/AddDepartments.tsx'
import EditDepartments from '../pages/departments/EditDepartments.tsx'
import Procedures from '../pages/procedures/index.tsx'
import AddProcedure from '../pages/procedures/AddProcedure.tsx'
import EditProcedure from '../pages/procedures/EditProcedure.tsx'
import ViewProcedure from '../pages/procedures/ViewProcedure.tsx'
import Doctors from '../pages/doctors/index.tsx'
import AddDoctor from '../pages/doctors/AddDoctor.tsx'
import EditDoctor from '../pages/doctors/EditDoctor.tsx'
import ViewDoctor from '../pages/doctors/ViewDoctor.tsx'
import Patients from '../pages/patients/index.tsx'
import AddPatients from '../pages/patients/AddPatients.tsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <p>Dashboard</p> },
      { path: routePaths.PATIENTS, element: <Patients /> },
      { path: routePaths.ADD_PATIENTS, element: <AddPatients /> },
      { path: routePaths.FIND_PATIENT, element: <ComingSoon /> },
      { path: routePaths.APPOINTMENTS, element: <ComingSoon /> },
      // Department
      { path: routePaths.DEPARTMENTS, element: <Departments/> },
      { path: routePaths.ADD_DEPARTMENT, element: <AddDepartments/> },
      { path: routePaths.EDIT_DEPARTMENT, element: <EditDepartments/> },
      // Procedure
      { path: routePaths.PROCEDURE, element: <Procedures/> },
      { path: routePaths.ADD_PROCEDURE, element: <AddProcedure/> },
      { path: routePaths.EDIT_PROCEDURE, element: <EditProcedure/> },
      { path: routePaths.VIEW_PROCEDURE, element: <ViewProcedure/> },
      // Doctors
      { path: routePaths.DOCTORS, element: <Doctors /> },
      { path: routePaths.ADD_DOCTOR, element: <AddDoctor /> },
      { path: routePaths.EDIT_DOCTOR, element: <EditDoctor /> },
      { path: routePaths.VIEW_DOCTOR, element: <ViewDoctor /> },
      // Coming soon
      { path: routePaths.BILLING, element: <ComingSoon /> },
      { path: routePaths.VITALS, element: <ComingSoon /> },
      { path: routePaths.CONSULTATION, element: <ComingSoon /> },
      { path: routePaths.PHARMACY, element: <ComingSoon /> },
      { path: routePaths.LABORATORY, element: <ComingSoon /> },
      { path: routePaths.INVENTORY, element: <ComingSoon /> },
      { path: routePaths.REPORTS, element: <ComingSoon /> },
      { path: routePaths.USERS, element: <ComingSoon /> },
      { path: routePaths.SETTINGS, element: <ComingSoon /> },
    ],
  },
])
