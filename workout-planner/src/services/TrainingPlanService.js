import axios from "axios";
import {TrainingPlan} from "../models/TrainingPlan";
import {Workout} from "../models/Workout";

const API_URL = "http://localhost:7777";

const getTrainingPlans = async () => {
    try {
        const response = await axios.get(`${API_URL}/plans`);
        const plans = response.data;

        return plans.map(plan => {
            const workouts = plan.Workouts.map(workout => new Workout(
                workout.id,
                workout.date,
                workout.trainingType,
                workout.duration,
                workout.intensity,
                workout.description
            ));

            return new TrainingPlan(
                plan.id,
                plan.name,
                plan.startDate,
                plan.endDate,
                workouts
            );
        });
    } catch (error) {
        console.error("Error fetching training plans", error);
        throw error;
    }
};

const updateWorkoutDate = async (workoutId, newDate) => {
    try {
        const formattedDate = new Date(newDate).toISOString().split("T")[0];
        await axios.put(`${API_URL}/workouts/${workoutId}`, { date: formattedDate });
    } catch (error) {
        console.error("Error updating workout date", error);
        throw error;
    }
};


export default {
    getTrainingPlans,
    updateWorkoutDate,
};
