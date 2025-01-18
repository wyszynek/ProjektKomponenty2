import React, { useState, useEffect } from "react";
import axios from "axios";

const AddWorkout = ({ onAddWorkout }) => {
    const [plans, setPlans] = useState([]);
    const [trainingPlanId, setTrainingPlanId] = useState("");
    const [date, setDate] = useState("");
    const [trainingType, setTrainingType] = useState("");
    const [duration, setDuration] = useState("");
    const [intensity, setIntensity] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        axios
            .get("http://localhost:7777/plans")
            .then((response) => {
                setPlans(response.data);
                if (response.data.length > 0) {
                    setTrainingPlanId(response.data[0].id);
                }
            })
            .catch((err) => console.error("Error fetching plans:", err));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newWorkout = {
            trainingPlanId,
            date,
            trainingType,
            duration,
            intensity,
            description,
        };

        try {
            const response = await axios.post(
                "http://localhost:7777/workouts",
                newWorkout
            );
            onAddWorkout(response.data);
            alert("Workout added successfully!");
            setDate("");
            setTrainingType("");
            setDuration("");
            setIntensity("");
            setDescription("");
        } catch (err) {
            console.error("Error adding workout:", err);
            alert("Failed to add workout");
        }
    };

    return (
        <div>
            <h2>Add Workout</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Plan treningowy:
                    <select
                        value={trainingPlanId}
                        onChange={(e) => setTrainingPlanId(e.target.value)}
                    >
                        {plans.map((plan) => (
                            <option key={plan.id} value={plan.id}>
                                {plan.name}
                            </option>
                        ))}
                    </select>
                </label>
                <br />
                <label>
                    Data:
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </label>
                <br />
                <label>
                    Typ Treningu:
                    <input
                        type="text"
                        value={trainingType}
                        onChange={(e) => setTrainingType(e.target.value)}
                        required
                    />
                </label>
                <br />
                <label>
                    Czas trwania (minuty):
                    <input
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        required
                    />
                </label>
                <br />
                <label>
                    Intensywność:
                    <input
                        type="number"
                        value={intensity}
                        onChange={(e) => setIntensity(e.target.value)}
                        required
                    />
                </label>
                <br />
                <label>
                    Opis:
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </label>
                <br />
                <button type="submit">Dodaj Workout</button>
            </form>
        </div>
    );
};

export default AddWorkout;
