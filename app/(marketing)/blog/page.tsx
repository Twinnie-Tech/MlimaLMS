import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";

import { blogPosts } from "@/lib/site-config";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/site/page-header";
import { Section } from "@/components/site/blocks";
import { Reveal } from "@/components/site/reveal";

export const metadata: Metadata = {
  title: "Blog",
  description: "Tips, guides and news for learners, parents, teachers and schools.",
};

const gradients = [
  "from-green-600 to-emerald-400",
  "from-sky-600 to-cyan-400",
  "from-amber-500 to-orange-400",
  "from-violet-600 to-fuchsia-400",
];

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" });
}

export default function BlogPage() {
  const [featured, ...rest] = blogPosts;

  return (
    <>
      <PageHeader
        eyebrow="📰 Blog"
        title="Tips and stories for better learning"
        description="Guides for parents, revision tips for learners and news from schools using MlimaLMS."
      />

      <Section>
        <Reveal>
          <Link
            href={`/blog/${featured.slug}`}
            className="group grid overflow-hidden rounded-3xl border bg-card transition-all duration-300 hover:shadow-xl md:grid-cols-2"
          >
            <div className={`flex min-h-56 items-center justify-center bg-linear-to-br ${gradients[0]} p-10 text-6xl`}>
              📚
            </div>
            <div className="flex flex-col justify-center p-8">
              <Badge variant="secondary" className="w-fit">{featured.category}</Badge>
              <h2 className="mt-4 text-2xl font-bold tracking-tight transition-colors group-hover:text-green-600">
                {featured.title}
              </h2>
              <p className="mt-3 text-muted-foreground">{featured.excerpt}</p>
              <div className="mt-6 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar className="size-3.5" />{formatDate(featured.date)}</span>
                <span className="flex items-center gap-1"><Clock className="size-3.5" />{featured.readTime}</span>
              </div>
            </div>
          </Link>
        </Reveal>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {rest.map((post, i) => (
            <Reveal key={post.slug} delay={i * 100}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className={`flex h-40 items-center justify-center bg-linear-to-br ${gradients[(i + 1) % gradients.length]} text-5xl`}>
                  {["🧭", "💻", "🏫"][i % 3]}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <Badge variant="secondary" className="w-fit">{post.category}</Badge>
                  <h3 className="mt-3 font-semibold transition-colors group-hover:text-green-600">{post.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{post.excerpt}</p>
                  <span className="mt-4 flex items-center gap-1 text-sm font-medium text-green-600">
                    Read more
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
