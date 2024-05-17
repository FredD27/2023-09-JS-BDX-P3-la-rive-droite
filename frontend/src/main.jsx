// Import Composant React.
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// Import composants.
import App from "./App";
import Home from "./pages/HomeOffer/Home";
import ReadOffer from "./pages/Offer/ReadOffer";
import SignIn from "./pages/Connexion/SignIn";
import LogIn from "./pages/Connexion/LogIn";
import UserProfileModel from "./pages/ProfileUser/UserProfileModel";
import AddExperience from "./pages/Experience/AddExperience";
import AddFormation from "./pages/Formation/AddFormation";
import DashboardGuard from "./pages/Dashboard/DashboardGuard";
import DashboardOffer from "./pages/Dashboard/DashboardOffer";
import DashboardUser from "./pages/Dashboard/DashboardUser";
import AddOffer from "./pages/Offer/AddOffer";
import EditOffer from "./pages/Offer/EditOffer";
// Import Contexts.
import GlobalContextProvider from "./contexts/GlobalContext";
// Import de loaders.
import currentUserProfileLoader from "./loaders/current-user-profil.loader";
import currentAdmin from "./loaders/current-admin.loader";
// Import de classe.
import ApiService from "./services/api.service";
// Import Styles.
import "@fortawesome/fontawesome-free/css/all.min.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import EditUser from "./pages/ProfileUser/EditUser";
import EditExperience from "./pages/Experience/EditExperience";
import EditFormation from "./pages/Formation/EditFormation";

const apiService = new ApiService();

const router = createBrowserRouter([
  {
    path: "/",
    loader: async () => currentUserProfileLoader(apiService),
    element: (
      <GlobalContextProvider apiService={apiService}>
        <App />
      </GlobalContextProvider>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/offer/:id",
        element: <ReadOffer />,
      },
      {
        path: "/signin",
        element: <SignIn />,
      },
      {
        path: "/login",
        element: <LogIn />,
      },
      {
        path: "/profile",
        element: <UserProfileModel />,
      },
      {
        path: "/profile/edit/:id",
        element: <EditUser />,
      },
      {
        path: "/profile/add/experience",
        element: <AddExperience />,
      },
      {
        path: "/profile/experience/edit/:id",
        element: <EditExperience />,
      },
      {
        path: "/profile/add/formation",
        element: <AddFormation />,
      },
      {
        path: "/profile/formation/edit/:id",
        element: <EditFormation />,
      },
      {
        path: "/dashboard",
        element: <DashboardGuard />,
        loader: async () => currentAdmin(apiService),
        children: [
          {
            path: "/dashboard/offer",
            element: <DashboardOffer />,
          },
          {
            path: "/dashboard/user",
            element: <DashboardUser />,
          },

          {
            path: "/dashboard/offer/add",
            element: <AddOffer />,
          },
          {
            path: "/dashboard/edit-offer/:id",
            element: <EditOffer />,
          },
          {
            path: "/dashboard/edit-user/:id",
            element: <EditUser fromDashboard="true" />,
          },
        ],
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
