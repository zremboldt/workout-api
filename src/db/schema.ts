import { z } from "@hono/zod-openapi";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { toZodV4SchemaTyped } from "@/lib/zod-utils";

export const tasks = sqliteTable("tasks", {
  id: integer({ mode: "number" })
    .primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  done: integer({ mode: "boolean" })
    .notNull()
    .default(false),
  createdAt: integer({ mode: "timestamp" })
    .$defaultFn(() => new Date()),
  updatedAt: integer({ mode: "timestamp" })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

export const selectTasksSchema = toZodV4SchemaTyped(createSelectSchema(tasks));

export const insertTasksSchema = toZodV4SchemaTyped(createInsertSchema(
  tasks,
  {
    name: field => field.min(1).max(500),
  },
).required({
  done: true,
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}));

// @ts-expect-error partial exists on zod v4 type
export const patchTasksSchema = insertTasksSchema.partial();

// ++++++++++++++++++++++++++++++++++++++
// Persons table and schemas

export const persons = sqliteTable("persons", {
  id: integer({ mode: "number" })
    .primaryKey({ autoIncrement: true })
    .unique(),
  firstName: text().notNull(),
  lastName: text().notNull(),
  phoneNumber: text().notNull(),
  email: text(),
  createdAt: integer({ mode: "timestamp" })
    .$defaultFn(() => new Date()),
  updatedAt: integer({ mode: "timestamp" })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

export const selectPersonsSchema = toZodV4SchemaTyped(createSelectSchema(persons));

export const insertPersonsSchema = toZodV4SchemaTyped(createInsertSchema(
  persons,
  {
    firstName: field => field.min(1, "String must contain at least 1 character(s)").max(100),
    lastName: field => field.min(1).max(100),
    phoneNumber: field => field.min(7).max(15),
    email: () => z.email().max(255).optional(),
  },
).required({}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}));

// @ts-expect-error partial exists on zod v4 type
export const patchPersonsSchema = insertPersonsSchema.partial();

// ++++++++++++++++++++++++++++++++++++++
// Exercises table and schemas

export const exercises = sqliteTable("exercises", {
  id: integer({ mode: "number" })
    .primaryKey({ autoIncrement: true })
    .unique(),
  name: text().notNull(),
  description: text(),
  createdAt: integer({ mode: "timestamp" })
    .$defaultFn(() => new Date()),
  updatedAt: integer({ mode: "timestamp" })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

export const selectExercisesSchema = toZodV4SchemaTyped(createSelectSchema(exercises));

export const insertExercisesSchema = toZodV4SchemaTyped(createInsertSchema(
  exercises,
  {
    name: field => field.min(1, "String must contain at least 1 character(s)").max(200),
    description: field => field.max(1000).optional(),
  },
).required({}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}));

// @ts-expect-error partial exists on zod v4 type
export const patchExercisesSchema = insertExercisesSchema.partial();

// ++++++++++++++++++++++++++++++++++++++
// Sets table and schemas

export const sets = sqliteTable("sets", {
  id: integer({ mode: "number" })
    .primaryKey({ autoIncrement: true })
    .unique(),
  reps: integer({ mode: "number" }).notNull(),
  weight: integer({ mode: "number" }),
  exerciseId: integer({ mode: "number" })
    .notNull()
    .references(() => exercises.id),
  createdAt: integer({ mode: "timestamp" })
    .$defaultFn(() => new Date()),
  updatedAt: integer({ mode: "timestamp" })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

export const selectSetsSchema = toZodV4SchemaTyped(createSelectSchema(sets));

export const insertSetsSchema = toZodV4SchemaTyped(createInsertSchema(
  sets,
  {
    reps: field => field.min(1, "Reps must be at least 1").max(1000),
    weight: field => field.min(0).max(1000).optional(),
    exerciseId: field => field.min(1),
  },
).required({}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}));

// @ts-expect-error partial exists on zod v4 type
export const patchSetsSchema = insertSetsSchema.partial();
