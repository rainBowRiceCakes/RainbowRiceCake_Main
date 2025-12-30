import { RouterProvider, createBrowserRouter } from "react-router-dom";
// import App from "../src/App.jsx";

// route groups
// import mainRoutes from "./main.routes.jsx";
import riderRoutes from "./rider.routes.jsx";
import partnerRoutes from "./partner.routes.jsx";
import RiderLayout from "./layouts/RiderLayout.jsx";
import PartnerLayout from "./layouts/PartnerLayout.jsx";

const router = createBrowserRouter([
  // {
  //   path: "/",
  //   element: <App />,
  //   children: mainRoutes,
  // },
  {
    path: "/rider",
    element: <RiderLayout />,
    children: riderRoutes,
  },
  {
    path: "/partner",
    element: <PartnerLayout />,
    children: partnerRoutes,
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}