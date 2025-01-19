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

export default {
    getTrainingPlans,
    addWorkout
};
