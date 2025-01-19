import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import trainingPlanService from "../services/TrainingPlanService";
import AddTrainingPlan from "./AddTrainingPlan";
import AddWorkout from "./AddWorkout";
import EditWorkout from "./EditWorkout";
import "../styles/CalendarComponent.css";

const CalendarComponent = () => {
    const [events, setEvents] = useState([]);
    const [trainingPlans, setTrainingPlans] = useState([]);
    const [workouts, setWorkouts] = useState([]);
    const [selectedWorkout, setSelectedWorkout] = useState(null);
    const [showAddPlanModal, setShowAddPlanModal] = useState(false);
    const [showAddWorkoutModal, setShowAddWorkoutModal] = useState(false);

    const handleAddPlan = (newPlan) => {
        setTrainingPlans((prevPlans) => [...prevPlans, newPlan]);
        setShowAddPlanModal(false);
    };

    const handleAddWorkout = (newWorkout) => {
        setWorkouts((prevWorkouts) => [...prevWorkouts, newWorkout]);
        fetchEvents();
        setShowAddWorkoutModal(false);
    };

    const fetchEvents = async () => {
        try {
            const plans = await trainingPlanService.getTrainingPlans();
            setTrainingPlans(plans);

            const allWorkouts = plans.flatMap(plan => 
                plan.workouts.map(workout => ({
                    ...workout,
                    trainingPlanId: plan.id,
                    planName: plan.name,
                }))
            );
            setWorkouts(allWorkouts);

            const formattedEvents = allWorkouts.map(workout => ({
                id: workout.id,
                title: workout.trainingType,
                date: workout.date.split("T")[0],
                description: workout.description,
                trainingPlanId: workout.trainingPlanId,
                planName: workout.planName,
            }));

            setEvents(formattedEvents);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleEventDrop = async (info) => {
        const event = info.event;
        const newDate = new Date(event.start).toISOString().split("T")[0];

        try {
            await trainingPlanService.updateWorkoutDate(event.id, newDate);
        } catch (error) {
            console.error("Error updating event date:", error);
            alert("Could not update event date");
        }
    };

    const handleEventClick = (info) => {
        const clickedWorkoutId = info.event.id;
        const workout = workouts.find(w => w.id.toString() === clickedWorkoutId);
        if (workout) {
            setSelectedWorkout(workout);
        }
    };

    const handleUpdateWorkout = (updatedWorkout) => {
        setWorkouts(prevWorkouts => 
            prevWorkouts.map(w => 
                w.id === updatedWorkout.id ? updatedWorkout : w
            )
        );
        fetchEvents();
    };

    const handleCancelAddWorkout = () => {
        setShowAddWorkoutModal(false);
    };

    const handleCancelAddPlan = () => {
        setShowAddPlanModal(false);
    };

    return (
        <div className="calendar-container">
            <div className="button-container">
                <button
                    className="add-button"
                    onClick={() => setShowAddPlanModal(true)}
                >
                    Add New Training Plan
                </button>
    
                <button
                    className="add-button"
                    onClick={() => setShowAddWorkoutModal(true)}
                >
                    Add New Workout
                </button>
            </div>
    
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                editable={true}
                eventDrop={handleEventDrop}
                locale="en"
                timeZone="UTC"
                height="auto"
                eventClick={handleEventClick}
                firstDay={1}
                eventContent={(arg) => (
                    <div className="event-tooltip">
                        <strong>{arg.event.title}</strong>
                        <div style={{ fontSize: "0.8em" }}>
                            {arg.event.extendedProps.planName}
                        </div>
                    </div>
                )}
            />
    
            {selectedWorkout && (
                <EditWorkout
                    workout={selectedWorkout}
                    plans={trainingPlans}
                    onClose={() => setSelectedWorkout(null)}
                    onUpdate={handleUpdateWorkout}
                />
            )}
    
            {showAddPlanModal && (
                <div className="modal-overlay">
                    <AddTrainingPlan onAddPlan={handleAddPlan} onClose={handleCancelAddPlan} />
                </div>
            )}
    
            {showAddWorkoutModal && (
                <div className="modal-overlay">
                    <AddWorkout onAddWorkout={handleAddWorkout} onClose={handleCancelAddWorkout} />
                </div>
            )}
        </div>
    );
    
};

export default CalendarComponent;
