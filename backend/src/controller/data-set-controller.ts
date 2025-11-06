import type { Request, Response } from "express";
import { DataSetService } from "../services/data-set-service";
import { WikiClientAdapter } from "../infrastructure/wiki-client-adapter";

/**
 * Controller for DataSet endpoints
 * Follows MVC pattern - handles HTTP requests/responses
 */
export class DataSetController {
  private readonly dataSetService: DataSetService;

  constructor() {
    // Initialize dependencies
    const wikiClient = new WikiClientAdapter(
      "https://ordemparanormal.fandom.com/api.php"
    );
    this.dataSetService = new DataSetService(wikiClient);
  }

  /**
   * GET /dataset/pages
   * Returns all wiki pages
   */
  async getAllPages(req: Request, res: Response): Promise<Response> {
    try {
      const pages = await this.dataSetService.getAllPages();
      return res.json(pages);
    } catch (error) {
      console.error("Error in getAllPages:", error);
      return res.status(500).json({
        error: "Failed to fetch pages",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * GET /dataset/connections/:pageName
   * Returns all connections for a specific page
   */
  async getPageConnections(req: Request, res: Response): Promise<Response> {
    try {
      const { pageName } = req.params;

      if (!pageName) {
        return res.status(400).json({
          error: "Page name is required",
        });
      }

      const connections = await this.dataSetService.getPageConnections(
        pageName
      );
      return res.json({ pageName, connections });
    } catch (error) {
      console.error("Error in getPageConnections:", error);
      return res.status(500).json({
        error: "Failed to fetch page connections",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
