import axios from "axios";

const API_URL = "http://localhost:7777";

const getTrainingPlans = async () => {
  try {
    const response = await axios.get(`${API_URL}/plans/active`);
    return response.data;
  } catch (error) {
    console.error("Error fetching training plans", error);
    throw error;
  }
};

const addWorkout = async (workoutData) => {
  try {
    const response = await axios.post(`${API_URL}/workouts`, workoutData);
    return response.data;
  } catch (error) {
    console.error("Error adding workout", error);
    throw error;
  }
};

const getWorkoutsByPlanId = async (planId) => {
  try {
    const response = await axios.get(`${API_URL}/workouts?trainingPlanId=${planId}`);
    return response.data;
  } catch (err) {
    throw new Error("Error fetching workouts.");
  }
};

const deleteWorkout = async (workoutId) => {
  try {
    const response = await axios.delete(`${API_URL}/workouts/${workoutId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting workout", error);
    throw error;
  }
};

const updateWorkout = async (workoutId, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/workouts/${workoutId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating workout", error);
    throw error;
  }
};

const workoutService = {
  getTrainingPlans,
  addWorkout,
  getWorkoutsByPlanId,
  deleteWorkout,
  updateWorkout,
};

export default workoutService;