import * as cheerio from "cheerio";
import { isValidWikiLink } from "./wiki-link-validator";

/**
 * Extracts valid wiki links from HTML content
 * @param html - The HTML content to parse
 * @returns A record mapping href to title
 */
export function extractWikiLinks(html: string): Record<string, string> {
  const htmlPage = cheerio.load(html);
  const links = htmlPage("a").toArray();
  const wikiLinks: Record<string, string> = {};

  for (const element of links) {
    const { href, title } = element.attribs || {};

    if (href && isValidWikiLink(href)) {
      wikiLinks[href] = title || "";
    }
  }

  return wikiLinks;
}

/**
 * Converts a record of links to an array of page IDs
 * @param links - Record mapping href to title
 * @param pageMap - Map of page titles to IDs
 * @returns Array of page IDs
 */
export function linksToPageIds(
  links: Record<string, string>,
  pageMap: Map<string, number>
): number[] {
  const ids: number[] = [];

  for (const [_href, title] of Object.entries(links)) {
    const pageId = pageMap.get(title);
    if (pageId !== undefined) {
      ids.push(pageId);
    }
  }

  return ids;
}
