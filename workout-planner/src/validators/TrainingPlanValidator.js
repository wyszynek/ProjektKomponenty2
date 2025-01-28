class TrainingPlanValidator {
  static validateTrainingPlan({ name, startDate, endDate }) {
    if (!name || !startDate || !endDate) {
      return "All fields are required.";
    }

    if (new Date(endDate) <= new Date(startDate)) {
      return "End date must be after the start date.";
    }

    return null;
  }
}

export default TrainingPlanValidator;
