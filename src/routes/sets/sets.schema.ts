import { z } from "@hono/zod-openapi";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { toZodV4SchemaTyped } from "@/lib/zod-utils";

import { exercises } from "../exercises/exercises.schema";

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
