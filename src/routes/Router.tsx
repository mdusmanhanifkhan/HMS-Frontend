import { createBrowserRouter } from "react-router-dom";
import PatientRegisteration from "../pages/PatientRegisteration.js";
import App from "../App.js";
import {routePaths} from "../constants/routePaths.ts"
import ComingSoon from "../pages/ComingSoon.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <p>Dashboard</p> },
      { path: routePaths.NEW_PATIENTS , element: <PatientRegisteration />},
       { path: routePaths.FIND_PATIENT, element: <ComingSoon /> },
      { path: routePaths.APPOINTMENTS, element: <ComingSoon  /> },
      { path: routePaths.DEPARTMENTS, element: <ComingSoon /> },
      { path: routePaths.DOCTORS, element: <ComingSoon /> },
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
]);