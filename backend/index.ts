import express from "express";
import { appRoutes } from "./src/routes/routes.js";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import "dotenv/config";
const app = express();
const port = process.env.ENV_PORT;

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle({ client });

app.use(appRoutes);

app.listen(port, () => {
  console.log(`a porta ${port} ta abrida !`);
});
