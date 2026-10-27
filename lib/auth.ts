import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { createAuthMiddleware } from "better-auth/api";
import { emailOTP } from "better-auth/plugins";
import { prisma } from "@/lib/db";
import { sendEmailInBackground } from "@/lib/email";
import { otpEmail } from "@/lib/emails/otp-email";
import { passwordChangedEmail, welcomeEmail } from "@/lib/emails/templates";
import { env } from "./env";

const OTP_EXPIRES_IN = 10 * 60;

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    revokeSessionsOnPasswordReset: true,
    async onPasswordReset({ user }) {
      sendEmailInBackground({ to: user.email, ...passwordChangedEmail({ name: user.name }) }, "password reset notice");
    },
  },
  emailVerification: {
    async afterEmailVerification(user) {
      sendEmailInBackground({ to: user.email, ...welcomeEmail({ name: user.name }) }, "welcome email");
    },
  },
  databaseHooks: {
    user: {
      create: {
        // Email code and GitHub sign-ups arrive already verified, so they never reach afterEmailVerification.
        async after(user) {
          if (user.emailVerified) {
            sendEmailInBackground({ to: user.email, ...welcomeEmail({ name: user.name }) }, "welcome email");
          }
        },
      },
    },
  },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/change-password") return;
      const user = ctx.context.session?.user;
      if (user && !(ctx.context.returned instanceof Error)) {
        sendEmailInBackground({ to: user.email, ...passwordChangedEmail({ name: user.name }) }, "password change notice");
      }
    }),
  },
  socialProviders: { 
    github: { 
      clientId: env.AUTH_GITHUB_CLIENT_ID as string, 
      clientSecret: env.AUTH_GITHUB_CLIENT_SECRET as string, 
    }, 
  }, 
  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: OTP_EXPIRES_IN,
      allowedAttempts: 5,
      sendVerificationOnSignUp: true,
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        // Sent after the response so response timing does not reveal whether the account exists.
        sendEmailInBackground({ to: email, ...otpEmail({ otp, type, minutes: OTP_EXPIRES_IN / 60 }) }, `${type} OTP`);
      },
    }),
  ],
});
