import { z } from "@hono/zod-openapi";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { toZodV4SchemaTyped } from "@/lib/zod-utils";

// Change to "users"

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
