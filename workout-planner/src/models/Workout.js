export class Workout {
    constructor(id, date, trainingType, duration, intensity, description, trainingPlanId) {
        this.id = id;
        this.date = date;
        this.trainingType = trainingType;
        this.duration = duration;
        this.intensity = intensity;
        this.description = description;
        this.trainingPlanId = trainingPlanId;
    }
}
