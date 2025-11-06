import { extractWikiLinks, linksToPageIds } from "../../utils/wiki-link-parser";

describe("extractWikiLinks", () => {
  describe("should extract valid wiki links from HTML", () => {
    it("extracts multiple valid links", () => {
      const html = `
        <a href="/wiki/Desasombrado" title="Desasombrado">Link1</a>
        <a href="/wiki/Anfitrião" title="Anfitrião">Link2</a>
        <a href="/wiki/Ordem_Paranormal" title="Ordem Paranormal">Link3</a>
      `;

      const result = extractWikiLinks(html);

      expect(result).toEqual({
        "/wiki/Desasombrado": "Desasombrado",
        "/wiki/Anfitrião": "Anfitrião",
        "/wiki/Ordem_Paranormal": "Ordem Paranormal",
      });
    });

    it("filters out external links", () => {
      const html = `
        <a href="/wiki/Desasombrado" title="Desasombrado">Internal</a>
        <a href="https://google.com" title="Google">External</a>
        <a href="http://example.com">Another External</a>
      `;

      const result = extractWikiLinks(html);

      expect(result).toEqual({
        "/wiki/Desasombrado": "Desasombrado",
      });
      expect(result["https://google.com"]).toBeUndefined();
    });

    it("filters out file/archive links", () => {
      const html = `
        <a href="/wiki/Desasombrado" title="Desasombrado">Valid</a>
        <a href="/wiki/Arquivo:test.png" title="Image">File</a>
        <a href="/wiki/Arquivo:Logo.svg">Another File</a>
      `;

      const result = extractWikiLinks(html);

      expect(result).toEqual({
        "/wiki/Desasombrado": "Desasombrado",
      });
    });

    it("filters out special pages", () => {
      const html = `
        <a href="/wiki/Desasombrado" title="Desasombrado">Valid</a>
        <a href="/wiki/Especial:Search">Special PT</a>
        <a href="/wiki/Special:RecentChanges">Special EN</a>
        <a href="/wiki/Categoria:Test">Category PT</a>
        <a href="/wiki/Category:Test">Category EN</a>
      `;

      const result = extractWikiLinks(html);

      expect(result).toEqual({
        "/wiki/Desasombrado": "Desasombrado",
      });
    });
  });

  describe("should handle edge cases", () => {
    it("handles empty HTML", () => {
      expect(extractWikiLinks("")).toEqual({});
    });

    it("handles HTML with no links", () => {
      const html = "<div>No links here</div><p>Just text</p>";
      expect(extractWikiLinks(html)).toEqual({});
    });

    it("handles links without title attribute", () => {
      const html = '<a href="/wiki/Test">No Title</a>';
      const result = extractWikiLinks(html);
      expect(result["/wiki/Test"]).toBe("");
    });

    it("handles links with empty title", () => {
      const html = '<a href="/wiki/Test" title="">Empty Title</a>';
      const result = extractWikiLinks(html);
      expect(result["/wiki/Test"]).toBe("");
    });

    it("does not include duplicate links", () => {
      const html = `
        <a href="/wiki/Desasombrado" title="Desasombrado">First</a>
        <a href="/wiki/Desasombrado" title="Desasombrado">Duplicate</a>
      `;
      const result = extractWikiLinks(html);

      // Should only have one entry
      expect(Object.keys(result).length).toBe(1);
      expect(result["/wiki/Desasombrado"]).toBe("Desasombrado");
    });
  });
});

describe("linksToPageIds", () => {
  describe("should convert links to page IDs", () => {
    it("converts valid links using page map", () => {
      const links = {
        "/wiki/Desasombrado": "Desasombrado",
        "/wiki/Anfitrião": "Anfitrião",
        "/wiki/Ordem_Paranormal": "Ordem Paranormal",
      };

      const pageMap = new Map([
        ["Desasombrado", 1827],
        ["Anfitrião", 2],
        ["Ordem Paranormal", 100],
      ]);

      const result = linksToPageIds(links, pageMap);
      expect(result).toEqual([1827, 2, 100]);
    });

    it("ignores links not found in page map", () => {
      const links = {
        "/wiki/Exists": "Exists",
        "/wiki/NotFound": "NotFound",
        "/wiki/AlsoExists": "AlsoExists",
      };

      const pageMap = new Map([
        ["Exists", 1],
        ["AlsoExists", 3],
      ]);

      const result = linksToPageIds(links, pageMap);
      expect(result).toEqual([1, 3]);
      expect(result.length).toBe(2);
    });
  });

  describe("should handle edge cases", () => {
    it("handles empty links object", () => {
      const pageMap = new Map([["Test", 1]]);
      const result = linksToPageIds({}, pageMap);
      expect(result).toEqual([]);
    });

    it("handles empty page map", () => {
      const links = {
        "/wiki/Test": "Test",
      };
      const result = linksToPageIds(links, new Map());
      expect(result).toEqual([]);
    });

    it("handles both empty", () => {
      const result = linksToPageIds({}, new Map());
      expect(result).toEqual([]);
    });

    it("preserves order of links", () => {
      const links = {
        "/wiki/Third": "Third",
        "/wiki/First": "First",
        "/wiki/Second": "Second",
      };

      const pageMap = new Map([
        ["First", 1],
        ["Second", 2],
        ["Third", 3],
      ]);

      const result = linksToPageIds(links, pageMap);
      // Order should match the order of Object.entries(links)
      expect(result).toEqual([3, 1, 2]);
    });
  });
});
