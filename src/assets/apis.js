import axios from "axios";

const API_KEY = "";
const BASE_URL = "https://localhost:7040/api"; // example: https://myserver.com/api

// Fetch a single patient by SSN
export const fetchAvailabletherapiesJoined = async (id) => {
  const response = await fetch(`${BASE_URL}/Therapy/center/${id}/joined`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  });
  const data = await response.json();
  return { data: data || [] };
};

export const deleteTherapy = async (therapyId) => {
  const response = await fetch(`${BASE_URL}/Therapy/delete/${therapyId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
};

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
  const response = await fetch(`${BASE_URL}/center/GetAllcenters`);
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
  const response = await fetch(`${BASE_URL}/Message/received/${RSSN}/contact`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  });
  const result = await response.json();
  const Recieved = result.data || result.results || result || [];
  return { data: Recieved };
};

export const getSent_msgs = async (RSSN) => {
  const response = await fetch(`${BASE_URL}/Message/sent/${RSSN}/contact`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  });
  const result = await response.json();
  const Sent = result.data || result.results || result || [];
  return { data: Sent };
};

export const getReceivedJobApplications = async (receiverSSN) => {
  const response = await fetch(
    `${BASE_URL}/Message/received/${receiverSSN}/job-applications`
  );
  const result = await response.json();
  const applications = result.data || result.results || result || [];
  return { data: applications };
};

export const addPatientWork = async (body) => {
  const response = await fetch(`${BASE_URL}/PatientWork/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
};

export const deleteReceivedMessage = async (receiverSSN, messageId) => {
  const response = await fetch(
    `${BASE_URL}/Message/received/${receiverSSN}/delete/${messageId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
};

export const deleteSentMessage = async (senderSSN, messageId) => {
  const response = await fetch(
    `${BASE_URL}/Message/sent/${senderSSN}/delete/${messageId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
};

export const rejectJobApplication = async (messageId) => {
  const response = await fetch(`${BASE_URL}/Message/reject/${messageId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
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
    `${BASE_URL}/Program/AddPatientToProgram/${OSSN}/${ProID}/${PSSN}`,
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
  const response = await fetch(`${BASE_URL}/Therapy/add`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
    body: formData,
  });
  return await response.json();
};

export const updatetherapy = async (formData) => {
  const response = await fetch(`${BASE_URL}/Therapy/update`, {
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
    `${BASE_URL}/Patientdisability/getpatientDisabilities/${Pssn}`
  );
  const data = await response.json();
  const Patient_disability = data.results || data || [];
  return { data: Patient_disability };
};

export const getAllDisabilities = async () => {
  const response = await fetch(`${BASE_URL}/Disability/GetAllDisabilities`);
  const data = await response.json();
  const disabilities = data.results || data || [];
  return { data: disabilities };
};

export const addPatientDisability = async (body) => {
  const response = await fetch(
    `${BASE_URL}/PatientDisability/AddDisabilityToPatient`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify(body),
    }
  );

  const contentType = response.headers.get("content-type") || "";
  if (!response.ok) {
    const errText = contentType.includes("application/json")
      ? await response.json()
      : await response.text();
    throw new Error(
      typeof errText === "string" ? errText : JSON.stringify(errText)
    );
  }

  if (contentType.includes("application/json")) {
    return await response.json();
  }
  return await response.text();
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
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Send message error:", errorData);
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }

  const data = await response.json();
  return data;
};



export const markMessageAsRead = async (receiverSSN, messageId) => {
  const response = await fetch(
    `${BASE_URL}/Message/received/${receiverSSN}/mark-seen/${messageId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  return data;
};

export const deletePatientSession = async (therapyId) => {
  const response = await fetch(`${BASE_URL}/Therapy/delete/${therapyId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  });

  const data = await response.text();
  return data;
};

export const deletePatientWork = async (patientssn, ossn) => {
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

// Forgot Password - sends reset email
export const forgotPassword = async (email) => {
  const response = await fetch(`${BASE_URL}/Account/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(email),
  });

  if (!response.ok) {
    throw new Error(`Failed to send reset email: ${response.status}`);
  }

  return await response.text();
};

// Reset Password - reset with token
export const resetPassword = async (email, token, newPassword) => {
  const response = await fetch(`${BASE_URL}/Account/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      token,
      newPassword,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to reset password: ${response.status}`);
  }

  return await response.text();
};

// Change password for current authenticated user
export const changePassword = async (body) => {
  const payload = {
    CurrentPassword: body?.CurrentPassword || body?.currentPassword || '',
    NewPassword: body?.NewPassword || body?.newPassword || '',
    ConfirmPassword: body?.ConfirmPassword || body?.confirmPassword || body?.NewPassword || body?.newPassword || ''
  };

  console.log('changePassword called');

  const response = await fetch(`${BASE_URL}/Account/ChangePassword`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json', 
      Authorization: `Bearer ${localStorage.getItem('authToken')}` 
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Change password failed');
  }

  const text = await response.text();
  return text || 'Password changed successfully';
};
export const getAllUsernames = async () => {
  const response = await fetch(`${BASE_URL}/Account/GetUsernames`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch usernames');
  }
  
  const data = await response.json();
  console.log('getAllUsernames response:', data);
  
  const users = Array.isArray(data) ? data : (data.results || data.data || []);
  return { data: users };
};

// Register a new user (generic). Backend Register expects a RegisterDTO with Role
export const registerUser = async (body) => {
  // Ensure the payload matches backend RegisterDTO
  const payload = {
    Name: body?.Name || body?.name || '',
    Role: body?.Role || body?.role || 0, // Use numeric role value
    Username: body?.Username || body?.username || '',
    Email: body?.Email || body?.email || '',
    Password: body?.Password || body?.password || '',
    ConfirmPassword: body?.ConfirmPassword || body?.confirmPassword || body?.Password || body?.password || '',
    PhoneNumber: body?.PhoneNumber || body?.phoneNumber || ''
  };

  console.log('registerUser payload:', payload);

  const response = await fetch(`${BASE_URL}/Account/Register`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json', 
      Authorization: `Bearer ${localStorage.getItem('authToken')}` 
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const contentType = response.headers.get('content-type') || '';
    const errText = contentType.includes('application/json') 
      ? await response.json() 
      : await response.text();
    throw new Error(typeof errText === 'string' ? errText : JSON.stringify(errText));
  }

  const text = await response.text();
  
  // Backend returns user ID as plain text on success
  try { 
    return JSON.parse(text); 
  } catch { 
    return { id: text, success: true }; 
  }
};

// Update an existing user (backend now expects PUT /Account/Update/{ssn})
// Accepts a payload object that must include `ssn` (or call as updateUser(ssn, body)).
// The request body will contain { name, email, role, phoneNumber } to match the server DTO.
export const getUsers = async (role = null, page = 1, pageSize = 50) => {
  try {
    const params = new URLSearchParams();
    if (role) params.append("role", role);
    params.append("page", page.toString());
    params.append("pageSize", pageSize.toString());

    const response = await fetch(`${BASE_URL}/Account/Users?${params.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.status}`);
    }

    const data = await response.json();
    // Your backend returns IEnumerable<ReturnUsersDto> directly
    const users = Array.isArray(data) ? data : (data.results || data.data || []);
    
    return { data: users };
  } catch (error) {
    console.error("getUsers error:", error.message);
    return { data: [] };
  }
};

/**
 * Get a specific user profile by SSN (Admin View)
 * Backend: [HttpGet("User/{ssn}")]
 */
export const getUserBySsn = async (ssn) => {
  if (!ssn) return { data: null };
  
  try {
    const response = await fetch(`${BASE_URL}/Account/User/${ssn}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    
    if (!response.ok) {
      console.warn('getUserBySsn failed:', response.status);
      return { data: null };
    }
    
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error("getUserBySsn error:", error.message);
    return { data: null };
  }
};

/**
 * Update an existing user's basic info
 * Backend: [HttpPut("Update/{ssn}")]
 */
export const updateUser = async (ssn, body) => {
  if (!ssn) throw new Error('updateUser requires ssn');

  // Map incoming camelCase frontend keys to Backend PascalCase DTO keys
  const payload = {
    Name: body?.name || body?.Name || '',
    Email: body?.email || body?.Email || '',
    Role: body?.role !== undefined ? body.role : (body?.Role || '')
  };

  const response = await fetch(`${BASE_URL}/Account/Update/${ssn}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json', 
      Authorization: `Bearer ${localStorage.getItem('authToken')}` 
    },
    body: JSON.stringify(payload),
  });

  const contentType = response.headers.get('content-type') || '';
  
  if (!response.ok) {
    const errText = contentType.includes('application/json') 
      ? await response.json() 
      : await response.text();
    throw new Error(typeof errText === "string" ? errText : JSON.stringify(errText));
  }

  // Handle both JSON and plain text ("User updated") responses
  if (contentType.includes('application/json')) {
    return await response.json();
  }
  return await response.text();
};
export default api;
