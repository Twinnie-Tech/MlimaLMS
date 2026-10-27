import arcjet, {
  detectBot,
  protectSignup,
  request,
  shield,
  slidingWindow,
  tokenBucket,
  validateEmail,
  type ArcjetDecision,
  type ArcjetNextRequest,
} from "@arcjet/next"

import { env } from "@/lib/env"

const mode = "LIVE"

// Search engines, link previews (WhatsApp, Slack...) and uptime monitors may crawl public pages.
const allowedBots = ["CATEGORY:SEARCH_ENGINE", "CATEGORY:PREVIEW", "CATEGORY:MONITOR"] as const

const blockedEmailTypes = ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"] as const

const base = env.ARCJET_KEY
  ? arcjet({
      key: env.ARCJET_KEY,
      characteristics: ["ip.src"],
      rules: [shield({ mode })],
    })
  : null

if (!base) console.warn("[arcjet] ARCJET_KEY is not set. Request protection is disabled.")

/** Rulesets per endpoint. Limits get stricter the more sensitive or expensive the endpoint. */
const rulesets = base && {
  signUp: base.withRule(
    protectSignup({
      email: { mode, deny: [...blockedEmailTypes] },
      bots: { mode, allow: [] },
      rateLimit: { mode, interval: "10m", max: 5 },
    })
  ),
  sendOtp: base
    .withRule(validateEmail({ mode, deny: [...blockedEmailTypes] }))
    .withRule(detectBot({ mode, allow: [] }))
    .withRule(slidingWindow({ mode, interval: "10m", max: 6 })),
  signIn: base
    .withRule(detectBot({ mode, allow: [] }))
    .withRule(slidingWindow({ mode, interval: "10m", max: 10 })),
  authApi: base
    .withRule(detectBot({ mode, allow: [...allowedBots] }))
    .withRule(slidingWindow({ mode, interval: "1m", max: 120 })),
  userAction: base.withRule(detectBot({ mode, allow: [] })).withRule(
    tokenBucket({
      mode,
      characteristics: ["userId"],
      refillRate: 30,
      interval: "1m",
      capacity: 60,
    })
  ),
}

export type AuthRuleset = "signUp" | "sendOtp" | "signIn" | "authApi"

export function getAuthRuleset(pathname: string): AuthRuleset {
  const path = pathname.replace(/^\/api\/auth/, "")
  if (path === "/sign-up/email") return "signUp"
  if (path === "/email-otp/send-verification-otp" || path === "/email-otp/request-password-reset") {
    return "sendOtp"
  }
  if (
    path.startsWith("/sign-in/") ||
    path === "/email-otp/reset-password" ||
    path === "/email-otp/verify-email" ||
    path === "/change-password"
  ) {
    return "signIn"
  }
  return "authApi"
}

export type Protection = { denied: false } | { denied: true; status: number; message: string }

function toProtection(decision: ArcjetDecision): Protection {
  if (!decision.isDenied()) return { denied: false }

  const { reason } = decision
  if (reason.isRateLimit()) {
    return { denied: true, status: 429, message: "Too many attempts. Please wait a few minutes and try again." }
  }
  if (reason.isEmail()) {
    return {
      denied: true,
      status: 400,
      message: "Please use a valid email address you can receive mail on. Disposable emails are not allowed.",
    }
  }
  if (reason.isBot()) {
    return { denied: true, status: 403, message: "Automated requests are not allowed." }
  }
  return { denied: true, status: 403, message: "Your request was blocked for security reasons." }
}

/** Protects a Better Auth request, picking the ruleset from the endpoint being called. */
export async function protectAuthRequest(
  req: ArcjetNextRequest,
  pathname: string,
  email?: string
): Promise<Protection> {
  if (!rulesets) return { denied: false }

  const ruleset = getAuthRuleset(pathname)
  if (ruleset === "signUp" || ruleset === "sendOtp") {
    if (!email) return { denied: true, status: 400, message: "Email is required." }
    return toProtection(await rulesets[ruleset].protect(req, { email }))
  }
  return toProtection(await rulesets[ruleset].protect(req))
}

/** Token cost per action: expensive or abusable actions use more of the user's allowance. */
const actionCosts = {
  upload: 6,
  createCourse: 5,
  enroll: 3,
  addLesson: 2,
  update: 1,
} as const

export type ProtectedAction = keyof typeof actionCosts

/** Protects a server action for a signed-in user. Returns an error message when blocked. */
export async function protectAction(userId: string, action: ProtectedAction): Promise<string | null> {
  if (!rulesets) return null
  const decision = await rulesets.userAction.protect(await request(), {
    userId,
    requested: actionCosts[action],
  })
  const result = toProtection(decision)
  return result.denied ? result.message : null
}
