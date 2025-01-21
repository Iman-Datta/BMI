let weight;
let height;
let gender;
let age;
let bmi;
let suggestions;
const calculateBtn = document.getElementById("calculateBtn");

if (calculateBtn) {
  calculateBtn.addEventListener("click", async function () {
    weight = parseFloat(document.getElementById("weight").value);
    height = parseFloat(document.getElementById("height").value);
    gender = document.getElementById("gender").value;
    age = parseInt(document.getElementById("age").value);
    // const dietPreference = document.getElementById("dietPreference").value;

    if (!weight || weight <= 0 || !height || height <= 0 || !age || age <= 0) {
      alert("Please enter valid values for weight, height, and age.");
      return;
    }

    const data = { weight, height, gender, age };

    try {
      const response = await fetch("http://localhost:3000/calculate-bmi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        bmi = result.bmi;
        document.getElementById(
          "bmiResult"
        ).textContent = `Your BMI is: ${result.bmi}`;
        document.getElementById(
          "bmiCategory"
        ).textContent = `You are classified as: ${result.category}`;
        document.getElementById("solutionBtn").style.display = "block";

        document.getElementById("solutionBtn").onclick = function () {
          window.location.href = "solution.html";
        };
      } else {
        alert(result.error || "An error occurred.");
      }
    } catch (error) {
      alert("Failed to connect to the server. Please try again.");
    }
  });
}

// solution.html
const getSuggestionsBtn = document.getElementById("getSuggestionsBtn");
if (getSuggestionsBtn) {
  getSuggestionsBtn.addEventListener("click", async () => {
    // console.log("here");
    const userDiet = document.getElementById("userDiet").value;
    const userActivity = document.getElementById("userActivity").value;
    const userRegion = document.getElementById("userRegion").value;
    const userAllergies = document.getElementById("userAllergies").value.trim();
    const userFavorites = document.getElementById("userFavorites").value.trim();
    const userDislikes = document.getElementById("userDislikes").value.trim();
    const userHydration = document.getElementById("userHydration").value;
    const breakfast = document.getElementById("breakfast").value.trim();
    const lunch = document.getElementById("lunch").value.trim();
    const dinner = document.getElementById("dinner").value.trim();
    const snacks = document.getElementById("snacks").value.trim();
    const userHealthGoals = document
      .getElementById("userHealthGoals")
      .value.trim();

    if (!userHealthGoals) {
      alert("Please specify your health goals.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/personalized-suggestions",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bmi,
            age,
            gender,
            height,
            weight,
            userDiet,
            userActivity,
            userRegion,
            userAllergies,
            userFavorites,
            userDislikes,
            userHydration,
            typicalDailyIntake: { breakfast, lunch, dinner, snacks },
            userHealthGoals,
          }),
        }
      );

      const result = await response.json(); //result should be global variable

      console.log(result);

      if (response.ok) {
        suggestions = JSON.parse(result.data);
        // next page
        document.getElementById("sug_breakfast").textContent =
          suggestions.dietPlan.breakfast;
        document.getElementById("sug_lunch").textContent =
          suggestions.dietPlan.lunch;
        document.getElementById("sug_snacks").textContent =
          suggestions.dietPlan.snacks;
        document.getElementById("sug_dinner").textContent =
          suggestions.dietPlan.dinner;
        document.getElementById("sug_exercisePlan").textContent =
          suggestions.exercisePlan;
        document.getElementById("suggestions").style.display = "block";
      } else {
        alert(result.error || "An error occurred while fetching suggestions.");
      }
    } catch (error) {
      console.log(error);
      alert("Failed to connect to the server. Please try again.");
    }
  });
}
