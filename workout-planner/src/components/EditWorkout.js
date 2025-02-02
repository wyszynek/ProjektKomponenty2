import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import WorkoutValidator from "../validators/WorkoutValidator";
import Alert from "../components/Alert";
import ConfirmationModal from "../components/ConfirmationModal";
import workoutService from "../services/WorkoutService";
import "../styles/EditWorkout.css";

const EditWorkout = ({ workout, onClose, onUpdate, onDelete, plans }) => {
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
  const [showModal, setShowModal] = useState(false);

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
      const response = await workoutService.updateWorkout(workout.id, updatedData);
      onUpdate(response);
      onClose();
    } catch (err) {
      setErrorMessage("Failed to update workout.");
    }
  };

  const handleDeletion = () => {
    setShowModal(true);
  };

  const handleDeleteWorkout = async () => {
    try {
      await workoutService.deleteWorkout(workout.id);
      onDelete(workout.id);
      onClose();
    } catch (err) {
      setErrorMessage("Failed to delete workout.");
    }
  };

  const handleCancelDelete = () => {
    setShowModal(false);
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
          
          <button
            type="button"
            className="delete-button"
            onClick={handleDeletion}
          >
            Delete Workout
          </button>
          <button type="button" className="cancel-edit-button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>

      {showModal && (
        <ConfirmationModal
          message="Are you sure you want to delete this plan?"
          onConfirm={handleDeleteWorkout}
          onCancel={handleCancelDelete}
        />
      )}

    </div>
  );
};

EditWorkout.propTypes = {
  workout: PropTypes.shape({
    id: PropTypes.number.isRequired,
    trainingPlanId: PropTypes.number,
    date: PropTypes.string,
    trainingType: PropTypes.string,
    duration: PropTypes.number,
    intensity: PropTypes.number,
    description: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  plans: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default EditWorkout;
