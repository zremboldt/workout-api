import { drizzle } from "drizzle-orm/libsql";

import env from "@/env";
import * as exercisesSchema from "@/routes/exercises/exercises.schema";
import * as personsSchema from "@/routes/persons/persons.schema";
import * as setsSchema from "@/routes/sets/sets.schema";

const db = drizzle({
  connection: {
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
  },
  casing: "snake_case",
  schema: { ...personsSchema, ...exercisesSchema, ...setsSchema },
});

export default db;
