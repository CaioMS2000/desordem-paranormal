import wiki from "wikijs";
import type { WikiPage } from "../models/page.model";

export class WikiOp {
  public static async GetPageNames(): Promise<string[] | undefined> {
    try {
      const pageNames = await wiki({
        apiUrl: "https://ordemparanormal.fandom.com/api.php",
      }).allPages();

      return pageNames;
    } catch (error) {
      console.log(error, " na GetPageNames");
      return undefined;
    }
  }

  public static async getPage(pageName: string): Promise<WikiPage | undefined> {
    try {
      const page = await wiki({
        apiUrl: "https://ordemparanormal.fandom.com/api.php",
      }).page(pageName);

      return page as WikiPage;
    } catch (error) {
      console.log(error, " na GetPage");
      return undefined;
    }
  }
}
