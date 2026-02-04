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
import PatientReceiptGenerator from '../pages/patients/PatientReceiptGenerator.tsx'
import DoctorFee from '../pages/doctor-fee/index.tsx'
import AddDoctorFee from '../pages/doctor-fee/AddDoctorFee.tsx'
import Welfare from '../pages/welfare/index.tsx'
import AddWelfarePatient from '../pages/welfare/AddWelfarePatient.tsx'
import EditPatients from '../pages/patients/EditPatients.tsx'
import Login from '../pages/login/Login.tsx'
import ProtectedRoute from './ProtectedRoute.tsx'
import Dashboard from '../pages/dashboard/index.tsx'
import UserManagement from '../pages/user-management/index.tsx'
import CreateUser from '../pages/user-management/CreateUser.tsx'
import EditDoctorFee from '../pages/doctor-fee/EditDoctorFee.tsx'
import PatientHistory from '../pages/patient-history/PatientHistory.tsx'
import AllPatients from '../pages/patient-history/AllPatients.tsx'
import TokenReceiptGenerate from '../pages/token-receipt-generate/index.tsx'
import FinancialReport from '../pages/finance/FinancialReport.tsx'
import PatientReport from '../pages/reports/patient-report/index.tsx'
import PublicRoute from '../middleware/PublicRoute.tsx'
import OldPatientReceiptGenerator from '../pages/patients/OldPatientReceiptGenerator.tsx'
import AddPatientBackDate from '../pages/patients/AddPatientBackDate.tsx'
import AddDistributor from '../pages/pharmacy/distributor/AddDistributor.tsx'
import Distributor from '../pages/pharmacy/distributor/index.tsx'
import AddCompany from '../pages/pharmacy/company/AddCompany.tsx'
import Company from '../pages/pharmacy/company/index.tsx'
import AddMedicine from '../pages/pharmacy/medicine/AddMedicine.tsx'
import SalesInvoice from '../pages/pharmacy/sale/index.tsx'
import Medicine from '../pages/pharmacy/medicine/index.tsx'
import Stock from '../pages/pharmacy/stock/index.tsx'
import AddCategory from '../pages/pharmacy/category/AddCategory.tsx'
import AddDosageForm from '../pages/pharmacy/dosage-form/AddDosageForm.tsx'
import AddIndent from '../pages/pharmacy/indent/AddIndent.tsx'
import Indent from '../pages/pharmacy/indent/index.tsx'
import PurchaseOrder from '../pages/pharmacy/purchase-roder/index.tsx'
import CreatePurchaseOrder from '../pages/pharmacy/purchase-roder/CreatePurchaseOrder.tsx'
import POListApprovel from '../pages/pharmacy/purchase-roder/POListApprovel.tsx'
import POApprovel from '../pages/pharmacy/purchase-roder/POApprovel.tsx'
import AccountsPurchaseOrderList from '../pages/accounts/purchase-order/AccountsPurchaseOrderList.tsx'
import PurchaseOrderPayment from '../pages/accounts/purchase-order/PurchaseOrderPayment.tsx'
import AddGrn from '../pages/pharmacy/grn/AddGrn.tsx'
import ApprovedPOListGrn from '../pages/pharmacy/grn/ApprovedPOListGrn.tsx'
import EditDistributor from '../pages/pharmacy/distributor/EditDistributor.tsx'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <App />,
      </ProtectedRoute>
    ),
    children: [
      { path: '/', element: <Dashboard /> },

      // Patient
      {
        path: routePaths.PATIENTS,
        element: <Patients />,
      },
      { path: routePaths.ADD_PATIENTS, element: <AddPatients /> },
      { path: `${routePaths.PATIENTS}/:id`, element: <EditPatients /> },
      {
        path: `${routePaths.PATIENTS}${routePaths.PATIENTS_RECEIPT_GENERATE}/:id`,
        element: <PatientReceiptGenerator />,
      },
      {
        path: `${routePaths.PATIENTS}${routePaths.OLD_PATIENTS_RECEIPT_GENERATE}/:id`,
        element: <OldPatientReceiptGenerator />,
      },
      {
        path: `${routePaths.PATIENT_HISTORY}/:id`,
        element: <PatientHistory />,
      },
      { path: routePaths.PATIENT_HISTORY, element: <AllPatients /> },
      { path: routePaths.APPOINTMENTS, element: <ComingSoon /> },
      // Department
      { path: routePaths.DEPARTMENTS, element: <Departments /> },
      { path: routePaths.ADD_DEPARTMENT, element: <AddDepartments /> },
      {
        path: `${routePaths.EDIT_DEPARTMENT}/:id`,
        element: <EditDepartments />,
      },
      // Procedure
      { path: routePaths.PROCEDURE, element: <Procedures /> },
      { path: routePaths.ADD_PROCEDURE, element: <AddProcedure /> },
      { path: `${routePaths.EDIT_PROCEDURE}/:id`, element: <EditProcedure /> },
      { path: routePaths.VIEW_PROCEDURE, element: <ViewProcedure /> },
      // Doctors
      { path: routePaths.DOCTORS, element: <Doctors /> },
      { path: routePaths.ADD_DOCTOR, element: <AddDoctor /> },
      { path: `${routePaths.EDIT_DOCTOR}/:id`, element: <EditDoctor /> },
      { path: routePaths.VIEW_DOCTOR, element: <ViewDoctor /> },
      // Doctor Fee
      { path: routePaths.DOCTOR_FEE, element: <DoctorFee /> },
      { path: routePaths.ADD_DOCTOR_FEE, element: <AddDoctorFee /> },
      { path: `${routePaths.EDIT_DOCTOR_FEE}/:id`, element: <EditDoctorFee /> },
      // LAB Fee
      // { path: routePaths.LAB_FEE, element: <LabFee /> },
      { path: routePaths.TOKEN, element: <TokenReceiptGenerate /> },
      // { path: `${routePaths.EDIT_DOCTOR_FEE}/:id`, element: <EditDoctorFee /> },
      // WELFARE MANAGEMENT
      { path: routePaths.WELFARE_MANAGEMENT, element: <Welfare /> },
      {
        path: `${routePaths.ADD_WELFARE_MANAGEMENT}/:id`,
        element: <AddWelfarePatient />,
      },
      // Coming soon
      { path: routePaths.BILLING, element: <ComingSoon /> },
      { path: routePaths.VITALS, element: <ComingSoon /> },
      { path: routePaths.CONSULTATION, element: <ComingSoon /> },
      { path: routePaths.PHARMACY, element: <ComingSoon /> },
      { path: routePaths.LABORATORY, element: <ComingSoon /> },
      { path: routePaths.INVENTORY, element: <ComingSoon /> },
      { path: routePaths.REPORTS, element: <ComingSoon /> },
      { path: routePaths.USERS_MANAGEMENT, element: <UserManagement /> },
      { path: routePaths.CREATE_USER, element: <CreateUser /> },
      { path: routePaths.SETTINGS, element: <ComingSoon /> },
      {
        path: routePaths.FINANCE_REPORT,
        element: <FinancialReport />,
      },
      {
        path: routePaths.PATIENT_REPORT,
        element: <PatientReport />,
      },
      {
        path: "/add-patient-back-date",
        element: <AddPatientBackDate />,
      },
      {
        path: routePaths.DISTRIBUTOR,
        element: <Distributor />,
      },
      {
        path: routePaths.ADD_DISTRIBUTOR,
        element: <AddDistributor />,
      },
      {
        path: `${routePaths.EDIT_DISTRIBUTOR}/:id`,
        element: <EditDistributor />,
      },
      {
        path: routePaths.COMPANY,
        element: <Company />,
      },
      {
        path: routePaths.ADD_COMPANY,
        element: <AddCompany />,
      },
      {
        path: `${routePaths.COMPANY}/:id`,
        element: <AddCompany />,
      },
      {
        path: routePaths.ADD_COMPANY,
        element: <AddCompany />,
      },
      {
        path: routePaths.MEDICINE,
        element: <Medicine />,
      },
      {
        path: routePaths.ADD_MEDICINE,
        element: <AddMedicine />,
      },
      {
        path: routePaths.GRN,
        element: <ApprovedPOListGrn />,
      },
      {
        path: `${routePaths.ADD_GRN}/:id`,
        element: <AddGrn />,
      },
      {
        path: routePaths.STOCK,
        element: <Stock />,
      },
      {
        path: routePaths.SALE_INVOICE,
        element: <SalesInvoice />,
      },
      {
        path: routePaths.ADD_CATEGORY,
        element: <AddCategory />,
      },
      {
        path: routePaths.ADD_DOSAGE_FORM,
        element: <AddDosageForm />,
      },
      {
        path: '/indent',
        element: <Indent />,
      },
      {
        path: '/indent/add',
        element: <AddIndent />,
      },
      {
        path: routePaths.PURCHASE_ORDER,
        element: <PurchaseOrder />,
      },
      {
        path: `${routePaths.ADD_PURCHASE_ORDER}/:id`,
        element: <CreatePurchaseOrder />,
      },
      {
        path: `${routePaths.PURCHASE_ORDER_APPROVEL}`,
        element: <POListApprovel />,
      },
      {
        path: `${routePaths.PURCHASE_ORDER_APPROVEL}/:id`,
        element: <POApprovel />,
      },
      {
        path: `${routePaths.ACCOUNTS_PO_APPROVEL}/:id`,
        element: <PurchaseOrderPayment />,
      },
      {
        path: `${routePaths.ACCOUNTS_PO_LIST}`,
        element: <AccountsPurchaseOrderList />,
      },

    ],
  },
])
