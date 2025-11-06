import type { IWikiClient } from "../models/wiki-client.interface";
import type { Page } from "../models/page.model";
import { extractWikiLinks, linksToPageIds } from "../utils/wiki-link-parser";

/**
 * Service layer for DataSet operations
 * Follows MVC pattern - handles business logic
 */
export class DataSetService {
  constructor(private readonly wikiClient: IWikiClient) {}

  /**
   * Retrieves all pages from the wiki
   * @returns Array of Page objects
   */
  async getAllPages(): Promise<Page[]> {
    const pageNames = await this.wikiClient.getPageNames();
    const pages: Page[] = [];

    for (const name of pageNames) {
      const wikiPage = await this.wikiClient.getPage(name);

      if (!wikiPage) {
        console.warn(`Page not found: ${name}`);
        continue;
      }

      const page: Page = {
        id: wikiPage.raw.pageid,
        name: wikiPage.raw.title,
        link: wikiPage.raw.fullurl,
      };
      pages.push(page);
    }

    return pages;
  }

  /**
   * Gets all page connections (links) for a given page
   * @param pageName - The name of the page to analyze
   * @returns Array of page IDs that are linked from the given page
   */
  async getPageConnections(pageName: string): Promise<number[]> {
    // Fetch page HTML
    const wikiPage = await this.wikiClient.getPage(pageName);
    if (!wikiPage) {
      throw new Error(`Page not found: ${pageName}`);
    }

    const html = await wikiPage.html();

    // Extract and validate links (pure function - testable)
    const links = extractWikiLinks(html);

    // Build page map for ID lookup
    const pageMap = await this.buildPageMap(Object.values(links));

    // Convert links to IDs (pure function - testable)
    return linksToPageIds(links, pageMap);
  }

  /**
   * Builds a map of page titles to their IDs
   * @param pageTitles - Array of page titles
   * @returns Map of title -> page ID
   */
  private async buildPageMap(pageTitles: string[]): Promise<Map<string, number>> {
    const pageMap = new Map<string, number>();

    for (const title of pageTitles) {
      const page = await this.wikiClient.getPage(title);
      if (page) {
        pageMap.set(title, page.raw.pageid);
      }
    }

    return pageMap;
  }

  /**
   * Placeholder for getting all info
   * TODO: Implement this method
   */
  async getAllInfo(): Promise<void> {
    // To be implemented
  }
}
