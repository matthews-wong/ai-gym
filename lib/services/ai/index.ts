// Re-export all AI service modules
export * from "./client";
export * from "./types";
export * from "./coach";

// Form options for UI components
export const formOptions = {
  nutritionGoals: [
    "Muscle Gain",
    "Fat Loss",
    "Maintenance",
    "Performance",
    "Healthy Eating",
  ],
  dietTypes: [
    "Balanced",
    "High Protein",
    "Low Carb",
    "Keto",
    "Mediterranean",
    "Paleo",
  ],
  cuisines: [
    "Any",
    "Indonesian",
    "Asian",
    "Mediterranean",
    "Western",
    "Mexican",
    "Indian",
  ],
  complexities: ["Simple", "Moderate", "Complex"],
  budgetLevels: ["Budget-Friendly", "Moderate", "Premium"],
  cookingTimes: [
    "Minimal (15 min or less)",
    "Moderate (15-30 min)",
    "Extended (30+ min)",
  ],
  mealPrepOptions: [
    "Daily Cooking",
    "Batch Cooking (2-3 days)",
    "Weekly Meal Prep",
  ],
  healthConditions: [
    "None",
    "Diabetes-Friendly",
    "Heart Health",
    "Low Sodium",
    "Low FODMAP",
  ],
  proteinPreferences: [
    "Balanced (All Sources)",
    "Poultry-Focused",
    "Seafood-Focused",
    "Red Meat-Focused",
    "Plant-Based Proteins",
  ],
  seasonalPreferences: ["Any", "Spring", "Summer", "Fall", "Winter"],
  snackFrequencies: ["Once a day", "Twice a day", "Three times a day"],
  snackTypes: [
    "Balanced",
    "High Protein",
    "Low Calorie",
    "Sweet",
    "Savory",
    "Fruit-based",
  ],
  fitnessGoals: ["Muscle Gain", "Fat Loss", "Strength", "Endurance"],
  experienceLevels: ["Beginner", "Intermediate", "Advanced"],
  focusAreas: [
    "Full Body",
    "Upper Body",
    "Lower Body",
    "Core",
    "Arms",
    "Back",
    "Chest",
    "Shoulders",
    "Legs",
  ],
  equipmentOptions: [
    "Full Gym",
    "Home Basic (Dumbbells, Resistance Bands)",
    "Bodyweight Only",
  ],
};
