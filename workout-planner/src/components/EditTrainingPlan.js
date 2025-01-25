import React, { useState, useEffect } from "react";
import TrainingPlanService from "../services/TrainingPlanService";
import "../styles/EditWorkout.css";

const EditTrainingPlan = ({ planId, onUpdatePlan, onClose }) => {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");

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
        setMessage("Failed to load plan details. Please try again.");
      }
    };
  
    fetchPlanDetails();
  }, [planId]);

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

    const updatedPlan = { id: planId, name, startDate, endDate };

    try {
      await TrainingPlanService.updateTrainingPlan(planId, updatedPlan);
      onUpdatePlan(updatedPlan);
      alert("Plan updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating training plan:", error);
      setMessage("Failed to update training plan. Please try again.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="edit-workout-modal">
        <h2>Edit Training Plan</h2>
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

            <button type="submit" className="save-button">Save Changes</button>
            <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default EditTrainingPlan;
