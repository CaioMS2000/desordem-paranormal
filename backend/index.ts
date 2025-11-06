import "dotenv/config";
import express from "express";
import { appRoutes } from "./src/routes/routes.js";
import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
const app = express();
const port = process.env.ENV_PORT;

export const db = drizzle(process.env.DB_FILE_NAME!);

app.use(appRoutes);

app.listen(port, () => {
  console.log(`a porta ${port} ta abrida !`);
});
