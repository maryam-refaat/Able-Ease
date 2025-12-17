export function getAuthState() {
  try {
    const isLoggedIn = localStorage.getItem("auth.isLoggedIn") === "true";
    const userType = localStorage.getItem("auth.userType") || null;
    const ssn = localStorage.getItem("ssn") || null;
    return { isLoggedIn, userType, ssn };
  } catch {
    return { isLoggedIn: false, userType: null, ssn: null };
  }
}

export function setAuthState({ isLoggedIn, userType, ssn, username, email, name }) {
  if (typeof isLoggedIn !== "undefined") {
    localStorage.setItem("auth.isLoggedIn", isLoggedIn ? "true" : "false");
  }
  if (typeof userType !== "undefined" && userType !== null) {
    localStorage.setItem("auth.userType", userType);
  }
  if (typeof ssn !== "undefined" && ssn !== null) {
    localStorage.setItem("ssn", ssn);
  }
  if (typeof username !== "undefined" && username !== null) {
    localStorage.setItem("auth.username", username);
  }
  if (typeof email !== "undefined" && email !== null) {
    localStorage.setItem("auth.email", email);
  }
  if (typeof name !== "undefined" && name !== null) {
    localStorage.setItem("auth.name", name);
  }
  window.dispatchEvent(new CustomEvent("auth-changed"));
}