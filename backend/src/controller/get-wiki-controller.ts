import type { Request, Response } from "express";
import { WikiService } from "../services/wiki-service";

export class WikiController {
  public static async GetWiki(req: Request, res: Response) {
    await WikiService.UpdatePageConnections();

    const wiki = await WikiService.GetWiki(req, res);
    res.json(wiki);
  }
}
