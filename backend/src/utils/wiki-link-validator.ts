/**
 * Validates if a link is a valid internal wiki link
 * @param href - The href attribute from an anchor tag
 * @returns true if it's a valid wiki link, false otherwise
 */
export function isValidWikiLink(href?: string): boolean {
  if (!href) return false;

  // Reject protocol-relative URLs and external links
  if (href.startsWith("//")) return false;
  if (href.startsWith("http://")) return false;
  if (href.startsWith("https://")) return false;

  // Must start with /
  if (!href.startsWith("/")) return false;

  // Reject special wiki pages
  if (href.startsWith("/wiki/Arquivo:")) return false;
  if (href.startsWith("/wiki/Especial:")) return false;
  if (href.startsWith("/wiki/Special:")) return false;
  if (href.startsWith("/wiki/Categoria:")) return false;
  if (href.startsWith("/wiki/Category:")) return false;

  return true;
}
