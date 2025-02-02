import React, { useState, useEffect } from "react";
import TrainingPlanService from "../services/TrainingPlanService";
import TrainingPlanValidator from "../validators/TrainingPlanValidator";
import PropTypes from "prop-types";
import Alert from "../components/Alert";
import "../styles/EditWorkout.css";

const EditTrainingPlan = ({ planId, onUpdatePlan, onClose }) => {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("error");

  useEffect(() => {
    const fetchPlanDetails = async () => {
      try {
        const plan = await TrainingPlanService.getTrainingPlanById(planId);

        const formatDateForInput = (dateString) => {
          const date = new Date(dateString);
          return date.toISOString().split("T")[0];
        };

        setName(plan.name);
        setStartDate(formatDateForInput(plan.startDate));
        setEndDate(formatDateForInput(plan.endDate));
      } catch (error) {
        console.error("Error fetching training plan details:", error);
        setAlertMessage("Failed to load plan details. Please try again.");
        setAlertType("error");
      }
    };

    fetchPlanDetails();
  }, [planId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = TrainingPlanValidator.validateTrainingPlan({
      name,
      startDate,
      endDate,
    });
    if (validationError) {
      setAlertMessage(validationError);
      setAlertType("error");
      return;
    }

    const updatedPlan = { id: planId, name, startDate, endDate };

    try {
      await TrainingPlanService.updateTrainingPlan(planId, updatedPlan);
      onUpdatePlan(updatedPlan);
      setAlertMessage("Plan updated successfully!");
      setAlertType("success");
      setTimeout(() => {
        setAlertMessage("");
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error updating training plan:", error);
      setAlertMessage("Failed to update training plan. Please try again.");
      setAlertType("error");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="edit-workout-modal">
        <h2>Edit Training Plan</h2>

        <Alert
          type={alertType}
          message={alertMessage}
          onClose={() => setAlertMessage("")}
        />

        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-field">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="form-field">
            <label htmlFor="startDate">Start Date:</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="form-field">
            <label htmlFor="endDate">End Date:</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input-field"
            />
          </div>

          <button type="submit" className="save-button">
            Save Changes
          </button>
          <button type="button" className="cancel-button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

EditTrainingPlan.propTypes = {
  planId: PropTypes.number.isRequired,
  onUpdatePlan: PropTypes.func.isRequired, 
  onClose: PropTypes.func.isRequired, 
  plan: PropTypes.shape({ 
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
  }),
};

export default EditTrainingPlan;
