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
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [isMouseInsideDialog, setIsMouseInsideDialog] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState("all");

  const filteredEvents =
    selectedPlanId === "all"
      ? events
      : events.filter(
          (event) => String(event.trainingPlanId) === String(selectedPlanId)
        );

  const handleAddPlan = (newPlan) => {
    setTrainingPlans((prevPlans) => [...prevPlans, newPlan]);
    setShowAddPlanModal(false);
  };

  const handleAddWorkout = (newWorkout) => {
    setWorkouts((prevWorkouts) => [...prevWorkouts, newWorkout]);
    setShowAddWorkoutModal(false);
    fetchEvents();
  };

  const fetchEvents = async () => {
    try {
      const plans = await trainingPlanService.getTrainingPlans();

      const plansWithColors = plans.map((plan) => ({
        ...plan,
        color: getRandomColor(),
      }));
      setTrainingPlans(plansWithColors);

      const allWorkouts = plansWithColors.flatMap((plan) =>
        plan.workouts.map((workout) => ({
          ...workout,
          trainingPlanId: plan.id,
          planName: plan.name,
          color: plan.color,
        }))
      );
      setWorkouts(allWorkouts);

      const formattedEvents = allWorkouts.map((workout) => ({
        id: workout.id,
        title: workout.trainingType,
        date: workout.date.split("T")[0],
        description: workout.description,
        trainingPlanId: workout.trainingPlanId,
        planName: workout.planName,
        color: workout.color,
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
    const workout = workouts.find((w) => w.id.toString() === clickedWorkoutId);
    if (workout) {
      setSelectedWorkout(workout);
    }
  };

  const handleUpdateWorkout = (updatedWorkout) => {
    setWorkouts((prevWorkouts) =>
      prevWorkouts.map((w) => (w.id === updatedWorkout.id ? updatedWorkout : w))
    );
    fetchEvents();
  };

  const handleCancelAddWorkout = () => {
    setShowAddWorkoutModal(false);
  };

  const handleCancelAddPlan = () => {
    setShowAddPlanModal(false);
  };

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  let hoverTimeout;

  const handleMouseEnter = (info) => {
    const eventId = info.event.id;
    const eventDetails = workouts.find(
      (workout) => workout.id.toString() === eventId
    );

    const cursorPosition = {
      x: info.jsEvent.pageX,
      y: info.jsEvent.pageY,
    };
    console.log(events);
    hoverTimeout = setTimeout(() => {
      setHoveredEvent({ ...eventDetails, position: cursorPosition });
      setShowEventDialog(true);
    }, 2000);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout);
    setShowEventDialog(false);
    setHoveredEvent(null);
  };

  const handleDeleteWorkout = (workoutId) => {
    setWorkouts(prevWorkouts => prevWorkouts.filter(w => w.id !== workoutId));
    fetchEvents();
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

      <div className="filter-container">
        <label htmlFor="plan-select">Filter by Training Plan:</label>
        <select
          id="plan-select"
          value={selectedPlanId}
          onChange={(e) => setSelectedPlanId(e.target.value)}
        >
          <option value="all">All Plans</option>
          {trainingPlans.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.name}
            </option>
          ))}
        </select>
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={filteredEvents}
        editable={true}
        eventDrop={handleEventDrop}
        locale="en"
        timeZone="UTC"
        height="auto"
        eventClick={handleEventClick}
        eventMouseEnter={handleMouseEnter}
        eventMouseLeave={handleMouseLeave}
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
          onDelete={handleDeleteWorkout}
        />
      )}

      {showAddPlanModal && (
        <div className="modal-overlay">
          <AddTrainingPlan
            onAddPlan={handleAddPlan}
            onClose={handleCancelAddPlan}
          />
        </div>
      )}

      {showAddWorkoutModal && (
        <div className="modal-overlay">
          <AddWorkout
            onAddWorkout={handleAddWorkout}
            onClose={handleCancelAddWorkout}
          />
        </div>
      )}

      {showEventDialog && hoveredEvent && (
        <div
          className="event-dialog"
          style={{
            position: "absolute",
            top: `${hoveredEvent.position.y}px`,
            left: `${hoveredEvent.position.x}px`,
          }}
          onMouseEnter={() => setIsMouseInsideDialog(true)}
          onMouseLeave={() => {
            setIsMouseInsideDialog(false);
            setTimeout(() => {
              if (!isMouseInsideDialog) {
                setShowEventDialog(false);
              }
            }, 200);
          }}
        >
          <h3>{hoveredEvent.trainingType}</h3>
          <p>
            <strong>Date:</strong> {hoveredEvent.date}
          </p>
          <p>
            <strong>Duration:</strong> {hoveredEvent.duration} minutes
          </p>
          <p>
            <strong>Intensity:</strong> {hoveredEvent.intensity}
          </p>
          <p>
            <strong>Description:</strong> {hoveredEvent.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default CalendarComponent;
