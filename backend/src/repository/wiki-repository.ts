import { Request, Response } from "express";
import { db } from "../../index";
import { connection, page } from "../database/schemas";
import { Connection, Page } from "../services/wiki-service";

export class WikiRepository {
  public static async GetWiki(req: Request, res: Response) {
    const pages = await db.select().from(page);
    const connections = await db.select().from(connection);

    return res.json({
      pages: pages,
      connection: connections,
    });
  }

  public static async UpdatePage(Page: Page) {
    await db
      .insert(page)
      .values({
        id: Page.id,
        name: Page.name,
        link: Page.link,
      })
      .onConflictDoUpdate({
        target: page.id,
        set: { name: Page.name, link: Page.link },
      });
  }

  public static async UpdateConnection(Connection: Connection) {
    await db
      .insert(connection)
      .values({
        targetPage: Connection.targetPage,
        originPage: Connection.originPage,
      })
      .onConflictDoUpdate({
        target: connection.targetPage && connection.originPage,
        set: {
          targetPage: Connection.targetPage,
          originPage: Connection.originPage,
        },
      });
  }
}
