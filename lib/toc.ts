export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function slugifyHeading(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export function extractToc(markdown: string): TocItem[] {
  const lines = markdown.split("\n");
  const items: TocItem[] = [];
  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.*)/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      items.push({ id: slugifyHeading(text), text, level });
    }
  }
  return items;
}
