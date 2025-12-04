import { routePaths } from "../constants/routePaths";

// export const SidebarRoutes = [
//   { name: "Dashboard", link: routePaths.DASHBOARD },
//   { name: "Patient", link: routePaths.PATIENTS , permission: "canManagePatients"},
//   { name: "Departments", link: routePaths.DEPARTMENTS },
//   { name: "Procedure", link: routePaths.PROCEDURE },
//   { name: "Doctors", link: routePaths.DOCTORS },
//   { name: "Doctor Fee", link: routePaths.DOCTOR_FEE },
//   { name: "Welfare Management", link: routePaths.WELFARE_MANAGEMENT },
//   { name: "Billing & Receipts", link: routePaths.BILLING },
//   // { name: "Appointments", link: routePaths.APPOINTMENTS },
//   // { name: "Vitals Check", link: routePaths.VITALS },
//   // { name: "Consultation", link: routePaths.CONSULTATION },
//   // { name: "Pharmacy", link: routePaths.PHARMACY },
//   // { name: "Laboratory", link: routePaths.LABORATORY },
//   // { name: "Inventory / Store", link: routePaths.INVENTORY },
//   // {
//   //   name: "Reports",
//   //   link: routePaths.REPORTS,
//   //   children: [
//   //     { name: "Daily Visits", link: routePaths.REPORTS_DAILY_VISITS },
//   //     { name: "Billing Summary", link: routePaths.REPORTS_BILLING },
//   //     { name: "Doctor-wise", link: routePaths.REPORTS_DOCTOR_WISE },
//   //     { name: "Department-wise", link: routePaths.REPORTS_DEPARTMENT_WISE },
//   //     { name: "Pharmacy Usage", link: routePaths.REPORTS_PHARMACY },
//   //     { name: "Lab Summary", link: routePaths.REPORTS_LAB },
//   //   ],
//   // },
//   { name: "User Management", link: routePaths.USERS_MANAGEMENT },
//   { name: "Settings", link: routePaths.SETTINGS },
// ];
export const SidebarRoutes = [
  { name: "Dashboard", link: routePaths.DASHBOARD},
  { name: "Patient", link: routePaths.PATIENTS, permission: "canManagePatients" },
  { name: "Departments", link: routePaths.DEPARTMENTS, permission: "canManageDepartments" },
  { name: "Procedure", link: routePaths.PROCEDURE, permission: "canManageProcedures" },
  { name: "Doctors", link: routePaths.DOCTORS, permission: "canManageDoctors" },
  { name: "Doctor Fee", link: routePaths.DOCTOR_FEE, permission: "canManageFees" },
  { name: "Welfare Management", link: routePaths.WELFARE_MANAGEMENT, permission: "canManageWelfare" },
  { name: "Billing & Receipts", link: routePaths.BILLING, permission: "canViewBilling" },
  { name: "User Management", link: routePaths.USERS_MANAGEMENT, permission: "canManageUsers" },
  { name: "Settings", link: routePaths.SETTINGS }
];
