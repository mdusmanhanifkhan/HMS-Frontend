import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import {router} from "./routes/Router.js"
import { RouterProvider } from "react-router-dom";
import { PermissionProvider } from "./context/PermissionsContext.js";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PermissionProvider>
    <RouterProvider router={router} />
    </PermissionProvider>
  </StrictMode>
);
