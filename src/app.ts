import configureOpenAPI from "@/lib/configure-open-api";
import createApp from "@/lib/create-app";
import exercises from "@/routes/exercises/exercises.index";
import index from "@/routes/index.route";
import persons from "@/routes/persons/persons.index";
import sets from "@/routes/sets/sets.index";

const app = createApp();

configureOpenAPI(app);

const routes = [
  index,
  persons,
  exercises,
  sets,
] as const;

routes.forEach((route) => {
  app.route("/", route);
});

export type AppType = typeof routes[number];

export default app;
