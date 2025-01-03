const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mock user database
let users = {};

// Endpoint to create a new account
app.post('/create-account', (req, res) => {
    const { username, firstName, lastName, password } = req.body;

    if (users[username]) {
        return res.status(400).json({ message: "Username already exists." });
    }

    users[username] = { firstName, lastName, password };
    res.status(200).json({ message: "Account created successfully." });
});

// Endpoint to log in
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = users[username];
    if (user && user.password === password) {
        return res.status(200).json({ message: `Welcome, ${user.firstName}!` });
    }

    res.status(401).json({ message: "Invalid username or password." });
});

// BMI Calculation Route
app.post("/calculate-bmi", (req, res) => {
  const { weight, height, gender, age, dietPreference } = req.body;

  if (!weight || !height || !gender || !age || !dietPreference) {
    return res.status(400).json({ error: "All fields are required." });
  }
  if (weight <= 0 || height <= 0 || age <= 0) {
    return res.status(400).json({ error: "Invalid input values." });
  }

  const heightM = height / 100;
  const bmi = weight / (heightM * heightM);
  let category = "";

  if (age < 18) {
    category = bmi < 5 ? "Underweight" : bmi < 85 ? "Normal weight" : bmi < 95 ? "Overweight" : "Obese";
  } else {
    category = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal weight" : bmi < 30 ? "Overweight" : "Obese";
  }

  res.json({ bmi: bmi.toFixed(2), category });
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});