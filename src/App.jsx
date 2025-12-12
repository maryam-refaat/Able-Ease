// src/App.jsx (temporary safe loader)
import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import OrganizationsPage from "./Pages/OrganizationsPage";
import TherapyCenters from "./Pages/TherapyCenters";
import HomePage from "./Pages/HomePage";




export default function App() {
  return ( <BrowserRouter>
      <Routes>

        <Route path="/" element={<HomePage />} />
        

        <Route path="/organizations" element={<OrganizationsPage />} />
        <Route path="/therapy-centers" element={<TherapyCenters />} />

      </Routes>
    </BrowserRouter>  

  );
}
