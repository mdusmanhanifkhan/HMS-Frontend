import { routePaths } from '../constants/routePaths'

export const permission = {
  dashboard: 'view_dashboard',

  // Patient
  managePatients: 'manage_patients',
  manageToken: 'manage_token',
  managePatientHistory: 'manage_patient_history',
  manageNursing: 'manage_nursing',

  // Hospital
  manageDepartments: 'manage_departments',
  manageProcedures: 'manage_procedures',
  manageDoctors: 'manage_doctors',
  manageFees: 'manage_fees',
  manageWelfare: 'manage_welfare',
  manageOrganization: 'manage_organization',

  // Pharmacy granular
  manageBrand: 'manage_brand',
  manageSupplier: 'manage_supplier',
  manageCategory: 'manage_category',
  manageSubCategory: 'manage_subcategory',
  manageUnit: 'manage_unit',
  manageGeneric: 'manage_generic',
  manageDosageForm: 'manage_dosageform',
  managePackingType: 'manage_packing_type',

  manageProduct: 'manage_product',
  manageStock: 'manage_stock',
  manageGRN: 'manage_grn',

  manageIndent: 'manage_indent',
  managePurchaseOrder: 'manage_purchase_order',
  manageApprovedPOs: 'manage_approved_pos',
  manageSendToSupplier: 'manage_send_to_supplier',

  manageSale: 'manage_sale',
  manageReturn: 'manage_return',

  viewReports: 'view_reports',
  viewBilling: 'view_billing',

  manageUsers: 'manage_users',
  manageRoles: 'manage_roles',
  manageSettings: 'manage_settings',
  manageDownloads: 'manage_downloads',
  manageUploads: 'manage_uploads',
}

export const SidebarRoutes = [
  {
    section: 'Dashboard',
    items: [
      { name: 'Dashboard', link: routePaths.DASHBOARD, permission: permission.dashboard },
    ],
  },

  {
    section: 'Patient Management',
    items: [
      { name: 'Patient', link: routePaths.PATIENTS, permission: permission.managePatients },
      { name: 'Token', link: routePaths.TOKEN, permission: permission.manageToken },
      { name: 'Patient History', link: routePaths.PATIENT_HISTORY, permission: permission.managePatientHistory },
      { name: 'Vitals', link: routePaths.ADD_VITALS, permission: permission.manageNursing },
    ],
  },

  {
    section: 'Hospital Setup',
    items: [
      { name: 'Departments', link: routePaths.DEPARTMENTS, permission: permission.manageDepartments },
      { name: 'Procedure', link: routePaths.PROCEDURE, permission: permission.manageProcedures },
      { name: 'Doctors', link: routePaths.DOCTORS, permission: permission.manageDoctors },
      { name: 'Fee Management', link: routePaths.DOCTOR_FEE, permission: permission.manageFees },
      { name: 'Welfare Management', link: routePaths.WELFARE_MANAGEMENT, permission: permission.manageWelfare },
      { name: 'Organization', link: routePaths.ORGANIZATION, permission: permission.manageOrganization },
    ],
  },

  {
    section: 'Pharmacy Setup',
    items: [
      { name: 'Brand', link: routePaths.BRAND, permission: permission.manageBrand },
      { name: 'Supplier', link: routePaths.SUPPLIER, permission: permission.manageSupplier },
      { name: 'Category', link: routePaths.CATEGORY, permission: permission.manageCategory },
      { name: 'Sub Category', link: routePaths.SUB_CATEGORY, permission: permission.manageSubCategory },
      { name: 'Unit', link: routePaths.UNIT, permission: permission.manageUnit },
      { name: 'Generic Name', link: routePaths.GENERIC_NAME, permission: permission.manageGeneric },
      { name: 'Dosageform', link: routePaths.DOSAGE_FORM, permission: permission.manageDosageForm },
      { name: 'Packing Type', link: routePaths.PACKING_TYPE, permission: permission.managePackingType },
    ],
  },

  {
    section: 'Inventory',
    items: [
      { name: 'Product', link: routePaths.PRODUCT, permission: permission.manageProduct },
      { name: 'Stock', link: routePaths.STOCK, permission: permission.manageStock },
      { name: 'GRN', link: routePaths.GRN, permission: permission.manageGRN },
    ],
  },

  {
    section: 'Purchase',
    items: [
      { name: 'Indent', link: routePaths.INDENT, permission: permission.manageIndent },
      { name: 'Purchase Order', link: routePaths.PURCHASE_ORDER, permission: permission.managePurchaseOrder },
      { name: 'Approved POs', link: routePaths.PURCHASE_ORDER_APPROVEL, permission: permission.manageApprovedPOs },
      { name: 'Send to Supplier', link: routePaths.SEND_TO_SUPPLIER, permission: permission.manageSendToSupplier },
    ],
  },

  {
    section: 'Sales',
    items: [
      { name: 'Sale', link: routePaths.SALE_INVOICE, permission: permission.manageSale },
      { name: 'Return', link: routePaths.SALE_RETURN, permission: permission.manageReturn },
    ],
  },

  {
    section: 'Accounts & Reports',
    items: [
      { name: 'Account', link: routePaths.ACCOUNTS_PO_LIST, permission: permission.manageProduct }, 
      { name: 'Billing & Receipts', link: routePaths.BILLING, permission: permission.viewBilling },
      { name: 'Financial Report', link: routePaths.FINANCE_REPORT, permission: permission.viewReports },
      { name: 'Patient Report', link: routePaths.PATIENT_REPORT, permission: permission.viewReports },
      { name: 'Sale Report', link: routePaths.SALE_REPORT, permission: permission.manageSale },
    ],
  },

  {
    section: 'Administration',
    items: [
      { name: 'User Management', link: routePaths.USERS_MANAGEMENT, permission: permission.manageUsers },
      { name: 'Role Management', link: routePaths.ROLE_MANAGEMENT, permission: permission.manageRoles },
      { name: 'Permission Management', link: routePaths.PERMISSION_MANAGEMENT, permission: permission.manageRoles },
      { name: 'Settings', link: routePaths.SETTINGS, permission: permission.manageSettings },
      { name: 'Download', link: '/download', permission: permission.manageDownloads },
      { name: 'Upload', link: '/upload', permission: permission.manageUploads },
    ],
  },
]