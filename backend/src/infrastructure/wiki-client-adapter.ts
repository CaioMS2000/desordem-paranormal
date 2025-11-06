import wiki from "wikijs";
import type { IWikiClient } from "../models/wiki-client.interface";
import type { WikiPage } from "../models/page.model";

/**
 * Adapter for the wikijs library
 * Implements IWikiClient interface for dependency injection
 */
export class WikiClientAdapter implements IWikiClient {
  constructor(private readonly apiUrl: string) {}

  async getPageNames(): Promise<string[]> {
    try {
      const pageNames = await wiki({
        apiUrl: this.apiUrl,
      }).allPages();

      return pageNames;
    } catch (error) {
      console.error("Error in getPageNames:", error);
      throw error;
    }
  }

  async getPage(pageName: string): Promise<WikiPage | undefined> {
    try {
      const page = await wiki({
        apiUrl: this.apiUrl,
      }).page(pageName);

      return page as WikiPage;
    } catch (error) {
      console.error(`Error in getPage for "${pageName}":`, error);
      return undefined;
    }
  }
}
