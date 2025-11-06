import type { WikiPage } from "./page.model";

export interface IWikiClient {
  getPageNames(): Promise<string[]>;
  getPage(name: string): Promise<WikiPage | undefined>;
}
