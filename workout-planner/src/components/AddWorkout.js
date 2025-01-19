import React, { useState, useEffect } from "react";
import axios from "axios";
import '../styles/EditWorkout.css'; 

const AddWorkoutModal = ({ onAddWorkout, onClose }) => {
  const [plans, setPlans] = useState([]);
  const [trainingPlanId, setTrainingPlanId] = useState("");
  const [date, setDate] = useState("");
  const [trainingType, setTrainingType] = useState("");
  const [duration, setDuration] = useState("");
  const [intensity, setIntensity] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:7777/plans")
      .then((response) => {
        setPlans(response.data);
        if (response.data.length > 0) {
          setTrainingPlanId(response.data[0].id);
        }
      })
      .catch((err) => console.error("Error fetching plans:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newWorkout = {
      trainingPlanId,
      date,
      trainingType,
      duration,
      intensity,
      description,
    };

    try {
      const response = await axios.post("http://localhost:7777/workouts", newWorkout);
      onAddWorkout(response.data);
      alert("Workout added successfully!");
      setDate("");
      setTrainingType("");
      setDuration("");
      setIntensity("");
      setDescription("");
    } catch (err) {
      console.error("Error adding workout:", err);
      alert("Failed to add workout");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="edit-workout-modal">
        <h2>Add Workout</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="trainingPlanId">Training Plan:</label>
            <select
              id="trainingPlanId"
              value={trainingPlanId}
              onChange={(e) => setTrainingPlanId(e.target.value)}
              required
            >
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="date">Date:</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="trainingType">Training Type:</label>
            <input
              id="trainingType"
              type="text"
              value={trainingType}
              onChange={(e) => setTrainingType(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="duration">Duration (minutes):</label>
            <input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="intensity">Intensity:</label>
            <input
              id="intensity"
              type="number"
              value={intensity}
              onChange={(e) => setIntensity(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button type="submit" className="save-button">Add Workout</button>
          <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default AddWorkoutModal;
