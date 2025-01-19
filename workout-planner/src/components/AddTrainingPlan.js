import React, { useState } from "react";
import TrainingPlanService from "../services/TrainingPlanService";
import "../styles/EditWorkout.css"; 

const AddTrainingPlan = ({ onAddPlan, onClose }) => {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !startDate || !endDate) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (endDate <= startDate) {
      setMessage("End date must be after the start date.");
      return;
    }

    const newTrainingPlan = { name, startDate, endDate };

    try {
      await TrainingPlanService.addTrainingPlan(newTrainingPlan);
      onAddPlan(newTrainingPlan);
      alert("Plan created successfully!");
      setName("");
      setStartDate("");
      setEndDate("");
    } catch (error) {
      setMessage("Failed to add training plan. Please try again.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="edit-workout-modal">
        <h2>Add New Training Plan</h2>
        {message && <p className="message">{message}</p>}

        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-field">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
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
              required
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
              required
              className="input-field"
            />
          </div>

          <div className="add-plan-buttons">
            <button type="submit" className="save-button">Add Training Plan</button>
            <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTrainingPlan;
