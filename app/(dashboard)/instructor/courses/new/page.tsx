import { Suspense } from "react";
import type { Metadata } from "next";
import { Lightbulb } from "lucide-react";

import { createCourse } from "@/lib/actions/courses";
import { getCategories } from "@/lib/queries/courses";
import { isS3Configured } from "@/lib/s3";
import { requireUser } from "@/lib/session";
import { Skeleton } from "@/components/ui/skeleton";
import { CourseForm } from "@/components/courses/course-form";
import { PageTitle } from "@/components/dashboard/ui";

export const metadata: Metadata = { title: "Create a course" };

async function NewCourseForm() {
  await requireUser("/instructor/courses/new");
  const categories = await getCategories();

  return <CourseForm action={createCourse} categories={categories} uploadsEnabled={isS3Configured()} />;
}

const tips = [
  "Pick a specific outcome, e.g. “Prepare your own KRA returns” rather than “Tax basics”.",
  "Keep lessons short: 5 to 15 minutes each works best on phones.",
  "Mark your first lesson as a free preview so students can try before enrolling.",
  "You can save as a draft and only publish when you are ready.",
];

export default function NewCoursePage() {
  return (
    <>
      <PageTitle
        title="Create a new course"
        description="Start with the basics. You will add lessons on the next step."
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <section className="rounded-xl border bg-card p-5 sm:p-6">
          <Suspense fallback={<Skeleton className="h-125 rounded-lg" />}>
            <NewCourseForm />
          </Suspense>
        </section>
        <aside className="h-fit rounded-xl border bg-green-600/5 p-5">
          <p className="flex items-center gap-2 font-semibold">
            <Lightbulb className="size-4 text-green-600" />
            Tips for a great course
          </p>
          <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-sm text-muted-foreground">
            {tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </aside>
      </div>
    </>
  );
}
