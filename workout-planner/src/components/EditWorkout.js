import React, { useState, useEffect } from "react";
import axios from "axios";
import '../styles/EditWorkout.css'; 

const EditWorkout = ({ workout, onClose, onUpdate, plans }) => {
    const [formData, setFormData] = useState({
        trainingPlanId: workout.trainingPlanId?.toString() || "",
        date: workout.date ? workout.date.split('T')[0] : "",
        trainingType: workout.trainingType || "",
        duration: workout.duration || "",
        intensity: workout.intensity || "",
        description: workout.description || ""
    });

    useEffect(() => {
        setFormData({
            trainingPlanId: workout.trainingPlanId?.toString() || "",
            date: workout.date ? workout.date.split('T')[0] : "",
            trainingType: workout.trainingType || "",
            duration: workout.duration || "",
            intensity: workout.intensity || "",
            description: workout.description || ""
        });
    }, [workout]);

    const [changedFields, setChangedFields] = useState({});

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        setChangedFields(prev => ({
            ...prev,
            [field]: true
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const updatedData = {};
        Object.keys(changedFields).forEach(field => {
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
            alert("Trening zaktualizowany pomyślnie!");
        } catch (err) {
            alert("Nie udało się zaktualizować treningu");
        }
    };
    return (
        <div className="modal-overlay">
            <div className="edit-workout-modal">
                <h2>Edit Workout</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label>
                            Training Plan:
                        </label>
                        <select
                            value={formData.trainingPlanId}
                            onChange={(e) => handleChange('trainingPlanId', e.target.value)}
                        >
                            {plans?.map((plan) => (
                                <option 
                                    key={plan.id} 
                                    value={plan.id.toString()}
                                    selected={plan.id.toString() === formData.trainingPlanId}
                                >
                                    {plan.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-field">
                        <label>
                            Date:
                        </label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => handleChange('date', e.target.value)}
                        />
                    </div>
                    <div className="form-field">
                        <label>
                            Training Type:
                        </label>
                        <input
                            type="text"
                            value={formData.trainingType}
                            onChange={(e) => handleChange('trainingType', e.target.value)}
                        />
                    </div>
                    <div className="form-field">
                        <label>
                            Duration (minutes):
                        </label>
                        <input
                            type="number"
                            value={formData.duration}
                            onChange={(e) => handleChange('duration', e.target.value)}
                        />
                    </div>
                    <div className="form-field">
                        <label>
                            Intensity:
                        </label>
                        <input
                            type="number"
                            value={formData.intensity}
                            onChange={(e) => handleChange('intensity', e.target.value)}
                        />
                    </div>
                    <div className="form-field">
                        <label>
                            Description:
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                        />
                    </div>
                    <button type="submit" className="save-button">Save Changes</button>
                    <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
    
    
};

export default EditWorkout;
