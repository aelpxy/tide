export function plainText(html: string) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  doc.querySelectorAll("a").forEach((link) => link.remove());
  return doc.body.textContent?.trim() ?? "";
}
