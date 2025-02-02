import React from 'react';
import PropTypes from 'prop-types';
import '../styles/ConfirmationModal.css';

const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <div className="modal-buttons">
          <button className="modal-button cancel" onClick={onCancel}>Cancel</button>
          <button className="modal-button confirm" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

ConfirmationModal.propTypes = {
  message: PropTypes.string.isRequired, 
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired, 
};

export default ConfirmationModal;
