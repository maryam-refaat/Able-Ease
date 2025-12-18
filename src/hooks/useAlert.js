import { useState } from "react";

export const useAlert = () => {
  const [alertState, setAlertState] = useState({
    isOpen: false,
    message: "",
    type: "info",
  });

  const showAlert = (message, type = "info") => {
    setAlertState({
      isOpen: true,
      message,
      type,
    });
  };

  const closeAlert = () => {
    setAlertState({
      isOpen: false,
      message: "",
      type: "info",
    });
  };

  return {
    alertState,
    showAlert,
    closeAlert,
  };
};
