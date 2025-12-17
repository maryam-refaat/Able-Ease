import axios from "axios";

const API_KEY = "";
const BASE_URL = "https://localhost:7040/api"; // example: https://myserver.com/api

// Fetch a single patient by SSN
export const getPatientBySSN = async (ssn) => {
  if (!ssn) return { data: null };

  try {
    const response = await fetch(`${BASE_URL}/Patients/GetPatientBySSN/${ssn}`);

    if (!response.ok) {
      console.warn(
        `getPatientBySSN returned ${response.status}, falling back to demo data`
      );
      return { data: null }; // Fall back, don't throw
    }

    const data = await response.json();
    console.log("getPatientBySSN raw response:", data); // Log full response

    // Check different possible response structures
    const patient = data?.data || data?.results || data || null;
    console.log("getPatientBySSN extracted patient:", patient);

    return { data: patient };
  } catch (error) {
    console.warn("getPatientBySSN failed:", error.message);
    return { data: null }; // Return null to use fallback demo data
  }
};

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
  const response = await fetch(`${BASE_URL}/relative/register`, {
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
  const response = await fetch(`${BASE_URL}/Message/sent/${Oid}/job-proposals`);
  const data = await response.json();
  const proposals = data.results || data.data || [];
  return { data: proposals };
};

export const getPatient_Reports = async (PSSN) => {
  try {
    const response = await fetch(
      `${BASE_URL}/Report/GetReportsByPatient/${PSSN}`
    );

    if (!response.ok) {
      console.warn(`getPatient_Reports returned ${response.status}`);
      return { data: [] };
    }

    const text = await response.text();
    if (!text) {
      console.warn("getPatient_Reports returned empty response");
      return { data: [] };
    }

    const data = JSON.parse(text);
    console.log("getPatient_Reports data:", data);
    const reports = data.data || data.results || data || [];
    return { data: reports };
  } catch (error) {
    console.error("getPatient_Reports error:", error.message);
    return { data: [] };
  }
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

export const AddPatientToProgram = async (PSSN, ProID, OSSN) => {
  const response = await fetch(
    `${BASE_URL}/Program/AddPatienttoprogram/${OSSN}/${ProID}/${PSSN}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.text();
  return data;
};

export const AddPatientToTherapy = async (body) => {
  const formData = new FormData();

  // Add all fields to FormData
  formData.append("Name", body.Name || "");
  formData.append("duration", body.duration || 0);
  formData.append("PricePerHour", body.PricePerHour || 0);
  formData.append("Doctorname", body.Doctorname || "");
  formData.append("therapyDetails", body.therapyDetails || "");
  formData.append("Date", body.Date || "");
  if (body.PatientSSN) formData.append("PatientSSN", body.PatientSSN);
  formData.append("CenterID", body.CenterID || "");
  if (body.Image) formData.append("Image", body.Image);

  const response = await fetch(`${BASE_URL}/therapy/add`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("authToken"),
    },
    body: formData,
  });
  const data = await response.json();
  return data;
};

export const JobApplication = async (body) => {
  const response = await fetch(`${BASE_URL}/message/send/job-application`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return data;
};

export const ApplyForFA = async (body) => {
  const response = await fetch(
    `${BASE_URL}/message/send/financial-aid-application`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
  const data = await response.json();
  return data;
};
export const signupPatient = async (body) => {
  const response = await fetch(`${BASE_URL}/patients/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return data;
};

export const signupOrganization = async (body) => {
  const isFormData = body instanceof FormData;

  const requestConfig = {
    method: "POST",
    body: isFormData ? body : JSON.stringify(body),
  };

  // Only set Content-Type for JSON, let browser handle FormData
  if (!isFormData) {
    requestConfig.headers = { "Content-Type": "application/json" };
  }

  const response = await fetch(
    `${BASE_URL}/Organizations/register`,
    requestConfig
  );
  const data = await response.json();
  return data;
};

export const signupCaregiver = async (body) => {
  const isFormData = body instanceof FormData;

  const requestConfig = {
    method: "POST",
    body: isFormData ? body : JSON.stringify(body),
  };

  // Only set Content-Type for JSON, let browser handle FormData
  if (!isFormData) {
    requestConfig.headers = { "Content-Type": "application/json" };
  }

  const response = await fetch(`${BASE_URL}/Caregiver/register`, requestConfig);
  const data = await response.json();
  return data;
};

export const signupTherapy = async (body) => {
  const isFormData = body instanceof FormData;

  const requestConfig = {
    method: "POST",
    body: isFormData ? body : JSON.stringify(body),
  };

  // Only set Content-Type for JSON, let browser handle FormData
  if (!isFormData) {
    requestConfig.headers = { "Content-Type": "application/json" };
  }

  const response = await fetch(`${BASE_URL}/Center/register`, requestConfig);
  const data = await response.json();
  return data;
};

export const loginAPI = async (body) => {
  const response = await fetch(`${BASE_URL}/account/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return data;
};

export const getrelativebyid = async (ssn) => {
  const response = await fetch(`${BASE_URL}/relative/getrelative/${ssn}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  });
  const data = await response.json();
  return data;
};

export const getRelativeBySSN = async (ssn) => {
  const response = await fetch(`${BASE_URL}/Relative/GetRelative/${ssn}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  });
  const data = await response.json();
  return data;
};

export const addMedicalInfo = async (body) => {
  console.log("addMedicalInfo called with body:", body);

  const response = await fetch(`${BASE_URL}/MedicalInfo/AddMedicalInfo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
    body: JSON.stringify(body),
  });

  console.log("Response status:", response.status);
  console.log("Response headers:", response.headers);

  // If server returns text/plain, parsing JSON will throw.
  // Treat any 2xx as success and return text or empty.
  const contentType = response.headers.get("content-type") || "";
  if (!response.ok) {
    const errText = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    console.error("Server error response:", errText);

    throw new Error(
      typeof errText === "string" ? errText : JSON.stringify(errText)
    );
  }

  if (contentType.includes("application/json")) {
    return await response.json();
  }
  // text/plain or empty body
  try {
    return await response.text();
  } catch {
    return "";
  }
};

export const fetchAvailablePrograms = async (ssn) => {
  const response = await fetch(
    `${BASE_URL}/program/organizationprograms/${ssn}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    }
  );

  // 👇 لو مفيش برامج
  if (response.status === 404) {
    return { data: [] };
  }

  // 👇 أي error تاني
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to fetch programs");
  }

  // 👇 تأكد إن المحتوى JSON
  const contentType = response.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    return { data: [] };
  }

  const data = await response.json();
  return { data };
};

export const addProgram = async (organizationSsn, formData) => {
  const res = await fetch(
    `https://localhost:7040/api/Program/AddProgram/${organizationSsn}`,
    {
      method: "POST",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,

      body: formData,
    }
  );

  if (!res.ok) {
    const error = await res.json();
    console.error(error);
    throw new Error("Add program failed: " + (error.title || res.statusText));
  }

  return res.json(); // should return the new program with ID
};

export const updateProgram = async (ssn, programId, formData) => {
  const response = await fetch(
    `${BASE_URL}/program/updateprogram/${ssn}/${programId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        // DO NOT set "Content-Type" for FormData
      },
      body: formData, // send as FormData
    }
  );

  if (!response.ok) {
    const err = await response.json();
    throw new Error(
      `Update program failed: ${response.status} - ${JSON.stringify(err)}`
    );
  }

  return response.json();
};

export const deletePatientFromProgram = async (programId, patientId, ssn) => {
  const response = await fetch(
    `${BASE_URL}/program/removepatientfromprogram/${ssn}/${programId}/${patientId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    }
  );

  const data = await response.text();
  return data;
};

export const getProgramPatients = async (programId, ssn) => {
  const response = await fetch(
    `${BASE_URL}/program/getprogrampatients/${ssn}/${programId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    }
  );
  return response.json();
};

// Therapy APIs
export const fetchAvailabletherapies = async (centerSSN) => {
  const response = await fetch(
    `${BASE_URL}/Therapy/center/${centerSSN}/unjoined`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    }
  );
  const data = await response.json();
  return { data: data || [] };
};

export const addtherapy = async (formData) => {
  const response = await fetch(`${BASE_URL}/therapy/add`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
    body: formData,
  });
  return await response.json();
};

export const updatetherapy = async (formData) => {
  const therapyId = formData.get("Id") || formData.get("id");
  const response = await fetch(`${BASE_URL}/therapy/update/${therapyId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
    body: formData,
  });
  return await response.json();
};

export const getReportByPatient = async (Pssn) => {
  const response = await fetch(
    `${BASE_URL}/report/getReportsByPatient/${Pssn}`
  );
  const data = await response.json();
  const Patient_reports = data.results || data || [];
  return { data: Patient_reports };
};

export const getTherapyByPatient = async (Pssn) => {
  try {
    const response = await fetch(`${BASE_URL}/therapy/Patient/${Pssn}`);

    if (!response.ok) {
      console.warn(`getTherapyByPatient returned ${response.status}`);
      return { data: [] };
    }

    const text = await response.text();
    if (!text) {
      console.warn("getTherapyByPatient returned empty response");
      return { data: [] };
    }

    const data = JSON.parse(text);
    console.log("getTherapyByPatient data:", data);
    const Patient_therapies = data.data || data.results || data || [];
    return { data: Patient_therapies };
  } catch (error) {
    console.error("getTherapyByPatient error:", error.message);
    return { data: [] };
  }
};

export const getWorkByPatient = async (Pssn) => {
  try {
    const response = await fetch(
      `${BASE_URL}/PatientWork/getby-patient/${Pssn}`
    );

    if (!response.ok) {
      console.warn(`getWorkByPatient returned ${response.status}`);
      return { data: [] };
    }

    const text = await response.text();
    if (!text) {
      console.warn("getWorkByPatient returned empty response");
      return { data: [] };
    }

    const data = JSON.parse(text);
    console.log("getWorkByPatient data:", data);
    const Patient_work = data.data || data.results || data || [];
    return { data: Patient_work };
  } catch (error) {
    console.error("getWorkByPatient error:", error.message);
    return { data: [] };
  }
};

export const getPatientDisability = async (Pssn) => {
  const response = await fetch(
    `${BASE_URL}/Patientdisability/getpatientBisabilities/${Pssn}`
  );
  const data = await response.json();
  const Patient_disability = data.results || data || [];
  return { data: Patient_disability };
};

export const getFAByPatient = async (Pssn) => {
  const response = await fetch(
    `${BASE_URL}/FinancialAid/getFinancialAidsByPatient/${Pssn}`
  );
  const data = await response.json();
  const Patient_work = data.results || data || [];
  return { data: Patient_work };
};

export const getProgramByPatient = async (Pssn) => {
  try {
    const response = await fetch(
      `${BASE_URL}/patients/getProgramByPatientSSN/${Pssn}`
    );

    if (!response.ok) {
      console.warn(`getProgramByPatient returned ${response.status}`);
      return { data: [] };
    }

    const text = await response.text();
    if (!text) {
      console.warn("getProgramByPatient returned empty response");
      return { data: [] };
    }

    const data = JSON.parse(text);
    console.log("getProgramByPatient raw data:", data);

    // The API returns a SINGLE PROGRAM OBJECT directly
    // Check if it's a program object (has id and name fields)
    if (data?.id && data?.name) {
      const program = {
        id: data.id,
        name: data.name,
        organizationSSN: data.organizationSSN || "",
        organizationName: data.organizationName || "",
        startDate: data.startDate || "",
        endDate: data.endDate || "",
        status: data.status || "Active",
        price: data.price || 0,
        imageUrl: data.imageUrl || "",
        imgUrl: data.imageUrl || "", // Add both for compatibility
        location: data.location || "",
      };
      console.log("getProgramByPatient extracted program:", program);
      return { data: [program] }; // Wrap in array since code expects array
    }

    // If it's already an array, return as is
    if (Array.isArray(data)) {
      return { data };
    }

    // Otherwise try standard extraction
    const patient_prog = data?.data || data?.results || [];
    return { data: patient_prog };
  } catch (error) {
    console.error("getProgramByPatient error:", error.message);
    return { data: [] };
  }
};

export const getMedicalInfoByPatient = async (Pssn) => {
  const response = await fetch(
    `${BASE_URL}/MedicalInfo/GetMedicalInfoByPatient/${Pssn}`
  );
  const data = await response.json();
  const patient_prog = data.results || data || [];
  return { data: patient_prog };
};

export const sendMssg = async (body) => {
  const response = await fetch(`${BASE_URL}/Message/send/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return data;
};

export const deletePatientSession = async (therapyId) => {
  const response = await fetch(
    `${BASE_URL}/Therapy/delete/${therapyId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    }
  );

  const data = await response.text();
  return data;
};

export const deletePatientWork = async (patientssn,ossn) => {
  const response = await fetch(
    `${BASE_URL}/patientwork/delete/${patientssn}/${ossn}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    }
  );

  const data = await response.text();
  return data;
};

export default api;