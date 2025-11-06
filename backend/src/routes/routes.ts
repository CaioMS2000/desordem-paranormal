import { Router } from "express";
import { DataSetController } from "../controller/data-set-controller";

export const appRoutes = Router();

// Initialize controller instance
const dataSetController = new DataSetController();

// Dataset routes
appRoutes.get("/dataset/pages", (req, res) =>
  dataSetController.getAllPages(req, res)
);

appRoutes.get("/dataset/connections/:pageName", (req, res) =>
  dataSetController.getPageConnections(req, res)
);
