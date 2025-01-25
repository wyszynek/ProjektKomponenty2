import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TrainingPlanService from "../services/TrainingPlanService";
import WorkoutService from "../services/WorkoutService";
import "../styles/TrainingPlanDetails.css";
import EditTrainingPlan from "./EditTrainingPlan";
import ConfirmationModal from "./ConfirmationModal";

const TrainingPlanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEditPlanModal, setShowEditPlanModal] = useState(false);
  const [showModal, setShowModal] = useState(false); 

  useEffect(() => {
    const fetchPlanDetails = async () => {
      try {
        const planData = await TrainingPlanService.getTrainingPlanById(id);
        setPlan(planData);

        const workoutsData = await WorkoutService.getWorkoutsByPlanId(id);
        setWorkouts(workoutsData);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching training plan details:", err);
        setError("Failed to load training plan details. Please try again later.");
        setLoading(false);
      }
    };

    fetchPlanDetails();
  }, [id]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  };

  const handleDeletion = () => {
    setShowModal(true);
  };

  const handleDeletePlan = async () => {
    
      try {
        await TrainingPlanService.deleteTrainingPlan(id);
        setShowModal(false); 
        navigate("/training-plans");
      } catch (err) {
        console.error("Error deleting training plan:", err);
        alert("Failed to delete training plan. Please try again.");
      }
    
  };

  const handleCancelDelete = () => {
    setShowModal(false); 
  };

  const handleEditPlan = (updatedPlan) => {
    setPlan(updatedPlan); 
    setShowEditPlanModal(false); 
  };

  const handleCancelEditPlan = () => {
    setShowEditPlanModal(false);
  };

  if (loading) {
    return <div className="loading">Loading plan details...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!plan) {
    return <div className="error-message">Plan not found.</div>;
  }

  return (
    <div className="training-plan-details">
      <h3>{plan.name}</h3>
      <div className="dates">
        <p>
          <strong>Start Date:</strong> {formatDate(plan.startDate)}
        </p>
        <p>
          <strong>End Date:</strong> {formatDate(plan.endDate)}
        </p>
      </div>

      <h4>Workouts</h4>
      {workouts.length === 0 ? (
        <p>No workouts found for this plan.</p>
      ) : (
        <ul>
          {workouts.map((workout) => (
            <li key={workout.id} className="workout-item">
              <p>
                <strong>{formatDate(workout.date)}</strong>
              </p>
              <p>
                <strong>Type:</strong> {workout.trainingType}
              </p>
              <p>
                <strong>Duration:</strong> {workout.duration} mins
              </p>
              <p>
                <strong>Intensity:</strong> {workout.intensity}
              </p>
              <p>
                <strong>Description:</strong>{" "}
                {workout.description || "No description available"}
              </p>
            </li>
          ))}
        </ul>
      )}

      <button className="delete-button" onClick={handleDeletion}>
        Delete Plan
      </button>
      <button
          onClick={() => setShowEditPlanModal(true)}
        >
          Edit Plan
        </button>

        {showEditPlanModal && (
          <div className="modal-overlay">
            <EditTrainingPlan
              planId={plan.id}
              onUpdatePlan={handleEditPlan}
              onClose={handleCancelEditPlan}
            />
          </div>
        )}

        {showModal && (
          <ConfirmationModal
            message="Are you sure you want to delete this plan?"
            onConfirm={handleDeletePlan}
            onCancel={handleCancelDelete}
          />
        )}
    </div>
  );
};

export default TrainingPlanDetails;
