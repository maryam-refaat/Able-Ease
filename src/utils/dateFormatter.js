/**
 * Format a date string or Date object to dd/mm/yyyy format
 * @param {string|Date} dateInput - Date string or Date object
 * @returns {string} Formatted date string in dd/mm/yyyy format, or empty string if invalid
 */
export const formatDate = (dateInput) => {
  if (!dateInput) return "";

  try {
    const date = new Date(dateInput);

    // Check if date is valid
    if (isNaN(date.getTime())) return "";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  } catch (error) {
    return "";
  }
};

/**
 * Format a date to dd/mm/yyyy for display, with fallback text
 * @param {string|Date} dateInput - Date string or Date object
 * @param {string} fallback - Fallback text if date is invalid (default: "—")
 * @returns {string} Formatted date or fallback text
 */
export const formatDateWithFallback = (dateInput, fallback = "—") => {
  const formatted = formatDate(dateInput);
  return formatted || fallback;
};
