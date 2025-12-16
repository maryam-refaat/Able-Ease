import axios from "axios";

const API_KEY = "";
const BASE_URL = "https://localhost:7040/api"; // example: https://myserver.com/api

// get relative by id
export const getUserInfo = async (token) => {
  const response = await fetch(`${BASE_URL}/relatives`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });
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
};

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
};

// Fetch programs
export const getPrograms = async () => {
  const response = await fetch(`${BASE_URL}/program/programs`);
  const data = await response.json();
  const programs = data.results || data || [];
  return { data: programs };
};

export const getEmployments = async () => {
  const response = await fetch(`${BASE_URL}/program/programs`);
  const data = await response.json();
  const employments = data.results || data || [];
  return { data: employments };
};

// Fetch physi centers
export const getPhysicenters = async () => {
  const response = await fetch(`${BASE_URL}/GetAllcenters`);
  const data = await response.json();
  const centers = data.results || data || [];
  return { data: centers };
};

// Fetch relatives
export const getRelatives = async () => {
  const response = await fetch(`${BASE_URL}/relatives`);
  const data = await response.json();
  const relatives = data.results || data || [];
  return { data: relatives };
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
  const FAs = data.results || data || [];
  return { data: FAs };
};

export const getOrganizations = async () => {
  const response = await fetch(`${BASE_URL}/Organizations/getallorganizations`);
  const data = await response.json();
  const Organizations = data.results || data || [];
  return { data: Organizations };
};

export const getCenters = async () => {
  const response = await fetch(`${BASE_URL}/center/GetAllcenters`);
  const data = await response.json();
  const centers = data.results || data || [];
  return { data: centers };
};

export const getTherapies = async () => {
  const response = await fetch(`${BASE_URL}/Therapy/all`);
  const data = await response.json();
  const therapies = data.results || data || [];
  return { data: therapies };
};

export const getcenter_Therapies = async (Cid) => {
  const response = await fetch(`${BASE_URL}/Therapy/center/${Cid}/unjoined`);
  const data = await response.json();
  const therapies = data.results || data || [];
  return { data: therapies };
};

export const getOrg_Programs = async (Oid) => {
  const response = await fetch(
    `${BASE_URL}/Program/OrganizationPrograms/${Oid}`
  );
  const data = await response.json();
  const therapies = data.results || data || [];
  return { data: therapies };
};

export const getOrg_CareGivers = async (Oid) => {
  const response = await fetch(
    `${BASE_URL}/CareGiver/getcaregiversbyorganization/${Oid}`
  );
  const data = await response.json();
  const therapies = data.results || data || [];
  return { data: therapies };
};

export const getOrg_Proposals = async (Oid) => {
  const response = await fetch(`${BASE_URL}/message/sent/${Oid}/job-proposals`);
  const data = await response.json();
  const therapies = data.results || data || [];
  return { data: therapies };
};
export const getPatient_Reports = async (PSSN) => {
  const response = await fetch(
    `${BASE_URL}/Report/GetReportsByPatient/${PSSN}`
  );
  const data = await response.json();
  const reports = data.results || data || [];
  return { data: reports };
};

export const getPatient_Medicalinfo = async (PSSN) => {
  const response = await fetch(
    `${BASE_URL}/Report/GetReportsByPatient/${PSSN}`
  );
  const data = await response.json();
  const reports = data.results || data || [];
  return { data: reports };
};

export const getPatient_Therapies = async (PSSN) => {
  const response = await fetch(`${BASE_URL}/Therapy/patient/${PSSN}`);
  const data = await response.json();
  const Patient_Therapies = data.results || data || [];
  return { data: Patient_Therapies };
};
//needs real api
export const getPatient_Program = async (PSSN) => {
  const response = await fetch(`${BASE_URL}/Therapy/patient/${PSSN}`);
  const data = await response.json();
  const Patient_Therapies = data.results || data || [];
  return { data: Patient_Therapies };
};

export const getReceived_msgs = async (RSSN) => {
  const response = await fetch(`${BASE_URL}/Message/received/${RSSN}`);
  const data = await response.json();
  const Recieved = data.results || data || [];
  return { data: Recieved };
};

export const getSent_msgs = async (RSSN) => {
  const response = await fetch(`${BASE_URL}/Message/sent/${RSSN}`);
  const data = await response.json();
  const Sent = data.results || data || [];
  return { data: Sent };
};

export const getUser_data = async (USSN) => {
  const response = await fetch(`${BASE_URL}/User/data/${USSN}`);
  const data = await response.json();
  const UserData = data.results || data || [];
  return { data: UserData };
};

export const getAll_Programs = async (USSN) => {
  const response = await fetch(`${BASE_URL}/program/programs`);
  const data = await response.json();
  const progs = data.results || data || [];
  return { data: progs };
};

export const getAll_Employments = async (USSN) => {
  const response = await fetch(`${BASE_URL}/Message/sent/all-job-proposals`);
  const data = await response.json();
  const emps = data.results || data || [];
  return { data: emps };
};

export const getAll_Therapies = async (USSN) => {
  const response = await fetch(`${BASE_URL}/therapy/all`);
  const data = await response.json();
  const therapies = data.results || data || [];
  return { data: therapies };
};

export const AddPatientToProgram=async(PSSN,ProID,OSSN)=>{
  const response = await fetch(`${BASE_URL}/Program/AddPatienttoprogram/${OSSN}/${ProID}/${PSSN}`,{
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
}

export const AddPatientToTherapy=async(body)=>{
  const response = await fetch(`${BASE_URL}/Program/AddPatienttoprogram`,{
    method: "PUT",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    body: body,
  });
  const data = await response.json();
  return data;
}

export const JobApplication=async(body,OSSN)=>{
  const response = await fetch(`${BASE_URL}/message/send/${OSSN}/job-applications`,{
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return data;
}

export const ApplyForFA=async(body)=>{
  const response = await fetch(`${BASE_URL}/message/send/financial-aid-application`,{
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return data;
}
export const signupPatient = async (body) => {
  const response = await fetch(`${BASE_URL}/relatives`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return data;
};
export default api;