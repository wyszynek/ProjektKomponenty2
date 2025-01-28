import React, { useState } from "react";
import TrainingPlanService from "../services/TrainingPlanService";
import TrainingPlanValidator from "../validators/TrainingPlanValidator";
import Alert from "./Alert";
import "../styles/EditWorkout.css";

const AddTrainingPlan = ({ onAddPlan, onClose }) => {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("error");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTrainingPlan = { name, startDate, endDate };

    const validationError =
      TrainingPlanValidator.validateTrainingPlan(newTrainingPlan);
    if (validationError) {
      setAlertMessage(validationError);
      setAlertType("error");
      return;
    }

    try {
      await TrainingPlanService.addTrainingPlan(newTrainingPlan);
      onAddPlan(newTrainingPlan);

      setAlertMessage("Plan added successfully!");
      setAlertType("success");

      setName("");
      setStartDate("");
      setEndDate("");
    } catch (error) {
      setAlertMessage("Failed to add training plan. Please try again.");
      setAlertType("error");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="edit-workout-modal">
        <h2>Add New Training Plan</h2>

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

          <div className="add-plan-buttons">
            <button type="submit" className="save-button">
              Add Training Plan
            </button>
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTrainingPlan;
