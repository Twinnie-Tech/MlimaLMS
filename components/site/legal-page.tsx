import { PageHeader } from "@/components/site/page-header"

export type LegalSection = { title: string; body: string[] }

export function LegalPage({
  eyebrow,
  title,
  updated,
  sections,
}: {
  eyebrow: string
  title: string
  updated: string
  sections: LegalSection[]
}) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} description={`Last updated ${updated}`} />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[220px_1fr]">
        <nav className="hidden lg:block">
          <ul className="sticky top-24 flex flex-col gap-2 text-sm">
            {sections.map((section, i) => (
              <li key={section.title}>
                <a
                  href={`#section-${i + 1}`}
                  className="text-muted-foreground transition-colors hover:text-green-600"
                >
                  {i + 1}. {section.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex max-w-3xl flex-col gap-10">
          {sections.map((section, i) => (
            <section key={section.title} id={`section-${i + 1}`} className="scroll-mt-24">
              <h2 className="text-xl font-semibold">
                {i + 1}. {section.title}
              </h2>
              <div className="mt-3 flex flex-col gap-3 leading-relaxed text-muted-foreground">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  )
}
