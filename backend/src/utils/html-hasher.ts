import { createHmac } from "crypto";

export type HtmlHasherType = {
  salt: string;
  hasher(param: string): string;
};

export class HtmlHasher implements HtmlHasherType {
  salt = "13";

  public hasher(html: string) {
    const hash = createHmac("sha256", this.salt).update(html).digest("hex");

    return hash;
  }
}
