document.getElementById("calculateBtn").addEventListener("click", async function () {
  const weight = parseFloat(document.getElementById("weight").value);
  const height = parseFloat(document.getElementById("height").value);
  const gender = document.getElementById("gender").value;
  const age = parseInt(document.getElementById("age").value);
  const dietPreference = document.getElementById("dietPreference").value;

  if (!weight || weight <= 0 || !height || height <= 0 || !age || age <= 0) {
    alert("Please enter valid values for weight, height, and age.");
    return;
  }

  const data = { weight, height, gender, age, dietPreference };

  try {
    const response = await fetch("http://localhost:3000/calculate-bmi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      document.getElementById("bmiResult").textContent = `Your BMI is: ${result.bmi}`;
      document.getElementById("bmiCategory").textContent = `You are classified as: ${result.category}`;
      document.getElementById("solutionBtn").style.display = "block";

      document.getElementById("solutionBtn").onclick = function () {
        window.location.href = `solution.html?category=${result.category}&diet=${dietPreference}`;
      };
    } else {
      alert(result.error || "An error occurred.");
    }
  } catch (error) {
    alert("Failed to connect to the server. Please try again.");
  }
});
