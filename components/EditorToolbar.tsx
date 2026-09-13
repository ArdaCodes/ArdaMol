"use client";

interface ToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  onChange: (value: string) => void;
  onRequestImage: () => void;
}

const BUTTONS = [
  { label: "B", title: "Bold", wrap: "**" },
  { label: "I", title: "Italic", wrap: "*" },
  { label: "❝", title: "Quote", prefix: "> " },
  { label: "•", title: "List", prefix: "- " },
  { label: "</>", title: "Inline code", wrap: "`" },
];

export default function EditorToolbar({ textareaRef, onChange, onRequestImage }: ToolbarProps) {
  function apply(fn: (value: string, start: number, end: number) => { value: string; cursor: number }) {
    const ta = textareaRef.current;
    if (!ta) return;
    const { selectionStart, selectionEnd, value } = ta;
    const { value: next, cursor } = fn(value, selectionStart, selectionEnd);
    onChange(next);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(cursor, cursor);
    });
  }

  function wrapSelection(marker: string) {
    apply((value, start, end) => {
      const selected = value.slice(start, end) || "text";
      const next = value.slice(0, start) + marker + selected + marker + value.slice(end);
      return { value: next, cursor: start + marker.length + selected.length + marker.length };
    });
  }

  function prefixLine(prefix: string) {
    apply((value, start) => {
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const next = value.slice(0, lineStart) + prefix + value.slice(lineStart);
      return { value: next, cursor: start + prefix.length };
    });
  }

  function insertBlock(block: string) {
    apply((value, start, end) => {
      const next = value.slice(0, start) + block + value.slice(end);
      return { value: next, cursor: start + block.length };
    });
  }

  function insertLink() {
    const url = prompt("Link URL:", "https://");
    if (!url) return;
    apply((value, start, end) => {
      const selected = value.slice(start, end) || "link text";
      const snippet = `[${selected}](${url})`;
      const next = value.slice(0, start) + snippet + value.slice(end);
      return { value: next, cursor: start + snippet.length };
    });
  }

  function insertVideo() {
    const url = prompt("YouTube or Vimeo URL:");
    if (!url) return;
    const ytMatch = url.match(/(?:youtu\.be\/|v=)([\w-]{11})/);
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    let token = "";
    if (ytMatch) token = `\n{{youtube:${ytMatch[1]}}}\n`;
    else if (vimeoMatch) token = `\n{{vimeo:${vimeoMatch[1]}}}\n`;
    else {
      alert("Couldn't recognize that URL. Paste a standard YouTube or Vimeo link.");
      return;
    }
    insertBlock(token);
  }

  return (
    <div className="flex flex-wrap items-center gap-1 rounded-t-md border border-b-0 border-stone-300 bg-stone-50 p-2">
      {BUTTONS.map((b) => (
        <button
          key={b.title}
          type="button"
          title={b.title}
          onClick={() => (b.wrap ? wrapSelection(b.wrap) : prefixLine(b.prefix!))}
          className="h-8 min-w-[2rem] rounded px-2 text-sm font-medium text-stone-700 hover:bg-stone-200"
        >
          {b.label}
        </button>
      ))}
      <button
        type="button"
        title="Link"
        onClick={insertLink}
        className="h-8 rounded px-2 text-sm text-stone-700 hover:bg-stone-200"
      >
        🔗
      </button>
      <button
        type="button"
        title="Numbered list"
        onClick={() => prefixLine("1. ")}
        className="h-8 rounded px-2 text-sm text-stone-700 hover:bg-stone-200"
      >
        1.
      </button>
      <button
        type="button"
        title="Code block"
        onClick={() => insertBlock("\n```\ncode here\n```\n")}
        className="h-8 rounded px-2 text-sm text-stone-700 hover:bg-stone-200"
      >
        { "{ }" }
      </button>
      <button
        type="button"
        title="Insert image"
        onClick={onRequestImage}
        className="h-8 rounded px-2 text-sm text-stone-700 hover:bg-stone-200"
      >
        🖼
      </button>
      <button
        type="button"
        title="Insert gallery (multiple images)"
        onClick={() => insertBlock("\n![Image one](https://)\n![Image two](https://)\n![Image three](https://)\n")}
        className="h-8 rounded px-2 text-sm text-stone-700 hover:bg-stone-200"
      >
        🖼🖼
      </button>
      <button
        type="button"
        title="Embed YouTube / Vimeo"
        onClick={insertVideo}
        className="h-8 rounded px-2 text-sm text-stone-700 hover:bg-stone-200"
      >
        ▶
      </button>
      <button
        type="button"
        title="Divider"
        onClick={() => insertBlock("\n\n---\n\n")}
        className="h-8 rounded px-2 text-sm text-stone-700 hover:bg-stone-200"
      >
        —
      </button>
    </div>
  );
}
