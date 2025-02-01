import React, { useState, useEffect } from "react";
import axios from "axios";
import WorkoutValidator from "../validators/WorkoutValidator";
import Alert from "../components/Alert";
import "../styles/EditWorkout.css";

const EditWorkout = ({ workout, onClose, onUpdate, plans }) => {
  const [formData, setFormData] = useState({
    trainingPlanId: workout.trainingPlanId?.toString() || "",
    date: workout.date ? workout.date.split("T")[0] : "",
    trainingType: workout.trainingType || "",
    duration: workout.duration || "",
    intensity: workout.intensity || "",
    description: workout.description || "",
  });

  const [changedFields, setChangedFields] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    setFormData({
      trainingPlanId: workout.trainingPlanId?.toString() || "",
      date: workout.date ? workout.date.split("T")[0] : "",
      trainingType: workout.trainingType || "",
      duration: workout.duration || "",
      intensity: workout.intensity || "",
      description: workout.description || "",
    });
  }, [workout]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setChangedFields((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedPlan = plans.find(
      (plan) => plan.id.toString() === formData.trainingPlanId
    );

    const validationError = WorkoutValidator.validateWorkout({
      date: formData.date,
      duration: formData.duration,
      intensity: formData.intensity,
      trainingType: formData.trainingType,
      selectedPlan,
    });

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    const updatedData = {};
    Object.keys(changedFields).forEach((field) => {
      if (changedFields[field]) {
        updatedData[field] = formData[field];
      }
    });

    try {
      const response = await axios.put(
        `http://localhost:7777/workouts/${workout.id}`,
        updatedData
      );
      onUpdate(response.data);
      onClose();
    } catch (err) {
      setErrorMessage("Failed to update workout.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="edit-workout-modal">
        <h2>Edit Workout</h2>

        {errorMessage && (
          <Alert
            type="error"
            message={errorMessage}
            onClose={() => setErrorMessage(null)}
          />
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Training Plan:</label>
            <select
              value={formData.trainingPlanId}
              onChange={(e) => handleChange("trainingPlanId", e.target.value)}
            >
              {plans?.map((plan) => (
                <option key={plan.id} value={plan.id.toString()}>
                  {plan.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label>Date:</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>Training Type:</label>
            <input
              type="text"
              value={formData.trainingType}
              onChange={(e) => handleChange("trainingType", e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>Duration (minutes):</label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => handleChange("duration", e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>Intensity:</label>
            <input
              type="number"
              value={formData.intensity}
              onChange={(e) => handleChange("intensity", e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>Description:</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
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

export default EditWorkout;
