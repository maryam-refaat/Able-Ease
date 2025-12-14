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
  const response = await fetch(`${BASE_URL}/program/programs`);
  const data = await response.json();
  const programs = data.results||data||[];
  return {data:programs};
};


export const getEmployments = async () => {
  const response = await fetch(`${BASE_URL}/program/programs`);
  const data = await response.json();
  const employments = data.results||data||[];
  return {data:employments};
};


// Fetch physi centers
export const getPhysicenters = async () => {
  const response = await fetch(`${BASE_URL}/GetAllcenters`);
  const data = await response.json();
  const centers = data.results||data||[];
  return {data:centers};
};

// Fetch relatives
export const getRelatives = async () => {
  const response = await fetch(`${BASE_URL}/relatives`);
  const data = await response.json();
  const relatives = data.results||data||[];
  return {data:relatives};
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
  const response = await fetch(`${BASE_URL}/available-programs`);
  const data = await response.json();
  return data; 
};

export const fetchFinancialAid = async () => {
  const response = await fetch(`${BASE_URL}/financial-aids`);
  const data = await response.json();
  return data; 
};



const api = axios.create({
  baseURL: BASE_URL || "http://localhost:4000/api",
  timeout: 10000,
});



export const getFinancialAids = async () => {
  const response = await fetch(`${BASE_URL}/GetAllFinancialAids`);
  const data = await response.json();
  const FAs = data.results||data||[];
  return {data:FAs};
};


export const getOrganizations = async () => {
  const response = await fetch(`${BASE_URL}/Organizations`);
  const data = await response.json();
  const Organizations = data.results||data||[];
  return {data:Organizations};
};

export const getCenters = async () => {
  const response = await fetch(`${BASE_URL}/GetAllcenters`);
  const data = await response.json();
  const centers = data.results||data||[];
  return {data:centers};
}


export const getTherapies = async () => {
  const response = await fetch(`${BASE_URL}/Therapy/all`);
  const data = await response.json();
  const therapies = data.results||data||[];
  return {data:therapies};
}


export const getcenter_Therapies = async (Cid) => {
  const response = await fetch(`${BASE_URL}/Therapy/center/${Cid}/unjoined`);
  const data = await response.json();
  const therapies = data.results||data||[];
  return {data:therapies};
}


export const getOrg_Programs = async (Oid) => {
  const response = await fetch(`${BASE_URL}/Program/OrganizationPrograms/${Oid}`);
  const data = await response.json();
  const therapies = data.results||data||[];
  return {data:therapies};
}

export const getOrg_CareGivers = async (Oid) => {
  const response = await fetch(`${BASE_URL}/CareGiver/OrganizationCareGivers/${Oid}`);
  const data = await response.json();
  const therapies = data.results||data||[];
  return {data:therapies};
}
export const getPatient_Reports = async (PSSN) => {
  const response = await fetch(`${BASE_URL}/Report/GetReportsByPatient/${PSSN}`);
  const data = await response.json();
  const reports = data.results||data||[];
  return {data:reports};
}

export const getPatient_Medicalinfo = async (PSSN) => {
  const response = await fetch(`${BASE_URL}/Report/GetReportsByPatient/${PSSN}`);
  const data = await response.json();
  const reports = data.results||data||[];
  return {data:reports};
}

export const getPatient_Therapies = async (PSSN) => {
  const response = await fetch(`${BASE_URL}/Therapy/patient/${PSSN}`);
  const data = await response.json();
  const Patient_Therapies = data.results||data||[];
  return {data:Patient_Therapies};
}
//needs real api
export const getPatient_Program = async (PSSN) => {
  const response = await fetch(`${BASE_URL}/Therapy/patient/${PSSN}`);
  const data = await response.json();
  const Patient_Therapies = data.results||data||[];
  return {data:Patient_Therapies};
}



export default api;