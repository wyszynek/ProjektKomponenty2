import React, { useState, useEffect } from "react";
import WorkoutService from "../services/WorkoutService";
import '../styles/EditWorkout.css'; 

const AddWorkoutModal = ({ onAddWorkout, onClose }) => {
  const [plans, setPlans] = useState([]);
  const [trainingPlanId, setTrainingPlanId] = useState("");
  const [date, setDate] = useState("");
  const [trainingType, setTrainingType] = useState("");
  const [duration, setDuration] = useState("");
  const [intensity, setIntensity] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await WorkoutService.getTrainingPlans();
        const formattedPlans = data.map(plan => ({
          ...plan,
          startDate: new Date(plan.startDate).toISOString().slice(0, 10),
          endDate: new Date(plan.endDate).toISOString().slice(0, 10),
        }));
        setPlans(formattedPlans);
    
        if (formattedPlans.length > 0) {
          setTrainingPlanId(formattedPlans[0].id);
        }
      } catch (err) {
        console.error("Error fetching plans:", err);
      }
    };

    fetchPlans();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!duration || !date || !trainingType || !intensity) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (duration <= 0) {
      setMessage("Duration must be more than 0.");
      return;
    }

    if (intensity <= 0 || intensity > 10) {
      setMessage("Intensity must be between 1 and 10.");
      return;
    }

    const selectedPlan = plans.find((plan) => plan.id === parseInt(trainingPlanId));

    if (!selectedPlan) {
      setMessage("Selected training plan not found.");
      return;
    }

    const selectedDate = new Date(date);
    const planStartDate = new Date(selectedPlan.startDate);
    const planEndDate = new Date(selectedPlan.endDate);
  
    if (selectedDate < planStartDate || selectedDate > planEndDate) {
      setMessage(`The date in this plan must be between ${selectedPlan.startDate} and ${selectedPlan.endDate}.`);
      return;
    }

    const newWorkout = {
      trainingPlanId,
      date,
      trainingType,
      duration,
      intensity,
      description,
    };

    try {
      const addedWorkout = await WorkoutService.addWorkout(newWorkout);
      onAddWorkout(addedWorkout);
      alert("Workout added successfully!");
      setDate("");
      setTrainingType("");
      setDuration("");
      setIntensity("");
      setDescription("");
    } catch (err) {
      setMessage("Failed to add workout plan. Please try again.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="edit-workout-modal">
        <h2>Add Workout</h2>
        {message && <p className="message">{message}</p>}

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
