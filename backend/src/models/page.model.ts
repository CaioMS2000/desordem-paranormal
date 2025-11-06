export interface Page {
  id: number;
  name: string;
  link: string;
}

export interface WikiPageRaw {
  pageid: number;
  title: string;
  fullurl: string;
}

export interface WikiPage {
  raw: WikiPageRaw;
  html(): Promise<string>;
}
