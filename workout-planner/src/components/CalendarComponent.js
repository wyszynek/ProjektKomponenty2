import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import trainingPlanService from "../services/TrainingPlanService";
import AddTrainingPlan from "./AddTrainingPlan";
import AddWorkout from "./AddWorkout";

const CalendarComponent = () => {
    const [events, setEvents] = useState([]);
    const [trainingPlans, setTrainingPlans] = useState([]);
    const [workouts, setWorkouts] = useState([]);

    const handleAddPlan = (newPlan) => {
        setTrainingPlans((prevPlans) => [...prevPlans, newPlan]);
    };

    const handleAddWorkout = (newWorkout) => {
        setWorkouts((prevWorkouts) => [...prevWorkouts, newWorkout]);
        fetchEvents();
    };

    const fetchEvents = async () => {
        try {
            const plans = await trainingPlanService.getTrainingPlans();

            const formattedEvents = plans.flatMap(plan =>
                plan.workouts.map(workout => ({
                    id: workout.id,
                    title: workout.trainingType,
                    date: workout.date.split("T")[0],
                    description: workout.description,
                }))
            );

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


    return (
        <div>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                editable={true}
                eventDrop={handleEventDrop}
                height="auto"
                locale="pl"
                timeZone="UTC"
            />

            <AddTrainingPlan onAddPlan={handleAddPlan} />

            <AddWorkout onAddWorkout={handleAddWorkout} />
        </div>
    );
};

export default CalendarComponent;
