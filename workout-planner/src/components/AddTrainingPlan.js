import React, { useState } from "react";
import axios from "axios";
import {TrainingPlan} from "../models/TrainingPlan";

const AddTrainingPlan = ({ onAddPlan }) => {
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

    const newTrainingPlan = new TrainingPlan(null, name, startDate, endDate);

    try {
      const response = await axios.post("http://localhost:7777/plans", {
        name: newTrainingPlan.name,
        startDate: newTrainingPlan.startDate,
        endDate: newTrainingPlan.endDate,
      });

      if (response.status === 201) {
        setMessage("Training plan added successfully!");
        onAddPlan(newTrainingPlan); 
        setName("");
        setStartDate("");
        setEndDate("");
      }
    } catch (error) {
      console.error("Error adding training plan:", error);
      setMessage("Failed to add training plan. Please try again.");
    }
  };

  return (
    <div>
      <h2>Add New Training Plan</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="startDate">Start Date:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="endDate">End Date:</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Training Plan</button>
      </form>
    </div>
  );
};

export default AddTrainingPlan;
