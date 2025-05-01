export const mockWorkoutPlan = {
  summary: {
    goal: "Muscle Gain",
    level: "Intermediate",
    daysPerWeek: 4,
    sessionLength: 60,
    focusAreas: ["upperBody", "lowerBody", "core"],
    equipment: "fullGym",
  },
  overview:
    "This 4-day split focuses on building muscle mass through progressive overload. The plan incorporates compound movements and isolation exercises to target all major muscle groups with adequate recovery time between sessions.",
  workouts: {
    day1: {
      focus: "Chest and Triceps",
      description: "Focus on building chest strength and size with complementary triceps work.",
      exercises: [
        { name: "Barbell Bench Press", sets: 4, reps: "8-10", rest: "90 sec" },
        { name: "Incline Dumbbell Press", sets: 3, reps: "10-12", rest: "60 sec" },
        { name: "Cable Flyes", sets: 3, reps: "12-15", rest: "60 sec" },
        { name: "Tricep Pushdowns", sets: 3, reps: "12-15", rest: "45 sec" },
        { name: "Overhead Tricep Extension", sets: 3, reps: "10-12", rest: "45 sec" },
        { name: "Dips", sets: 3, reps: "To failure", rest: "60 sec" },
      ],
      notes: [
        "Focus on proper form and full range of motion",
        "Increase weight when you can complete the upper range of reps with good form",
        "For the last set of each exercise, aim to reach muscle failure",
      ],
    },
    day2: {
      focus: "Back and Biceps",
      description: "Build a strong, wide back with targeted bicep work.",
      exercises: [
        { name: "Pull-Ups", sets: 4, reps: "8-10", rest: "90 sec" },
        { name: "Barbell Rows", sets: 3, reps: "8-10", rest: "90 sec" },
        { name: "Lat Pulldowns", sets: 3, reps: "10-12", rest: "60 sec" },
        { name: "Seated Cable Rows", sets: 3, reps: "10-12", rest: "60 sec" },
        { name: "Barbell Curls", sets: 3, reps: "10-12", rest: "45 sec" },
        { name: "Hammer Curls", sets: 3, reps: "12-15", rest: "45 sec" },
      ],
      notes: [
        "Focus on engaging your lats during back exercises",
        "Avoid using momentum during bicep exercises",
        "Stretch between sets to maintain flexibility",
      ],
    },
    day3: {
      focus: "Legs and Core",
      description: "Build lower body strength and stability with core conditioning.",
      exercises: [
        { name: "Barbell Squats", sets: 4, reps: "8-10", rest: "120 sec" },
        { name: "Romanian Deadlifts", sets: 3, reps: "8-10", rest: "90 sec" },
        { name: "Leg Press", sets: 3, reps: "10-12", rest: "90 sec" },
        { name: "Walking Lunges", sets: 3, reps: "12 per leg", rest: "60 sec" },
        { name: "Leg Curls", sets: 3, reps: "12-15", rest: "60 sec" },
        { name: "Hanging Leg Raises", sets: 3, reps: "15-20", rest: "45 sec" },
        { name: "Plank", sets: 3, reps: "45-60 sec", rest: "30 sec" },
      ],
      notes: [
        "Warm up thoroughly before squats and deadlifts",
        "Focus on proper depth for squats",
        "Keep your core engaged throughout all exercises",
      ],
    },
    day4: {
      focus: "Shoulders and Arms",
      description: "Complete the week with focused shoulder development and arm refinement.",
      exercises: [
        { name: "Overhead Press", sets: 4, reps: "8-10", rest: "90 sec" },
        { name: "Lateral Raises", sets: 3, reps: "12-15", rest: "45 sec" },
        { name: "Face Pulls", sets: 3, reps: "15-20", rest: "45 sec" },
        { name: "Upright Rows", sets: 3, reps: "10-12", rest: "60 sec" },
        { name: "EZ Bar Curls", sets: 3, reps: "10-12", rest: "45 sec" },
        { name: "Skull Crushers", sets: 3, reps: "10-12", rest: "45 sec" },
        { name: "Cable Rope Curls", sets: 2, reps: "15-20", rest: "30 sec" },
        { name: "Cable Pushdowns", sets: 2, reps: "15-20", rest: "30 sec" },
      ],
      notes: [
        "Focus on controlled movements for shoulder health",
        "Use lighter weights and perfect form for lateral raises",
        "Finish with a superset of curls and pushdowns for a pump",
      ],
    },
  },
}

