import 'wikijs';

declare module 'wikijs' {
  interface Page {
    rawInfo(): Promise<string>;
    fullInfo(): Promise<any>;
    pageImage(): Promise<string>;
    url(): Promise<string>;
    pageid: number;
    title: string;
  }
}
