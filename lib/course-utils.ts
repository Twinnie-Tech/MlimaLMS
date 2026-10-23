export const levelLabels = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
  ALL_LEVELS: "All levels",
} as const

export type Level = keyof typeof levelLabels

export function formatPrice(price: number) {
  return price === 0 ? "Free" : `KSh ${price.toLocaleString("en-KE")}`
}

export function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest ? `${hours}h ${rest}m` : `${hours}h`
}

const gradients: Record<string, string> = {
  technology: "from-sky-600 to-cyan-400",
  "health-medicine": "from-rose-500 to-pink-400",
  "accounting-finance": "from-emerald-600 to-teal-400",
  business: "from-amber-500 to-orange-400",
  design: "from-fuchsia-600 to-pink-400",
  "photography-video": "from-violet-600 to-indigo-400",
  agriculture: "from-green-600 to-lime-400",
  languages: "from-blue-600 to-sky-400",
  "music-arts": "from-purple-600 to-fuchsia-400",
  "personal-development": "from-orange-500 to-yellow-400",
  law: "from-slate-600 to-slate-400",
  school: "from-green-600 to-emerald-400",
}

export function categoryGradient(slug: string) {
  return gradients[slug] ?? "from-green-600 to-emerald-400"
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60)
}

export function getVideoSource(url: string) {
  const youtube = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/)
  if (youtube) return { type: "iframe" as const, src: `https://www.youtube.com/embed/${youtube[1]}` }

  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeo) return { type: "iframe" as const, src: `https://player.vimeo.com/video/${vimeo[1]}` }

  return { type: "video" as const, src: url }
}
