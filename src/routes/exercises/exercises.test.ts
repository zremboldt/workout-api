import { testClient } from "hono/testing";
import { execSync } from "node:child_process";
import fs from "node:fs";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { afterAll, beforeAll, describe, expect, expectTypeOf, it } from "vitest";

import env from "@/env";
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from "@/lib/constants";
import { createTestApp } from "@/lib/create-app";

import router from "./exercises.index";

// ++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++
// TODO: Rework these tests for exercises instead of persons
// ++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++

if (env.NODE_ENV !== "test") {
  throw new Error("NODE_ENV must be 'test'");
}

const client = testClient(createTestApp(router));

describe("persons routes", () => {
  beforeAll(async () => {
    execSync("pnpm drizzle-kit push");
  });

  afterAll(async () => {
    fs.rmSync("test.db", { force: true });
  });

  it("post /persons validates the body when creating", async () => {
    const response = await client.persons.$post({
      json: {
        firstName: "",
        lastName: "Doe",
        phoneNumber: "1234567890",
      },
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0].path[0]).toBe("firstName");
      expect(json.error.issues[0].message).toBe("String must contain at least 1 character(s)");
    }
  });

  const id = 1;
  const firstName = "John";
  const lastName = "Maxfield";
  const phoneNumber = "123-456-7890";
  const email = "john.maxfield@example.com";

  it("post /persons creates a person", async () => {
    const response = await client.persons.$post({
      json: {
        firstName,
        lastName,
        phoneNumber,
        email,
      },
    });
    expect(response.status).toBe(200);
    if (response.status === 200) {
      const json = await response.json();
      expect(json.firstName).toBe(firstName);
      expect(json.lastName).toBe(lastName);
      expect(json.phoneNumber).toBe(phoneNumber);
      expect(json.email).toBe(email);
    }
  });

  it("get /persons lists all persons", async () => {
    const response = await client.persons.$get();
    expect(response.status).toBe(200);
    if (response.status === 200) {
      const json = await response.json();
      expectTypeOf(json).toBeArray();
      expect(json.length).toBe(1);
    }
  });

  it("get /persons/{id} validates the id param", async () => {
    const response = await client.persons[":id"].$get({
      param: {
        id: "wat",
      },
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0].path[0]).toBe("id");
      expect(json.error.issues[0].message).toBe(ZOD_ERROR_MESSAGES.EXPECTED_NUMBER);
    }
  });

  it("get /persons/{id} returns 404 when person not found", async () => {
    const response = await client.persons[":id"].$get({
      param: {
        id: 999,
      },
    });
    expect(response.status).toBe(404);
    if (response.status === 404) {
      const json = await response.json();
      expect(json.message).toBe(HttpStatusPhrases.NOT_FOUND);
    }
  });

  it("get /persons/{id} gets a single person", async () => {
    const response = await client.persons[":id"].$get({
      param: {
        id,
      },
    });
    expect(response.status).toBe(200);
    if (response.status === 200) {
      const json = await response.json();
      expect(json.firstName).toBe(firstName);
      expect(json.lastName).toBe(lastName);
      expect(json.phoneNumber).toBe(phoneNumber);
      expect(json.email).toBe(email);
    }
  });

  it("patch /persons/{id} validates the body when updating", async () => {
    const response = await client.persons[":id"].$patch({
      param: {
        id,
      },
      json: {
        firstName: "",
      },
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0].path[0]).toBe("firstName");
      expect(json.error.issues[0].code).toBe("too_small");
    }
  });

  it("patch /persons/{id} validates the id param", async () => {
    const response = await client.persons[":id"].$patch({
      param: {
        id: "wat",
      },
      json: {},
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0].path[0]).toBe("id");
      expect(json.error.issues[0].message).toBe(ZOD_ERROR_MESSAGES.EXPECTED_NUMBER);
    }
  });

  it("patch /persons/{id} validates empty body", async () => {
    const response = await client.persons[":id"].$patch({
      param: {
        id,
      },
      json: {},
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0].code).toBe(ZOD_ERROR_CODES.INVALID_UPDATES);
      expect(json.error.issues[0].message).toBe(ZOD_ERROR_MESSAGES.NO_UPDATES);
    }
  });

  it("patch /persons/{id} updates a single property of a person", async () => {
    const response = await client.persons[":id"].$patch({
      param: {
        id,
      },
      json: {
        firstName: "Mark",
      },
    });
    expect(response.status).toBe(200);
    if (response.status === 200) {
      const json = await response.json();
      expect(json.firstName).toBe("Mark");
    }
  });

  it("delete /persons/{id} validates the id when deleting", async () => {
    const response = await client.persons[":id"].$delete({
      param: {
        id: "wat",
      },
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0].path[0]).toBe("id");
      expect(json.error.issues[0].message).toBe(ZOD_ERROR_MESSAGES.EXPECTED_NUMBER);
    }
  });

  it("delete /persons/{id} removes a person", async () => {
    const response = await client.persons[":id"].$delete({
      param: {
        id,
      },
    });
    expect(response.status).toBe(204);
  });
});
