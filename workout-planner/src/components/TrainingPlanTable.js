import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'; // Zainicjalizuj useNavigate
import TrainingPlanService from "../services/TrainingPlanService";
import "../styles/TrainingPlanTable.css";

const TrainingPlanTable = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Zainicjalizuj useNavigate

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await TrainingPlanService.getTrainingPlans();
        const formattedPlans = data.map((plan) => ({
          ...plan,
          startDate: new Date(plan.startDate).toISOString().slice(0, 10),
          endDate: new Date(plan.endDate).toISOString().slice(0, 10),
        }));
        setPlans(formattedPlans);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching training plans:", err);
        setError("Failed to load training plans. Please try again later.");
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleRowClick = (planId) => {
    navigate(`/training-plans/${planId}`); // Nawiguj do szczegółów planu z id jako parametr
  };

  if (loading) {
    return <p>Loading training plans...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="training-plans-table">
      <h2>All Training Plans</h2>
      {plans.length === 0 ? (
        <p>No training plans available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Plan Name</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan, index) => (
              <tr
                key={plan.id}
                onClick={() => handleRowClick(plan.id)}
                style={{ cursor: "pointer" }} 
              >
                <td>{plan.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TrainingPlanTable;
