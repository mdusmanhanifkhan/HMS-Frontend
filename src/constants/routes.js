export const SidebarRoutes = [
  {
    name: "Dashboard",
    link: "/"
  },
  {
    name: "New Patient",
    link: "/patients/new"
  },
  {
    name: "Find Patient",
    link: "/patients/search"
  },
  {
    name: "Appointments",
    link: "/appointments"
  },
  {
    name: "Departments",
    link: "/departments"
  },
  {
    name: "Doctors",
    link: "/doctors"
  },
  {
    name: "Billing & Receipts",
    link: "/billing"
  },
  {
    name: "Vitals Check",
    link: "/vitals"
  },
  {
    name: "Consultation",
    link: "/consultation"
  },
  {
    name: "Pharmacy",
    link: "/pharmacy"
  },
  {
    name: "Laboratory",
    link: "/laboratory"
  },
  {
    name: "Inventory / Store",
    link: "/inventory"
  },
  {
    name: "Reports",
    link: "/reports",
    children: [
      { name: "Daily Visits", link: "/reports/daily-visits" },
      { name: "Billing Summary", link: "/reports/billing" },
      { name: "Doctor-wise", link: "/reports/doctor-wise" },
      { name: "Department-wise", link: "/reports/department-wise" },
      { name: "Pharmacy Usage", link: "/reports/pharmacy" },
      { name: "Lab Summary", link: "/reports/lab" }
    ]
  },
  {
    name: "User Management",
    link: "/users"
  },
  {
    name: "Settings",
    link: "/settings"
  }
];
