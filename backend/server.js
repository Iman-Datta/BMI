const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// BMI Calculation Route
app.post("/calculate-bmi", (req, res) => {
  const { weight, height, gender, age } = req.body;

  // Validate input
  if (!weight || !height || !gender || !age) {
    return res.status(400).json({ error: "All fields are required." });
  }
  if (weight <= 0 || height <= 0 || age <= 0) {
    return res.status(400).json({ error: "Invalid input values." });
  }

  // Calculate BMI
  const heightM = height / 100;
  const bmi = weight / (heightM * heightM);

  // Determine BMI category
  let category = "";

  if (age < 18) {
    if (bmi < 5) {
      category = "Underweight";
    } else if (bmi >= 5 && bmi < 85) {
      category = "Normal weight";
    } else if (bmi >= 85 && bmi < 95) {
      category = "Overweight";
    } else {
      category = "Obese";
    }
  } else {
    if (gender === "male") {
      if (bmi < 18.5) {
        category = "Underweight";
      } else if (bmi >= 18.5 && bmi < 25) {
        category = "Normal weight";
      } else if (bmi >= 25 && bmi < 30) {
        category = "Overweight";
      } else {
        category = "Obese";
      }
    } else if (gender === "female") {
      if (bmi < 18.5) {
        category = "Underweight";
      } else if (bmi >= 18.5 && bmi < 24) {
        category = "Normal weight";
      } else if (bmi >= 24 && bmi < 30) {
        category = "Overweight";
      } else {
        category = "Obese";
      }
    }
  }

  // Respond with BMI and category
  res.json({
    bmi: bmi.toFixed(2),
    category,
  });
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});