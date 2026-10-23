import type { Metadata } from "next";

import { ProfileForm } from "@/components/dashboard/profile-form";
import { PageTitle } from "@/components/dashboard/ui";

export const metadata: Metadata = { title: "Profile" };

export default function ProfilePage() {
  return (
    <>
      <PageTitle title="Profile" description="Manage your personal details and notifications." />
      <ProfileForm />
    </>
  );
}
