export default function VideoEmbed({ provider, id }: { provider: "youtube" | "vimeo"; id: string }) {
  const src =
    provider === "youtube"
      ? `https://www.youtube.com/embed/${id}`
      : `https://player.vimeo.com/video/${id}`;

  return (
    <div className="relative my-8 aspect-video overflow-hidden rounded-md border border-[var(--border)]">
      <iframe
        src={src}
        title="Embedded video"
        className="absolute inset-0 h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
