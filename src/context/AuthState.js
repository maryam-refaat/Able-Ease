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

export function setAuthState({ isLoggedIn, userType, ssn }) {
  if (typeof isLoggedIn !== "undefined") {
    localStorage.setItem("auth.isLoggedIn", isLoggedIn ? "true" : "false");
  }
  if (typeof userType !== "undefined" && userType !== null) {
    localStorage.setItem("auth.userType", userType);
  }
  if (typeof ssn !== "undefined" && ssn !== null) {
    localStorage.setItem("ssn", ssn);
  }
  window.dispatchEvent(new CustomEvent("auth-changed"));
}
