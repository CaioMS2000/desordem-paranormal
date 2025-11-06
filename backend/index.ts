import "dotenv/config";
import express from "express";
import { appRoutes } from "./src/routes/routes";

const app = express();
const port = process.env.ENV_PORT;

app.use(appRoutes);

app.listen(port, () => {
  console.log(`a porta ${port} ta abrida !`);
});
