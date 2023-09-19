
// Function to calculate BMR
function calculateBMR(weight, height, sex, age, activityLevel) {
    let bmr = 0;
    if (sex === "male") {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else if (sex === "female") {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // Adjust BMR based on activity level
    if (activityLevel === "sedentary") {
        bmr *= 1.2;
    } else if (activityLevel === "moderate") {
        bmr *= 1.55;
    } else if (activityLevel === "active") {
        bmr *= 1.725;
    }

    return bmr;
}

// Function to calculate total exercise calories
function calculateTotalExerciseCalories(hiitDuration, runDuration, boulderingDuration, bikeDuration, strengthTrainingDuration) {
    // Define calories burned per minute for different exercises
    const hiitCaloriesPerMinute = 14; // Adjust as needed
    const runCaloriesPerMinute = 11; // Adjust as needed
    const boulderingCaloriesPerMinute = 9; // Adjust as needed
    const bikeCaloriesPerMinute = 7; // Adjust as needed
    const strengthTrainingCaloriesPerMinute = 5; // Adjust as needed

    // Calculate total exercise calories
    const totalExerciseCalories =
        hiitDuration * hiitCaloriesPerMinute +
        runDuration * runCaloriesPerMinute +
        boulderingDuration * boulderingCaloriesPerMinute +
        bikeDuration * bikeCaloriesPerMinute +
        strengthTrainingDuration * strengthTrainingCaloriesPerMinute;

    return totalExerciseCalories;
}

// Function to save and retrieve data from local storage
function saveDataToLocalStorage(dataKey, data) {
    localStorage.setItem(dataKey, JSON.stringify(data));
}

function retrieveDataFromLocalStorage(dataKey) {
    const data = localStorage.getItem(dataKey);
    return JSON.parse(data) || null;
}

// Calculate BMR when the Calculate BMR button is clicked
document.getElementById("calculateBMR").addEventListener("click", function () {
    const weight = parseFloat(document.getElementById("weight").value);
    const height = parseFloat(document.getElementById("height").value);
    const sex = document.getElementById("sex").value;
    const age = parseFloat(document.getElementById("age").value);
    const activityLevel = document.getElementById("activityLevel").value;

    if (!isNaN(weight) && !isNaN(height) && !isNaN(age)) {
        const bmr = calculateBMR(weight, height, sex, age, activityLevel);
        document.getElementById("bmrResult").textContent = `Your BMR: ${bmr.toFixed(2)} calories/day for a ${activityLevel} activity level`;

        // Save BMR and activity level to local storage
        saveDataToLocalStorage("bmr", bmr);
        saveDataToLocalStorage("activityLevel", activityLevel);
    }
});

// Calculate total calories consumed when the Add Food button is clicked
document.getElementById("addFood").addEventListener("click", function () {
    const foodName = document.getElementById("foodName").value;
    const calories = parseFloat(document.getElementById("calories").value);

    if (!isNaN(calories)) {
        // Track food intake
        const foodList = retrieveDataFromLocalStorage("foodList") || [];
        foodList.push({ name: foodName, calories });
        saveDataToLocalStorage("foodList", foodList);

        // Update total calories consumed
        const totalCalories = foodList.reduce((total, food) => total + food.calories, 0);
        document.getElementById("totalCalories").textContent = totalCalories;

        // Clear input fields
        document.getElementById("foodName").value = "";
        document.getElementById("calories").value = "";
    }
});

// Calculate exercise calories and caloric deficit when the Calculate Exercise button is clicked
document.getElementById("calculateExercise").addEventListener("click", function () {
    const hiitDuration = parseFloat(document.getElementById("hiitDuration").value) || 0;
    const runDuration = parseFloat(document.getElementById("runDuration").value) || 0;
    const boulderingDuration = parseFloat(document.getElementById("boulderingDuration").value) || 0;
    const bikeDuration = parseFloat(document.getElementById("bikeDuration").value) || 0;
    const strengthTrainingDuration = parseFloat(document.getElementById("strengthTrainingDuration").value) || 0;

    const totalExerciseCalories = calculateTotalExerciseCalories(
        hiitDuration,
        runDuration,
        boulderingDuration,
        bikeDuration,
        strengthTrainingDuration
    );

    // Retrieve BMR from local storage
    const bmr = retrieveDataFromLocalStorage("bmr") || 0;

    // Retrieve total calories consumed from local storage
    const totalCalories = retrieveDataFromLocalStorage("foodList") ? retrieveDataFromLocalStorage("foodList").reduce((total, food) => total + food.calories, 0) : 0;

    // Calculate caloric deficit
    const caloricDeficit = (bmr + totalExerciseCalories) - totalCalories;

    if (caloricDeficit >= 500) {
        document.getElementById("exerciseResult").textContent = `Bien wn! estay a dos pasos de Alex Megos, estas en ${caloricDeficit.toFixed(2)} deficit calorico. Buena!`;
    } else {
        const additionalExerciseCalories = (500 - caloricDeficit).toFixed(2);
        document.getElementById("exerciseResult").textContent = `No seai pajero, para alcanzar tu meta de 500 calorias de deficit, aun tienes que quemar ${additionalExerciseCalories} calorias.`;
    }
});

// Load and display saved data on page load
window.addEventListener("load", function () {
    // Retrieve and display BMR
    const savedBMR = retrieveDataFromLocalStorage("bmr");
    const activityLevel = retrieveDataFromLocalStorage("activityLevel");
    if (savedBMR) {
        document.getElementById("bmrResult").textContent = `Your BMR: ${savedBMR.toFixed(2)} calories/day for a ${activityLevel} activity level`;
    }

    // Retrieve and display total calories consumed
    const savedFoodList = retrieveDataFromLocalStorage("foodList") || [];
    const totalCalories = savedFoodList.reduce((total, food) => total + food.calories, 0);
    document.getElementById("totalCalories").textContent = totalCalories;
});

// Function to reset all stored data
function resetAllData() {
    // Clear BMR and activity level
    saveDataToLocalStorage("bmr", 0);
    saveDataToLocalStorage("activityLevel", "");
    document.getElementById("bmrResult").textContent = "";

    // Clear food list and total calories consumed
    saveDataToLocalStorage("foodList", []);
    document.getElementById("foodList").innerHTML = "";
    document.getElementById("totalCalories").textContent = "0";

    // Clear exercise durations and results
    document.getElementById("hiitDuration").value = "";
    document.getElementById("runDuration").value = "";
    document.getElementById("boulderingDuration").value = "";
    document.getElementById("bikeDuration").value = "";
    document.getElementById("strengthTrainingDuration").value = "";
    document.getElementById("exerciseResult").textContent = "";
}

// Add an event listener to the Reset All Info button
document.getElementById("resetInfo").addEventListener("click", function () {
    resetAllData();
});

// Function to download the page content as PDF
function downloadPDF() {
    const pdfButton = document.getElementById("downloadPDF");

    pdfButton.addEventListener("click", function () {
        const element = document.getElementById("pdfContent"); // Replace "pdfContent" with the ID of the element containing the content to be converted to PDF
        const pdfOptions = {
            margin: 10,
            filename: "calorie_tracker.pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        };

        html2pdf().from(element).set(pdfOptions).outputPdf(function (pdf) {
            // Trigger the download of the PDF
            pdf.save();
        });
    });
}

// Call the downloadPDF function to set up the event listener
downloadPDF();
