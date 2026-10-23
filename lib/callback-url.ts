export function getCallbackUrl(fallback = "/dashboard") {
  if (typeof window === "undefined") return fallback
  const value = new URLSearchParams(window.location.search).get("callbackUrl")
  return value && value.startsWith("/") && !value.startsWith("//") ? value : fallback
}
