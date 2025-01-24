import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CalendarComponent from "./components/CalendarComponent";
import TrainingPlanTable from "./components/TrainingPlanTable";
import TrainingPlanDetails from './components/TrainingPlanDetails';
import "./App.css";

function App() {
  return (
    <Router>
      <div>
        <header>
          <h1>Training Planner</h1>
          <nav>
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/training-plans" className="nav-link">Training Plans</Link>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<CalendarComponent />} />
            <Route path="/training-plans" element={<TrainingPlanTable />} />
            <Route path="/training-plans/:id" element={<TrainingPlanDetails />} />
          </Routes>
        </main>
      </div>
    </Router> 
  );
}

export default App;
