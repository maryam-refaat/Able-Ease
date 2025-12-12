import axios from "axios";

const API_KEY = "";
const BASE_URL = ""; // example: https://myserver.com/api

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



const api = axios.create({
  baseURL: BASE_URL || "http://localhost:4000/api",
  timeout: 10000,
});

// export const getPrograms = () => api.get("/programs");
export const getOrganizations = () => api.get("/organizations");
export const getCenters = () => api.get("/centers");
export const getFinancialAids = () => api.get("/financial-aids");


export default api;