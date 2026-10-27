import { createEnv } from "@t3-oss/env-nextjs";
import * as z from "zod";
 
export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.url(),
    AUTH_GITHUB_CLIENT_ID: z.string().min(1),
    AUTH_GITHUB_CLIENT_SECRET: z.string().min(1),
    AWS_REGION: z.string().min(1).optional(),
    AWS_ACCESS_KEY_ID: z.string().min(1).optional(),
    AWS_SECRET_ACCESS_KEY: z.string().min(1).optional(),
    AWS_S3_BUCKET: z.string().min(1).optional(),
    AWS_S3_PUBLIC_URL: z.url().optional(),
    EMAIL_FROM_NAME: z.string().min(1).default("MlimaLMS"),
    RESEND_API_KEY: z.string().min(1).optional(),
    RESEND_FROM: z.email().default("onboarding@resend.dev"),
    SMTP_HOST: z.string().min(1).default("smtp.gmail.com"),
    SMTP_PORT: z.coerce.number().int().default(465),
    SMTP_USER: z.string().min(1).optional(),
    SMTP_PASS: z.string().min(1).optional(),
    SMTP_FROM: z.email().optional(),
  },
  // For Next.js >= 13.4.4, you only need to destructure client variables:
  experimental__runtimeEnv: {

  },
  emptyStringAsUndefined: true,
});
