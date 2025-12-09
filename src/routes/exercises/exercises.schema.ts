import { z } from "@hono/zod-openapi";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { toZodV4SchemaTyped } from "@/lib/zod-utils";

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