// Mock meal plan data for development
export const mockMealPlan = {
  summary: {
    goal: "Muscle Gain",
    calories: 3100,
    dietType: "High Protein",
    mealsPerDay: 4,
    restrictions: "None",
  },
  overview:
    "This high-protein meal plan is designed to support muscle growth while providing adequate energy for intense workouts. The plan emphasizes lean protein sources, complex carbohydrates, and healthy fats distributed across 4 meals per day.",
  macros: {
    protein: 210,
    carbs: 280,
    fat: 78,
  },
  meals: {
    day1: [
      {
        name: "Breakfast (7:00 AM)",
        foods: [
          { name: "Egg Whites", amount: "6 whites", protein: 20, carbs: 0, fat: 0, calories: 80 },
          { name: "Whole Eggs", amount: "2 eggs", protein: 12, carbs: 0, fat: 10, calories: 140 },
          { name: "Oatmeal", amount: "1 cup cooked", protein: 6, carbs: 32, fat: 3, calories: 18000 },
          { name: "Blueberries", amount: "1/2 cup", protein: 0, carbs: 10, fat: 0, calories: 40 },
          { name: "Almond Butter", amount: "1 tbsp", protein: 3, carbs: 3, fat: 9, calories: 100 },
        ],
        totals: {
          protein: 41,
          carbs: 45,
          fat: 22,
          calories: 540,
        },
        notes:
          "Prepare oatmeal with water. Add blueberries and almond butter after cooking. Cook eggs and egg whites together as an omelet or scrambled.",
      },
      {
        name: "Lunch (12:00 PM)",
        foods: [
          { name: "Grilled Chicken Breast", amount: "6 oz", protein: 36, carbs: 0, fat: 4, calories: 180 },
          { name: "Brown Rice", amount: "1 cup cooked", protein: 5, carbs: 45, fat: 2, calories: 220 },
          { name: "Broccoli", amount: "1 cup", protein: 3, carbs: 6, fat: 0, calories: 35 },
          { name: "Olive Oil", amount: "1 tbsp", protein: 0, carbs: 0, fat: 14, calories: 120 },
        ],
        totals: {
          protein: 44,
          carbs: 51,
          fat: 20,
          calories: 555,
        },
        notes: "Season chicken with herbs and spices. Steam broccoli and drizzle with olive oil after cooking.",
      },
      {
        name: "Pre/Post Workout Meal (4:00 PM)",
        foods: [
          { name: "Whey Protein Isolate", amount: "1 scoop", protein: 25, carbs: 2, fat: 1, calories: 120 },
          { name: "Banana", amount: "1 medium", protein: 1, carbs: 27, fat: 0, calories: 105 },
          { name: "Greek Yogurt", amount: "1 cup", protein: 20, carbs: 8, fat: 0, calories: 120 },
          { name: "Honey", amount: "1 tbsp", protein: 0, carbs: 17, fat: 0, calories: 65 },
        ],
        totals: {
          protein: 46,
          carbs: 54,
          fat: 1,
          calories: 410,
        },
        notes:
          "Consume half before workout and half after. Mix protein with water or almond milk. Add honey to yogurt.",
      },
      {
        name: "Dinner (8:00 PM)",
        foods: [
          { name: "Salmon", amount: "6 oz", protein: 34, carbs: 0, fat: 14, calories: 260 },
          { name: "Sweet Potato", amount: "1 medium", protein: 2, carbs: 24, fat: 0, calories: 100 },
          { name: "Asparagus", amount: "1 cup", protein: 3, carbs: 5, fat: 0, calories: 30 },
          { name: "Avocado", amount: "1/2 medium", protein: 2, carbs: 6, fat: 11, calories: 120 },
          { name: "Quinoa", amount: "1/2 cup cooked", protein: 4, carbs: 20, fat: 2, calories: 110 },
        ],
        totals: {
          protein: 45,
          carbs: 55,
          fat: 27,
          calories: 620,
        },
        notes:
          "Bake salmon with lemon and herbs. Roast sweet potato and asparagus together. Serve with sliced avocado on top.",
      },
    ],
    day2: [
      {
        name: "Breakfast (7:00 AM)",
        foods: [
          { name: "Greek Yogurt", amount: "1.5 cups", protein: 30, carbs: 12, fat: 0, calories: 180 },
          { name: "Granola", amount: "1/3 cup", protein: 4, carbs: 30, fat: 6, calories: 190 },
          { name: "Mixed Berries", amount: "1 cup", protein: 1, carbs: 15, fat: 0, calories: 60 },
          { name: "Walnuts", amount: "1/4 cup", protein: 4, carbs: 4, fat: 16, calories: 170 },
        ],
        totals: {
          protein: 39,
          carbs: 61,
          fat: 22,
          calories: 600,
        },
        notes: "Mix all ingredients together. Add cinnamon or vanilla extract for flavor if desired.",
      },
      {
        name: "Lunch (12:00 PM)",
        foods: [
          { name: "Lean Ground Turkey", amount: "6 oz", protein: 36, carbs: 0, fat: 10, calories: 230 },
          { name: "Whole Wheat Pasta", amount: "1 cup cooked", protein: 7, carbs: 37, fat: 1, calories: 180 },
          { name: "Tomato Sauce", amount: "1/2 cup", protein: 2, carbs: 10, fat: 0, calories: 50 },
          { name: "Spinach", amount: "2 cups", protein: 2, carbs: 2, fat: 0, calories: 14 },
          { name: "Parmesan Cheese", amount: "2 tbsp", protein: 4, carbs: 0, fat: 4, calories: 50 },
        ],
        totals: {
          protein: 51,
          carbs: 49,
          fat: 15,
          calories: 524,
        },
        notes: "Cook turkey with Italian herbs. Mix with pasta, sauce, and wilted spinach. Top with parmesan.",
      },
      {
        name: "Snack (4:00 PM)",
        foods: [
          { name: "Protein Shake", amount: "1 scoop", protein: 25, carbs: 2, fat: 1, calories: 120 },
          { name: "Apple", amount: "1 medium", protein: 0, carbs: 25, fat: 0, calories: 95 },
          { name: "Almonds", amount: "1 oz (23 nuts)", protein: 6, carbs: 6, fat: 14, calories: 170 },
        ],
        totals: {
          protein: 31,
          carbs: 33,
          fat: 15,
          calories: 385,
        },
        notes: "Mix protein with water or almond milk. Eat apple and almonds on the side.",
      },
      {
        name: "Dinner (8:00 PM)",
        foods: [
          { name: "Sirloin Steak", amount: "6 oz", protein: 42, carbs: 0, fat: 16, calories: 320 },
          { name: "Baked Potato", amount: "1 medium", protein: 4, carbs: 37, fat: 0, calories: 160 },
          { name: "Greek Yogurt (as topping)", amount: "1/4 cup", protein: 5, carbs: 2, fat: 0, calories: 30 },
          { name: "Steamed Vegetables", amount: "1.5 cups", protein: 4, carbs: 15, fat: 0, calories: 75 },
          { name: "Olive Oil", amount: "1 tbsp", protein: 0, carbs: 0, fat: 14, calories: 120 },
        ],
        totals: {
          protein: 55,
          carbs: 54,
          fat: 30,
          calories: 705,
        },
        notes:
          "Grill or pan-sear steak to desired doneness. Top baked potato with Greek yogurt instead of sour cream. Drizzle vegetables with olive oil after steaming.",
      },
    ],
  },
}

