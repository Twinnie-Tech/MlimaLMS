import { Suspense } from "react";
import type { Metadata } from "next";

import { Skeleton } from "@/components/ui/skeleton";
import { VerifyEmailForm } from "@/components/auth/verify-email-form";

export const metadata: Metadata = { title: "Verify your email" };

async function VerifyEmail({ searchParams }: PageProps<"/verify-email">) {
  const { email } = await searchParams;
  return <VerifyEmailForm email={typeof email === "string" ? email : ""} />;
}

export default function VerifyEmailPage(props: PageProps<"/verify-email">) {
  return (
    <Suspense fallback={<Skeleton className="h-80 rounded-xl" />}>
      <VerifyEmail {...props} />
    </Suspense>
  );
}
