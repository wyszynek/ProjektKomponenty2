const WorkoutValidator = {
  validateWorkout: ({
    date,
    duration,
    intensity,
    trainingType,
    selectedPlan,
  }) => {
    if (!date || !duration || !intensity || !trainingType) {
      return "Please fill in all required fields.";
    }

    if (duration <= 0) {
      return "Duration must be more than 0.";
    }

    if (intensity < 1 || intensity > 10) {
      return "Intensity must be between 1 and 10.";
    }

    if (!selectedPlan) {
      return "Training plan not selected or invalid.";
    }

    const selectedDate = new Date(date);
    const planStartDate = new Date(selectedPlan.startDate);
    const planEndDate = new Date(selectedPlan.endDate);

    if (selectedDate < planStartDate || selectedDate > planEndDate) {
      return `The date must be between ${selectedPlan.startDate} and ${selectedPlan.endDate}.`;
    }

    return null;
  },
};

export default WorkoutValidator;
