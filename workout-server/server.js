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


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
