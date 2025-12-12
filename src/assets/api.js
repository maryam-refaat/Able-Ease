import axios from "axios";

const API_KEY = "";
const BASE_URL = ""; // example: https://myserver.com/api

const api = axios.create({
baseURL: import.meta.env.VITE_API_BASE || "http://localhost:4000/api",
timeout: 10000,
});
// Fetch physi centers

//
//export const getPrograms = () => api.get("/programs");
//export const getOrganizations = () => api.get("/organizations");
export const getCenters = () => api.get("/centers");
export const getFinancialAids = () => api.get("/financial-aids");

export const fallbackOrgs = [
{ OrganizationSSN: '8a9b7c2d-1111-2222-3333-abcdef123456', Id: 1,TypeOfSupport: "Programs & Jobs", Name: 'Physio Care Center', img: null },
{ OrganizationSSN: '2b7c8d3e-4444-5555-6666-fedcba654321', Id: 2,TypeOfSupport: "Programs & Jobs", Name: 'AbleEase Community', img: null }
];


export const fallbackPrograms = [
{ OrganizationSSN: fallbackOrgs[0].OrganizationSSN, Id: 11, Name: 'Rehab for Seniors', startDate: '2025-12-01', endDate: '2026-03-01', status: 'Active', price: 150.0, patients: [], organization: fallbackOrgs[0], Assessment: null, reports: [], img: null },
{ OrganizationSSN: fallbackOrgs[1].OrganizationSSN, Id: 12, Name: 'Child Motor Skills', startDate: '2025-11-15', endDate: '2026-01-15', status: 'Planned', price: 100.0, patients: [], organization: fallbackOrgs[1], Assessment: null, reports: [], img: null }
];


export const fallbackPositions = [
{ positionId: 101, positionName: 'Physiotherapist', requirements: 'Degree in physiotherapy; 2+ years experience', OrganizationSSN: fallbackOrgs[0].OrganizationSSN }
];


export const fallbackCareTakers = [
{ id: 201, name: 'Ahmed Salah', Gender: 'Male', BirthDate: '1992-05-12', reports: [], OrganizationSSN: fallbackOrgs[0].OrganizationSSN, organization: fallbackOrgs[0], patients: [], img: null, experience: '3 years', age: 33 }
];


export const fallbackCenters = [
{ CenterSSN: '8a9b7c2d-1111-2222-3333-abcdef123456', Id: 1, Name: 'Physio Care Center', img: null },
{ CenterSSN: '2b7c8d3e-4444-5555-6666-fedcba654321', Id: 2, Name: 'AbleEase Community', img: null }
];
async function safeFetchJson(url, fallback) {
try {
const res = await fetch(url);
if (!res.ok) throw new Error('network');
const data = await res.json();
if (!data || (Array.isArray(data) && data.length === 0)) throw new Error('empty');
return data;
} catch (err) {
return fallback;
}
}


export const getOrganizations = () => safeFetchJson('/api/organizations', fallbackOrgs);

export const getTherapyCenters = () => safeFetchJson('/api/organizations', fallbackCenters);

export const getPositions = () => safeFetchJson('/api/positions', fallbackPositions);
export const getCareTakers = () => safeFetchJson('/api/caretakers', fallbackCareTakers);



// get relative by id
export const getUserInfo = async (token) => {
  const response = await fetch(`${BASE_URL}/relatives`, 
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    }
  );
  const data = await response.json();
  return data;
};

// signup relative
export const signupRelative = async (body) => {
  const response = await fetch(`${BASE_URL}/relatives`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return data;
}

// signup Organization
export const signupOrganization = async (body) => {
  const response = await fetch(`${BASE_URL}/organizations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return data;
}

// Fetch programs
export const getPrograms = async () => {
  const response = await fetch(`${BASE_URL}/programs`);
  const data = await response.json();
  return data.results;
};

// Fetch physi centers
export const getPhysicenters = async () => {
  const response = await fetch(`${BASE_URL}/physi-centers${API_KEY}`);
  const data = await response.json();
  return data.results;
};

// Fetch relatives
export const getRelatives = async () => {
  const response = await fetch(`${BASE_URL}/relatives${API_KEY}`);
  const data = await response.json();
  return data.results;
};

export const updateRelative = async (id, body) => {
  const response = await fetch(`${BASE_URL}/relatives/${id}${API_KEY}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return data;
};

export const fetchAvailablePrograms = async () => {
  const response = await fetch(`${BASE_URL}/available-programs${API_KEY}`);
  const data = await response.json();
  return data; 
};

export const fetchFinancialAid = async () => {
  const response = await fetch(`${BASE_URL}/financial-aids${API_KEY}`);
  const data = await response.json();
  return data; 
};



export default api;