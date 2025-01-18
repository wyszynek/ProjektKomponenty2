export class TrainingPlan {
    constructor(id, name, startDate, endDate, workouts = []) {
        this.id = id;
        this.name = name;
        this.startDate = startDate;
        this.endDate = endDate;
        this.workouts = workouts;
    }
}
