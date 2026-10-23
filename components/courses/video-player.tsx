import { getVideoSource } from "@/lib/course-utils"

export function VideoPlayer({ url, title }: { url: string; title: string }) {
  const source = getVideoSource(url)

  return (
    <div className="aspect-video overflow-hidden rounded-xl border bg-black">
      {source.type === "iframe" ? (
        <iframe
          src={source.src}
          title={title}
          className="size-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <video src={source.src} controls className="size-full" preload="metadata">
          <track kind="captions" />
        </video>
      )}
    </div>
  )
}
