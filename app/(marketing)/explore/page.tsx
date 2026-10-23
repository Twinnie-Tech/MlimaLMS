import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Search, SearchX } from "lucide-react";

import { getCategoriesWithCounts, getPublishedCourses } from "@/lib/queries/courses";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { CourseCard, CourseGridSkeleton } from "@/components/courses/course-card";

export const metadata: Metadata = {
  title: "Explore courses",
  description: "Courses in technology, medicine, accounting, business, farming, design and more, taught by Kenyan experts.",
};

const sortOptions = [
  { value: "popular", label: "Most popular" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: low to high" },
  { value: "price-high", label: "Price: high to low" },
] as const;

type SearchParams = PageProps<"/explore">["searchParams"];

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function buildHref(params: { q?: string; category?: string; sort?: string }) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value);
  }
  const query = search.toString();
  return query ? `/explore?${query}` : "/explore";
}

export default function ExplorePage({ searchParams }: PageProps<"/explore">) {
  return (
    <>
      <section className="relative overflow-hidden border-b">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgb(22_163_74/0.15),transparent_60%)]"
        />
        <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-14 text-center animate-in fade-in slide-in-from-bottom-4 duration-700 sm:px-6 sm:py-20">
          <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            Explore courses in any field
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Technology, medicine, accounting, business, farming, design and more,
            taught by people who do the work every day.
          </p>
          <Suspense fallback={<Skeleton className="mt-8 h-12 w-full max-w-xl rounded-full" />}>
            <SearchForm searchParams={searchParams} />
          </Suspense>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <Suspense fallback={<FiltersSkeleton />}>
          <Filters searchParams={searchParams} />
        </Suspense>
        <Suspense fallback={<CourseGridSkeleton />}>
          <Results searchParams={searchParams} />
        </Suspense>
      </section>
    </>
  );
}

async function SearchForm({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const category = first(params.category);
  const sort = first(params.sort);

  return (
    <form action="/explore" className="relative mt-8 w-full max-w-xl">
      <Search className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" />
      <Input
        name="q"
        defaultValue={first(params.q)}
        placeholder="What do you want to learn? e.g. Excel, first aid, poultry"
        className="h-12 rounded-full bg-background pr-28 pl-12 text-base shadow-sm"
      />
      {category && <input type="hidden" name="category" value={category} />}
      {sort && <input type="hidden" name="sort" value={sort} />}
      <button
        type="submit"
        className="absolute top-1/2 right-1.5 h-9 -translate-y-1/2 rounded-full bg-green-600 px-5 text-sm font-medium text-white transition-colors hover:bg-green-700"
      >
        Search
      </button>
    </form>
  );
}

function FiltersSkeleton() {
  return (
    <div className="flex gap-2 overflow-hidden pb-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-9 w-32 shrink-0 rounded-full" />
      ))}
    </div>
  );
}

async function Filters({ searchParams }: { searchParams: SearchParams }) {
  const [params, categories] = await Promise.all([searchParams, getCategoriesWithCounts()]);
  const q = first(params.q);
  const active = first(params.category);
  const sort = first(params.sort);

  return (
    <div className="flex flex-col gap-4 pb-8">
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        <Link
          href={buildHref({ q, sort })}
          className={cn(
            "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors hover:border-green-600/40",
            !active && "border-green-600 bg-green-600 text-white hover:border-green-600"
          )}
        >
          All fields
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={buildHref({ q, category: category.slug, sort })}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors hover:border-green-600/40",
              active === category.slug && "border-green-600 bg-green-600 text-white hover:border-green-600"
            )}
          >
            {category.icon} {category.name}
            <span className="ml-1.5 opacity-60">{category._count.courses}</span>
          </Link>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-muted-foreground">Sort by:</span>
        {sortOptions.map((option) => (
          <Link
            key={option.value}
            href={buildHref({ q, category: active, sort: option.value })}
            className={cn(
              "rounded-md px-2.5 py-1 transition-colors hover:bg-muted",
              (sort ?? "popular") === option.value && "bg-muted font-medium"
            )}
          >
            {option.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

async function Results({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const q = first(params.q)?.trim();
  const category = first(params.category);
  const sortParam = first(params.sort);
  const sort = sortOptions.some((option) => option.value === sortParam)
    ? (sortParam as (typeof sortOptions)[number]["value"])
    : "popular";

  const courses = await getPublishedCourses({ q, category, sort });

  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed py-16 text-center">
        <SearchX className="size-10 text-muted-foreground" />
        <div>
          <p className="font-semibold">No courses found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try another search, or be the first to teach this topic.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/explore" className={buttonVariants({ variant: "outline" })}>
            Clear filters
          </Link>
          <Link href="/teach" className={cn(buttonVariants(), "bg-green-600 text-white hover:bg-green-700")}>
            Teach this topic
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <p className="mb-4 text-sm text-muted-foreground">
        {courses.length} {courses.length === 1 ? "course" : "courses"}
        {q && <> for &ldquo;{q}&rdquo;</>}
      </p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </>
  );
}
