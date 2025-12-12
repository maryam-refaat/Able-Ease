
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
      {
        path: "/relative-profile",
        element: <RelativePage />
      },
       {
        path: "/patient-profile",
        element: <PatientProfile />
      },
      {
        path: "/organization-profile",
        element: <OrganizationPage />
      },{
        path: "/organizations",
        element: <OrganizationsPage />
      },{
        path: "/therapy-centers",
        element: <TherapyCenters />
      }
    ]
  },
  
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
