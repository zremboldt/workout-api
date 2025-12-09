import "dotenv/config";

import { exercises } from "../routes/exercises/exercises.schema";
import db from "./index";

async function seed() {
  // eslint-disable-next-line no-console
  console.log("🌱 Seeding database...");

  const exercisesToInsert = [
    // Upper Body - Push
    {
      name: "Bench Press",
      description: "Lie on a bench and press a barbell or dumbbells upward from chest level. Targets chest, shoulders, and triceps.",
    },
    {
      name: "Push-ups",
      description: "Bodyweight exercise performed in a plank position, lowering and raising the body. Targets chest, shoulders, and triceps.",
    },
    {
      name: "Dumbbell Shoulder Press",
      description: "Press dumbbells overhead while seated or standing. Targets shoulders.",
    },

    // Upper Body - Pull
    {
      name: "Pull-ups",
      description: "Hang from a bar and pull yourself up until chin is over the bar. Targets back and biceps.",
    },
    {
      name: "Barbell Row",
      description: "Bend over and pull a barbell to your torso. Targets upper and middle back.",
    },
    {
      name: "Lat Pulldown",
      description: "Pull a cable bar down to chest level while seated. Targets lats and back.",
    },
    {
      name: "Bicep Curls",
      description: "Curl dumbbells or a barbell from waist to shoulder level. Targets biceps.",
    },

    // Lower Body
    {
      name: "Squats",
      description: "Lower your body by bending knees and hips, then stand back up. Targets quads, glutes, and hamstrings.",
    },
    {
      name: "Deadlift",
      description: "Lift a barbell from the ground to hip level with a straight back. Targets back, glutes, and hamstrings.",
    },
    {
      name: "Lunges",
      description: "Step forward and lower your body until both knees are bent at 90 degrees. Targets quads and glutes.",
    },
    {
      name: "Leg Press",
      description: "Push a weighted platform away using your legs while seated. Targets quads and glutes.",
    },
    {
      name: "Romanian Deadlift",
      description: "Hip hinge movement with slight knee bend, lowering barbell to shin level. Targets hamstrings and glutes.",
    },

    // Core
    {
      name: "Plank",
      description: "Hold a push-up position with forearms on the ground. Targets core stability.",
    },
    {
      name: "Crunches",
      description: "Lie on back and curl shoulders toward hips. Targets abs.",
    },

    // Cardio
    {
      name: "Running",
      description: "Aerobic exercise performed at various paces and distances.",
    },
    {
      name: "Cycling",
      description: "Pedaling a bicycle or stationary bike for cardiovascular fitness.",
    },
    {
      name: "Rowing",
      description: "Full-body cardio exercise using a rowing machine or actual rowing.",
    },
  ];

  await db.insert(exercises).values(exercisesToInsert);

  // eslint-disable-next-line no-console
  console.log(`✅ Seeded ${exercisesToInsert.length} exercises`);
  // eslint-disable-next-line no-console
  console.log("🎉 Seeding complete!");

  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
