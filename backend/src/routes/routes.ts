import { Router, type Response } from "express";
import { WikiController } from "../controller/get-wiki-controller.js";

export const appRoutes = Router();

appRoutes.all("/", (req, res) => WikiController.GetWiki(req, res));
