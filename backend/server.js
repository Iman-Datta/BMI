const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { OpenAI } = require("openai");
require("dotenv").config();

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mock user database
let users = {};

// Configure OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Endpoint to create a new account
app.post("/create-account", (req, res) => {
  const { username, firstName, lastName, password } = req.body;

  if (users[username]) {
    return res.status(400).json({ message: "Username already exists." });
  }

  users[username] = { firstName, lastName, password };
  res.status(200).json({ message: "Account created successfully." });
});

// Endpoint to log in
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users[username];
  if (user && user.password === password) {
    return res.status(200).json({ message: `Welcome, ${user.firstName}!` });
  }

  res.status(401).json({ message: "Invalid username or password." });
});

// BMI Calculation Route
app.post("/calculate-bmi", (req, res) => {
  const { weight, height, gender, age } = req.body;

  if (!weight || !height || !gender || !age) {
    return res.status(400).json({ error: "All fields are required." });
  }
  if (weight <= 0 || height <= 0 || age <= 0) {
    return res.status(400).json({ error: "Invalid input values." });
  }

  const heightM = height / 100;
  const bmi = weight / (heightM * heightM);
  let category = "";

  if (age < 18) {
    category =
      bmi < 5
        ? "Underweight"
        : bmi < 85
        ? "Normal weight"
        : bmi < 95
        ? "Overweight"
        : "Obese";
  } else {
    category =
      bmi < 18.5
        ? "Underweight"
        : bmi < 25
        ? "Normal weight"
        : bmi < 30
        ? "Overweight"
        : "Obese";
  }

  res.json({ bmi: bmi.toFixed(2), category });
});
// app.post("/personalized-suggestions", (req, res) => {
//   const { userDiet, userActivity, userHealthGoals } = req.body;

//   if (!userDiet || !userActivity || !userHealthGoals) {
//     return res.status(400).json({ error: "All fields are required." });
//   }

//   // Mock logic for personalized suggestions (Replace with actual logic as needed)
//   const dietPlan =
//     userDiet === "veg"
//       ? "Vegetarian diet: Include green leafy vegetables, lentils, and quinoa."
//       : "Non-Vegetarian diet: Add lean meats, eggs, and omega-3-rich fish.";
//   const exercisePlan =
//     userActivity === "low"
//       ? "Start with 15–20 minutes of light yoga or brisk walking daily."
//       : userActivity === "moderate"
//       ? "Engage in 30–40 minutes of cycling or jogging 3–4 times a week."
//       : "Perform strength training and cardio for at least 1 hour daily.";

//   res.json({ dietPlan, exercisePlan });
// });

// API Endpoint

const resultFormat = {
  dietPlan: {
    // week1: {
      // monday: {
        breakfast: "xxx",
        lunch: "xxx",
        dinner: "xxx",
        snacks: "xxx",
      // },
    // },
  },
  exercisePlan: "xxx",
};

app.post("/personalized-suggestions", async (req, res) => {
  try {
    const reqData = req.body; // Expect 'prompt' from the frontend
    const prompt = `You are an expert health advisor. You are given the following details of a person in JSON format : ${JSON.stringify(
      reqData
    )} , Analyse the details and give me a response in follwing JSON format: ${JSON.stringify(
      resultFormat
    )} that contains a diet plan for breakfast, lunch, snacks and dinner as well as an exercise plan for the given person. Just return the JSON.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // You can use any available model like GPT-3.5 or GPT-4
      messages: [{ role: "user", content: prompt }],
    });

    res.json({
      success: true,
      data: response.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
