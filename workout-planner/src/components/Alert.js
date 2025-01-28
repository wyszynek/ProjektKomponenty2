import React from "react";
import PropTypes from "prop-types";
import "../styles/Alert.css";

const Alert = ({ type = "error", message, onClose }) => {
  if (!message) return null;

  const alertTypeClass = {
    success: "alert-success",
    error: "alert-error",
    warning: "alert-warning",
  };

  return (
    <div className={`alert ${alertTypeClass[type]}`}>
      <span>{message}</span>
      {onClose && (
        <button className="alert-close-button" onClick={onClose}>
          &times;
        </button>
      )}
    </div>
  );
};

Alert.propTypes = {
  type: PropTypes.oneOf(["success", "error", "warning"]),
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func,
};

export default Alert;
