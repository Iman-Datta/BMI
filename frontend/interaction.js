document.getElementById("calculateBtn").addEventListener("click", async function () {
  // Get input values
  const weight = parseFloat(document.getElementById("weight").value);
  const height = parseFloat(document.getElementById("height").value);
  const gender = document.getElementById("gender").value;
  const age = parseInt(document.getElementById("age").value);

  // Validation
  if (!weight || weight <= 0 || !height || height <= 0 || !age || age <= 0) {
    alert("Please enter valid values for weight, height, and age.");
    return;
  }

  const data = {
    weight,
    height,
    gender,
    age,
  };

  try {
    // Send data to the backend
    const response = await fetch("http://localhost:3000/calculate-bmi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      // Display results
      document.getElementById("bmiResult").textContent = `Your BMI is: ${result.bmi}`;
      document.getElementById("bmiCategory").textContent = `You are classified as: ${result.category}`;
    } else {
      alert(result.error || "An error occurred.");
    }
  } catch (error) {
    alert("Failed to connect to the server. Please try again.");
  }
});
