import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

import { blogPosts } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);
  return post ? { title: post.title, description: post.excerpt } : {};
}

export default function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <Link href="/blog" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "-ml-2")}>
        <ArrowLeft />
        All articles
      </Link>
      <Suspense fallback={<ArticleSkeleton />}>
        <BlogPost params={params} />
      </Suspense>
    </article>
  );
}

function ArticleSkeleton() {
  return (
    <div className="mt-6 flex flex-col gap-4">
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="mt-6 h-32 w-full" />
    </div>
  );
}

async function BlogPost({ params }: { params: PageProps<"/blog/[slug]">["params"] }) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);
  if (!post) notFound();

  const more = blogPosts.filter((item) => item.slug !== post.slug).slice(0, 2);

  return (
    <>
      <header className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Badge variant="secondary">{post.category}</Badge>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl">{post.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>
        <div className="mt-6 flex flex-wrap items-center gap-4 border-b pb-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-full bg-green-600/10 text-xs font-semibold text-green-700 dark:text-green-400">
              {post.author.split(" ").map((part) => part[0]).join("")}
            </span>
            {post.author}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="size-4" />
            {new Date(post.date).toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-4" />
            {post.readTime}
          </span>
        </div>
      </header>

      <div className="mt-8 flex flex-col gap-5 text-base leading-relaxed">
        {post.content.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border bg-linear-to-br from-green-600/10 to-emerald-400/10 p-6">
        <p className="font-semibold">Ready to put this into practice?</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Create a free MlimaLMS account and start learning today.
        </p>
        <Link
          href="/signup"
          className={cn(buttonVariants(), "mt-4 bg-green-600 text-white hover:bg-green-700")}
        >
          Sign up free
        </Link>
      </div>

      <div className="mt-12">
        <h2 className="font-semibold">More articles</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {more.map((item) => (
            <Link
              key={item.slug}
              href={`/blog/${item.slug}`}
              className="rounded-xl border bg-card p-4 transition-all hover:border-green-600/40 hover:shadow-md"
            >
              <Badge variant="secondary">{item.category}</Badge>
              <p className="mt-2 font-medium">{item.title}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
