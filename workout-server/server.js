import express from "express";
import cors from "cors";
import { TrainingPlan, Workout } from "./models.js";

const app = express();
const PORT = 7777;

app.use(
    cors({
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, database is running!');
});

app.get("/plans", async (req, res) => {
    try {
        const plans = await TrainingPlan.findAll({ include: Workout });
        res.json(plans);
    } catch (err) {
        console.error("Error fetching plans:", err);
        res.status(500).send("Could not fetch plans");
    }
});

app.put("/workouts/:id", async (req, res) => {
    const { id } = req.params;
    const { date } = req.body;

    try {
        const workout = await Workout.findByPk(id);
        if (!workout) {
            return res.status(404).send("Workout not found");
        }

        workout.date = date;
        await workout.save();

        res.status(200).send("Workout updated successfully");
    } catch (err) {
        console.error("Error updating workout:", err);
        res.status(500).send("Failed to update workout");
    }
});

app.post("/plans", async (req, res) => {
    const { name, startDate, endDate } = req.body;
  
    if (!name || !startDate || !endDate) {
      return res
        .status(400)
        .send("Missing required fields: name, startDate, endDate");
    }
  
    try {
      const plan = await TrainingPlan.create({ name, startDate, endDate });
      res.status(201).json(plan);
    } catch (err) {
      console.error("Error creating plan:", err);
      res.status(500).send("Could not save plan");
    }
  });
  
  app.post("/workouts", async (req, res) => {
    const {
      trainingPlanId,
      date,
      trainingType,
      duration,
      intensity,
      description,
    } = req.body;
  
    if (!trainingPlanId || !date || !trainingType || !duration || !intensity) {
      return res
        .status(400)
        .send(
          "Missing required fields: trainingPlanId, date, trainingType, duration, intensity"
        );
    }
  
    try {
      const plan = await TrainingPlan.findByPk(trainingPlanId);
      if (!plan) {
        return res.status(404).send("Training plan not found");
      }
  
      const workout = await Workout.create({
        date,
        trainingType,
        duration,
        intensity,
        description,
        trainingPlanId,
      });
      res.status(201).json(workout);
    } catch (err) {
      console.error("Error adding workout:", err);
      res.status(500).send("Could not save workout");
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
