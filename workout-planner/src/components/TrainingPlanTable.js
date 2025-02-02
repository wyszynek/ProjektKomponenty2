import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import TrainingPlanService from "../services/TrainingPlanService";
import "../styles/TrainingPlanTable.css";

const TrainingPlanTable = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortField, setSortField] = useState("startDate");
  const [sortDirection, setSortDirection] = useState("desc");
  const navigate = useNavigate();

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

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedPlans = [...plans].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (sortField === "name") {
      return sortDirection === "asc" 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else {
      const dateA = new Date(aValue);
      const dateB = new Date(bValue);
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    }
  });

  const handleRowClick = (planId) => {
    navigate(`/training-plans/${planId}`);
  };

  if (loading) {
    return (
      <div className="training-plans-table">
        <p>Loading training plans...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="training-plans-table">
        <p className="error">{error}</p>
      </div>
    );
  }

  return (
    <div className="training-plans-table">
      <h2>Training Plans</h2>
      {plans.length === 0 ? (
        <p>No training plans available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort("name")} style={{ cursor: "pointer" }}>
                Plan Name {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("startDate")} style={{ cursor: "pointer" }}>
                Start Date {sortField === "startDate" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("endDate")} style={{ cursor: "pointer" }}>
                End Date {sortField === "endDate" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedPlans.map((plan) => (
              <tr
                key={plan.id}
                onClick={() => handleRowClick(plan.id)}
                style={{ cursor: "pointer" }}
              >
                <td>{plan.name}</td>
                <td>{plan.startDate}</td>
                <td>{plan.endDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TrainingPlanTable;