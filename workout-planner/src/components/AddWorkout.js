import React, { useState, useEffect } from "react";
import WorkoutService from "../services/WorkoutService";
import WorkoutValidator from "../validators/WorkoutValidator";
import Alert from "./Alert";
import "../styles/EditWorkout.css";

const AddWorkoutModal = ({ onAddWorkout, onClose }) => {
  const [plans, setPlans] = useState([]);
  const [trainingPlanId, setTrainingPlanId] = useState("");
  const [date, setDate] = useState("");
  const [trainingType, setTrainingType] = useState("");
  const [duration, setDuration] = useState("");
  const [intensity, setIntensity] = useState("");
  const [description, setDescription] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("error");

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await WorkoutService.getTrainingPlans();
        const formattedPlans = data.map((plan) => ({
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
        setAlertMessage("Failed to fetch training plans.");
        setAlertType("error");
      }
    };

    fetchPlans();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedPlan = plans.find(
      (plan) => plan.id === parseInt(trainingPlanId)
    );
    const validationError = WorkoutValidator.validateWorkout({
      date,
      duration,
      intensity,
      trainingType,
      selectedPlan,
    });

    if (validationError) {
      setAlertMessage(validationError);
      setAlertType("error");
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

      setAlertMessage("Workout added successfully!");
      setAlertType("success");

      setDate("");
      setTrainingType("");
      setDuration("");
      setIntensity("");
      setDescription("");
    } catch (err) {
      console.error("Error adding workout:", err);
      setAlertMessage("Failed to add workout. Please try again.");
      setAlertType("error");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="edit-workout-modal">
        <h2>Add Workout</h2>
        <Alert
          type={alertType}
          message={alertMessage}
          onClose={() => setAlertMessage("")}
        />

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="trainingPlanId">Training Plan:</label>
            <select
              id="trainingPlanId"
              value={trainingPlanId}
              onChange={(e) => setTrainingPlanId(e.target.value)}
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
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label htmlFor="trainingType">Training Type:</label>
            <input
              type="text"
              id="trainingType"
              value={trainingType}
              onChange={(e) => setTrainingType(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label htmlFor="duration">Duration (minutes):</label>
            <input
              type="number"
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label htmlFor="intensity">Intensity (1-10):</label>
            <input
              type="number"
              id="intensity"
              value={intensity}
              onChange={(e) => setIntensity(e.target.value)}
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
          <div className="form-actions">
            <button type="submit" className="save-button">
              Add Workout
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

export default AddWorkoutModal;
