import { routePaths } from '../constants/routePaths'

export const SidebarRoutes = [
  {
    name: 'Dashboard',
    link: routePaths.DASHBOARD,
    icon: (
      <svg className="w-[15px] h-[15px]" viewBox="0 0 12 12" fill="none">
        <use href="/assets/svg/dashboard-icon.svg#dashboard-icon" />
      </svg>
    ),
  },
  {
    name: 'Patient',
    link: routePaths.PATIENTS,
    permission: 'canManagePatients',
    icon: (
      <svg
        className="w-[15px] h-[15px]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="7" r="4" />
        <path d="M5.5 21v-2a6.5 6.5 0 0 1 13 0v2" />
      </svg>
    ),
  },
  {
    name: 'Patient History',
    link: routePaths.PATIENT_HISTORY,
    permission: 'canManagePatientsHistory',
    icon: (
      <svg
        className="w-[15px] h-[15px]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="7" r="4" />
        <path d="M5.5 21v-2a6.5 6.5 0 0 1 13 0v2" />
      </svg>
    ),
  },
  {
    name: 'Departments',
    link: routePaths.DEPARTMENTS,
    permission: 'canManageDepartments',
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 4h18v4H3z" />
        <path d="M3 8h18v4H3z" />
        <path d="M3 12h18v4H3z" />
      </svg>
    ),
  },
  {
    name: 'Procedure',
    link: routePaths.PROCEDURE,
    permission: 'canManageProcedures',
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="4" width="18" height="14" rx="2" />
        <path d="M3 10h18" />
      </svg>
    ),
  },
  {
    name: 'Doctors',
    link: routePaths.DOCTORS,
    permission: 'canManageDoctors',
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="6" r="4" />
        <path d="M6 22v-2a6 6 0 0 1 12 0v2" />
      </svg>
    ),
  },
  {
    name: 'Doctor Fee',
    link: routePaths.DOCTOR_FEE,
    permission: 'canManageFees',
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 1v22" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 1 1 0 7H6" />
      </svg>
    ),
  },
  {
    name: 'Lab Fee',
    link: routePaths.LAB_FEE,
    // permission: 'canManageLabFees',
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 1v22" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 1 1 0 7H6" />
      </svg>
    ),
  },
  {
    name: 'Welfare Management',
    link: routePaths.WELFARE_MANAGEMENT,
    permission: 'canManageWelfare',
    icon: (
      <svg
        className="w-[18px] h-[18px]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 8.5c1.8-2 5-1.8 6.3.6.7 1.3.6 3-.3 4.2L12 20l-6-6.7c-.9-1.2-1-2.9-.3-4.2C6.7 6.7 10.2 6.5 12 8.5z" />
      </svg>
    ),
  },
  {
    name: 'Billing & Receipts',
    link: routePaths.BILLING,
    permission: 'canViewBilling',
  },
  {
    name: 'User Management',
    link: routePaths.USERS_MANAGEMENT,
    permission: 'canManageUsers',
  },
  {
    name: 'Settings',
    link: routePaths.SETTINGS,
    icon: (
      <svg
        className="w-[15px] h-[15px]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.8 1.8 0 0 0 .3 2l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.8 1.8 0 0 0-2-.3 1.8 1.8 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.2a1.8 1.8 0 0 0-1-1.6 1.8 1.8 0 0 0-2 .3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.8 1.8 0 0 0 .3-2 1.8 1.8 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.2a1.8 1.8 0 0 0 1.6-1 1.8 1.8 0 0 0-.3-2l-.1-.1A2 2 0 1 1 7.2 3.2l.1.1a1.8 1.8 0 0 0 2 .3A1.8 1.8 0 0 0 10.4 2.1V2a2 2 0 1 1 4 0v.2a1.8 1.8 0 0 0 1 1.6 1.8 1.8 0 0 0 2-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.8 1.8 0 0 0-.3 2c.2.6.8 1.1 1.6 1.1H21a2 2 0 1 1 0 4h-.2c-.8 0-1.4.5-1.4 1.1z" />
      </svg>
    ),
  },
]
