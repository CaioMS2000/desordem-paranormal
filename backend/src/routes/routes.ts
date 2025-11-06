import { Router, type Response } from "express";
import { GetWikiController } from "../controller/get-wiki-controller.js";

export const appRoutes = Router();

appRoutes.all("/", (req, res) => GetWikiController(req, res));
