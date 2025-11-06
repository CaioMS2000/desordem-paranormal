import * as cheerio from "cheerio";
import { WikiOp } from "../api/wiki-op.js";
import type { Page } from "wikijs";
import { error } from "console";
import { HtmlHasher } from "../utils/html-hasher.js";

export interface pagesObjInterface {
  id: number;
  name: string;
  link: string;
  html: string;
  connections?: number[];
}

export class GetWikiService {
  public static async GetAllPages() {
    const pageNames = await WikiOp.GetPageNames();
    const allPagesObjects: pagesObjInterface[] = [];
    const allPagesRecord: Record<number, Page> = {};

    if (!pageNames) {
      return console.log("não tem pageNames");
    }

    const allPages = pageNames.map((name: string) => WikiOp.getPage(name));
    const promisseAllPages = await Promise.all(allPages);

    for (const pages of promisseAllPages) {
      if (!pages) {
        continue;
      }

      allPagesRecord[pages.raw.pageid] = pages;
    }

    const allPagesEntries = Object.entries(allPagesRecord);

    for (const [pageid, page] of allPagesEntries) {
      const pageObj: pagesObjInterface = {
        id: page.raw.pageid,
        name: page.raw.title,
        link: page.raw.fullurl,
        html: await page.html(),
      };
      allPagesObjects.push(pageObj);
    }
    return allPagesObjects;
  }

  public static async GetPageConnections(
    htmlPage: string,
    allPages: pagesObjInterface[]
  ) {
    const cheerioPage = cheerio.load(htmlPage ?? "");
    const links = cheerioPage("a").toArray();
    const connections: number[] = [];

    const allPagesRecord: Record<string, string> = {};

    for (const element of links) {
      const attr = element.attribs;
      if (
        !attr.href?.startsWith("/") ||
        attr.href.startsWith("/wiki/Arquivo:")
      ) {
        continue;
      }
      allPagesRecord[attr.href] = attr.title!;
    }

    const allPagesEntries = Object.entries(allPagesRecord);

    for (const entrie of allPagesEntries) {
      const pageObj = allPages.find((page) => {
        return page.name == entrie[1];
      });

      if (!pageObj) {
        continue;
      }
      connections.push(pageObj.id);
    }

    return connections;
  }

  public static async GetAllInfo() {
    // retornar um array de objetos com todas as páginas e suas conexões

    const allPages = await this.GetAllPages();
    const allPagesObjects: pagesObjInterface[] = [];
    if (!allPages) {
      throw new Error("deu erro no allPages");
    }

    for (const page of allPages) {
      const connections = await this.GetPageConnections(page.html, allPages);
      const hash = new HtmlHasher().hasher(page.html);

      allPagesObjects.push({
        id: page.id,
        name: page.name,
        html: hash,
        link: page.link,
        connections: connections,
      });
    }
  }
}
