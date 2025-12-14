
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Landpage from './Pages/Landpage';
import AboutPage from "./Pages/About"
import Layout from './Components/Layout';
import RelativePage from './Pages/Relative';
import HomePage from './Pages/HomePage';
import OrganizationPage from './Pages/organization';
import OrganizationsPage from './Pages/OrganizationsPage';
import TherapyCenters from './Pages/TherapyCenters';
import PatientProfile from './Pages/PatientProfile';
import PatientReportsMedical from './Pages/PatientReports_medical';
import Messages from './Pages/Messages';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
       {
        path: "/",
        element: <Landpage />
      },
      {
        path: "Able-Ease",
        element: <Landpage />
      },
      {
        path: "/about",
        element: <AboutPage />
      },
      {
        path: "/Home",
        element: <HomePage />
      },
    ,{
        path: "/organizations",
        element: <OrganizationsPage />
      },{
        path: "/therapy-centers",
        element: <TherapyCenters />
      }
    ]
    
  },  {
        path: "/relative-profile",
        element: <RelativePage />
      },
       {
        path: "/patient-profile",
        element: <PatientProfile />
      },
      {
        path: "/patient-reports",
        element: <PatientReportsMedical />
      },
      {
        path: "/messages",
        element: <Messages />
      },
      {
        path: "/organization-profile",
        element: <OrganizationPage />
      }
  
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
