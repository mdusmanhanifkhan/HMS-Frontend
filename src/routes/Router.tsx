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
import AddMedicine from '../pages/pharmacy/medicine/AddProduct.tsx'
import SalesInvoice from '../pages/pharmacy/sale/index.tsx'
import Medicine from '../pages/pharmacy/medicine/index.tsx'
import Stock from '../pages/pharmacy/stock/index.tsx'
import Category from '../pages/pharmacy/category/index.tsx'
import AddCategory from '../pages/pharmacy/category/AddCategory.tsx'
import AddIndent from '../pages/pharmacy/indent/AddIndent.tsx'
import Indent from '../pages/pharmacy/indent/index.tsx'
import PurchaseOrder from '../pages/pharmacy/purchase-roder/index.tsx'
import CreatePurchaseOrder from '../pages/pharmacy/purchase-roder/CreatePurchaseOrder.tsx'
import POListApprovel from '../pages/pharmacy/purchase-roder/POListApprovel.tsx'
import POApprovel from '../pages/pharmacy/purchase-roder/POApprovel.tsx'
import AccountsPurchaseOrderList from '../pages/accounts/purchase-order/AccountsPurchaseOrderList.tsx'
import PurchaseOrderPayment from '../pages/accounts/purchase-order/PurchaseOrderPayment.tsx'
import ApprovedPOListGrn from '../pages/pharmacy/grn/ApprovedPOListGrn.tsx'
import EditCategory from '../pages/pharmacy/category/EditCategory.tsx'
import AddUnit from '../pages/pharmacy/unit/AddUnit.tsx'
import Unit from '../pages/pharmacy/unit/index.tsx'
import EditUnit from '../pages/pharmacy/unit/EditUnit.tsx'
import GenericName from '../pages/pharmacy/generic-name/index.tsx'
import AddGenericName from '../pages/pharmacy/generic-name/AddGenericName.tsx'
import Organization from '../pages/opd/organization/index.tsx'
import AddOrganization from '../pages/opd/organization/AddOrganization.tsx'
import Setting from '../pages/setting/Setting.tsx'
import DiagnosticReceiptGenerator from '../pages/opd/diagnostic/DiagnosticReceiptGenerator.tsx'
import AddGrn from '../pages/pharmacy/grn/AddGrn.tsx'
import EditGenericName from '../pages/pharmacy/generic-name/EditGenericName.tsx'
import AllDownloads from '../pages/download/Download.tsx'
import AllUploads from '../pages/upload/Uploads.tsx'
import CreateRole from '../pages/user-management/CreateRole.tsx'
import CreatePermission from '../pages/user-management/CreatePermission.tsx'
import EditBrand from '../pages/pharmacy/brand/EditBrand.tsx'
import AddBrand from '../pages/pharmacy/brand/AddBrand.tsx'
import Brand from '../pages/pharmacy/brand/index.tsx'
import Supplier from '../pages/pharmacy/supplier/index.tsx'
import AddSupplier from '../pages/pharmacy/supplier/AddSupplier.tsx'
import EditSupplier from '../pages/pharmacy/supplier/EditSupplier.tsx'
import SubCategory from '../pages/pharmacy/sub-category/index.tsx'
import AddSubCategory from '../pages/pharmacy/sub-category/AddSubCategory.tsx'
import SendToSupplier from '../pages/pharmacy/purchase-roder/SendToSupplier.tsx'
import SaleReturn from '../pages/pharmacy/sale/SaleReturn.tsx'
import EditPackingType from '../pages/pharmacy/packing-type/EditPackingType.tsx'
import AddPackingType from '../pages/pharmacy/packing-type/AddPackingType.tsx'
import PackingType from '../pages/pharmacy/packing-type/index.tsx'
import DosageForm from '../pages/pharmacy/dosage-form/index.tsx'
import AddDosageForm from '../pages/pharmacy/dosage-form/AddDosageForm.tsx'
import SaleReport from '../pages/pharmacy/reports/SaleReport.tsx'
import BulkUpload from '../pages/patients/BulkUpload.tsx'
import BulkUploadDepartment from '../pages/departments/BulkUploadDepartment.tsx'
import BulkUploadProcedures from '../pages/procedures/BulkUploadProcedures.tsx'
import BulkUploadDoctor from '../pages/doctors/BulkUploadDoctor.tsx'
import BulkUploadDoctorFee from '../pages/doctor-fee/BulkUploadDoctorFee.tsx'
import Permissions from '../pages/user-management/Permissions.tsx'
// import AddPatientVitals from '../pages/nursing-dept/check-up/AddPatientVitals.tsx'

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
    element: <App />,
    children: [
      { path: '/', element: <Dashboard /> },

      // Patient
      {
        path: routePaths.PATIENTS,
        element: (
          <ProtectedRoute requiredPermission="manage_patients">
            <Patients />
          </ProtectedRoute>
        ),
      },
      { path: routePaths.ADD_PATIENTS, element: <AddPatients /> },
      { path: routePaths.BULK_ADD_PATIENTS, element: <BulkUpload /> },
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
        path: routePaths.BULK_ADD_DEPARTMENT,
        element: <BulkUploadDepartment />,
      },
      {
        path: `${routePaths.EDIT_DEPARTMENT}/:id`,
        element: <EditDepartments />,
      },
      // Procedure
      { path: routePaths.PROCEDURE, element: <Procedures /> },
      { path: routePaths.ADD_PROCEDURE, element: <AddProcedure /> },
      {
        path: routePaths.BULK_ADD_PROCEDURE,
        element: <BulkUploadProcedures />,
      },
      { path: `${routePaths.EDIT_PROCEDURE}/:id`, element: <EditProcedure /> },
      { path: routePaths.VIEW_PROCEDURE, element: <ViewProcedure /> },
      // Doctors
      { path: routePaths.DOCTORS, element: <Doctors /> },
      { path: routePaths.ADD_DOCTOR, element: <AddDoctor /> },
      { path: routePaths.BULK_ADD_DOCTOR, element: <BulkUploadDoctor /> },
      { path: `${routePaths.EDIT_DOCTOR}/:id`, element: <EditDoctor /> },
      { path: routePaths.VIEW_DOCTOR, element: <ViewDoctor /> },
      // Doctor Fee
      { path: routePaths.DOCTOR_FEE, element: <DoctorFee /> },
      {
        path: routePaths.BULK_ADD_DOCTOR_FEE,
        element: <BulkUploadDoctorFee />,
      },
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
      { path: routePaths.SETTINGS, element: <Setting /> },
      {
        path: routePaths.FINANCE_REPORT,
        element: <FinancialReport />,
      },
      {
        path: routePaths.PATIENT_REPORT,
        element: <PatientReport />,
      },
      {
        path: '/add-patient-back-date',
        element: <AddPatientBackDate />,
      },
      {
        path: routePaths.SUPPLIER,
        element: <Supplier />,
      },
      {
        path: routePaths.ADD_SUPPLIER,
        element: <AddSupplier />,
      },
      {
        path: `${routePaths.EDIT_SUPPLIER}/:id`,
        element: <EditSupplier />,
      },
      {
        path: routePaths.BRAND,
        element: <Brand />,
      },
      {
        path: routePaths.ADD_BRAND,
        element: <AddBrand />,
      },
      {
        path: `${routePaths.BRAND}/:id`,
        element: <EditBrand />,
      },
      {
        path: routePaths.PRODUCT,
        element: <Medicine />,
      },
      {
        path: routePaths.ADD_PRODUCT,
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
        path: routePaths.SALE_RETURN,
        element: <SaleReturn />,
      },
      {
        path: routePaths.CATEGORY,
        element: <Category />,
      },
      {
        path: routePaths.ADD_CATEGORY,
        element: <AddCategory />,
      },
      {
        path: `${routePaths.CATEGORY}/:id`,
        element: <EditCategory />,
      },
      {
        path: routePaths.SUB_CATEGORY,
        element: <SubCategory />,
      },
      {
        path: routePaths.ADD_SUB_CATEGORY,
        element: <AddSubCategory />,
      },
      {
        path: routePaths.DOSAGE_FORM,
        element: <DosageForm />,
      },
      {
        path: routePaths.ADD_DOSAGE_FORM,
        element: <AddDosageForm />,
      },
      {
        path: routePaths.PACKING_TYPE,
        element: <PackingType />,
      },
      {
        path: routePaths.ADD_PACKING_TYPE,
        element: <AddPackingType />,
      },
      {
        path: `${routePaths.EDIT_PACKING_TYPE}/:id`,
        element: <EditPackingType />,
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
        path: routePaths.SALE_REPORT,
        element: <SaleReport />,
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
        path: `${routePaths.SEND_TO_SUPPLIER}`,
        element: <SendToSupplier />,
      },
      {
        path: `${routePaths.ACCOUNTS_PO_APPROVEL}/:id`,
        element: <PurchaseOrderPayment />,
      },
      {
        path: `${routePaths.ACCOUNTS_PO_LIST}`,
        element: <AccountsPurchaseOrderList />,
      },
      {
        path: `${routePaths.UNIT}`,
        element: <Unit />,
      },
      {
        path: `${routePaths.ADD_UNIT}`,
        element: <AddUnit />,
      },
      {
        path: `${routePaths.EDIT_UNIT}/:id`,
        element: <EditUnit />,
      },
      {
        path: `${routePaths.GENERIC_NAME}`,
        element: <GenericName />,
      },
      {
        path: `${routePaths.ADD_GENERIC_NAME}`,
        element: <AddGenericName />,
      },
      {
        path: `${routePaths.GENERIC_NAME}/:id`,
        element: <EditGenericName />,
      },
      {
        path: `${routePaths.ORGANIZATION}`,
        element: <Organization />,
      },
      {
        path: `${routePaths.ADD_ORGANIZATION}`,
        element: <AddOrganization />,
      },
      {
        path: `${routePaths.LAB}/:id`,
        element: <DiagnosticReceiptGenerator />,
      },
      // {
      //   path: `${routePaths.ADD_VITALS}`,
      //   element: <AddPatientVitals />,
      // },
      {
        path: `/download`,
        element: <AllDownloads />,
      },
      {
        path: `/upload`,
        element: <AllUploads />,
      },
      {
        path: routePaths.ROLE_MANAGEMENT,
        element: (
          //  <ProtectedRoute requiredPermission="manage_roles">
          <CreateRole />
        ),
        //  {/* </ProtectedRoute> */}
      },
      {
        path: routePaths.PERMISSION_MANAGEMENT,
        element: <Permissions />,
      },
      {
        path: routePaths.CREATE_PERMISSION,
        element: <CreatePermission />,
      },
    ],
  },
])

// import { createBrowserRouter, Navigate } from 'react-router-dom';
// import NewVersion from '../pages/NewVersion';

// export const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <NewVersion />,
//   },
//   // Catch-all redirect
//   {
//     path: '*',
//     element: <Navigate to="/" replace />,
//   },
// ]);
