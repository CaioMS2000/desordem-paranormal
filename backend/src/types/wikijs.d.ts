declare module "wikijs" {
  interface WikiOptions {
    apiUrl: string;
  }

  interface WikiPage {
    raw: {
      pageid: number;
      title: string;
      fullurl: string;
    };
    html(): Promise<string>;
  }

  interface WikiAPI {
    allPages(): Promise<string[]>;
    page(title: string): Promise<WikiPage>;
  }

  function wiki(options: WikiOptions): WikiAPI;

  export default wiki;
}
