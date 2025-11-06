import { isValidWikiLink } from "../../utils/wiki-link-validator";

describe("isValidWikiLink", () => {
  describe("should accept valid internal wiki links", () => {
    it("accepts standard wiki page links", () => {
      expect(isValidWikiLink("/wiki/Desasombrado")).toBe(true);
      expect(isValidWikiLink("/wiki/Anfitrião")).toBe(true);
      expect(isValidWikiLink("/wiki/Ordem_Paranormal")).toBe(true);
    });
  });

  describe("should reject external links", () => {
    it("rejects http links", () => {
      expect(isValidWikiLink("http://google.com")).toBe(false);
      expect(isValidWikiLink("http://exemplo.com")).toBe(false);
    });

    it("rejects https links", () => {
      expect(isValidWikiLink("https://google.com")).toBe(false);
      expect(isValidWikiLink("https://exemplo.com")).toBe(false);
    });

    it("rejects protocol-relative links", () => {
      expect(isValidWikiLink("//example.com")).toBe(false);
    });
  });

  describe("should reject special wiki pages", () => {
    it("rejects file/archive links (Portuguese)", () => {
      expect(isValidWikiLink("/wiki/Arquivo:imagem.png")).toBe(false);
      expect(isValidWikiLink("/wiki/Arquivo:Logo.svg")).toBe(false);
    });

    it("rejects special pages (Portuguese)", () => {
      expect(isValidWikiLink("/wiki/Especial:RecentChanges")).toBe(false);
      expect(isValidWikiLink("/wiki/Especial:Search")).toBe(false);
    });

    it("rejects special pages (English)", () => {
      expect(isValidWikiLink("/wiki/Special:RecentChanges")).toBe(false);
      expect(isValidWikiLink("/wiki/Special:Search")).toBe(false);
    });

    it("rejects category pages (Portuguese)", () => {
      expect(isValidWikiLink("/wiki/Categoria:Personagens")).toBe(false);
    });

    it("rejects category pages (English)", () => {
      expect(isValidWikiLink("/wiki/Category:Characters")).toBe(false);
    });
  });

  describe("should reject invalid inputs", () => {
    it("rejects undefined", () => {
      expect(isValidWikiLink(undefined)).toBe(false);
    });

    it("rejects empty string", () => {
      expect(isValidWikiLink("")).toBe(false);
    });

    it("rejects links without leading slash", () => {
      expect(isValidWikiLink("wiki/Page")).toBe(false);
      expect(isValidWikiLink("Page")).toBe(false);
    });
  });
});
