import Link from "next/link"
import {
  ArrowRight,
  Briefcase,
  Calculator,
  Camera,
  CheckCircle2,
  Code,
  FlaskConical,
  GraduationCap,
  Languages,
  Leaf,
  Music,
  Palette,
  Plus,
  Presentation,
  School,
  Sheet,
  Sprout,
  Star,
  Stethoscope,
  Users,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Reveal } from "@/components/site/reveal"

const subjects = [
  { icon: Code, name: "Web Development" },
  { icon: Stethoscope, name: "First Aid & Nursing" },
  { icon: Calculator, name: "Accounting & Tax" },
  { icon: Sheet, name: "Excel" },
  { icon: Sprout, name: "Poultry Farming" },
  { icon: Camera, name: "Photography" },
  { icon: Palette, name: "Graphic Design" },
  { icon: Briefcase, name: "Entrepreneurship" },
  { icon: Presentation, name: "Public Speaking" },
  { icon: Languages, name: "Kiswahili & French" },
  { icon: Music, name: "Music Production" },
  { icon: FlaskConical, name: "CBC Science" },
  { icon: GraduationCap, name: "KPSEA Revision" },
  { icon: Leaf, name: "Nutrition" },
]

export function SubjectsMarquee() {
  return (
    <section id="subjects" className="scroll-mt-20 border-y bg-muted/30 py-10">
      <p className="text-center text-sm text-muted-foreground">
        Thousands of skills to learn, taught by experts across every field
      </p>
      <div className="relative mt-6 overflow-hidden mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <ul className="flex w-max animate-marquee gap-4 hover:[animation-play-state:paused]">
          {[...subjects, ...subjects].map((subject, i) => (
            <li
              key={`${subject.name}-${i}`}
              aria-hidden={i >= subjects.length}
              className="flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm font-medium whitespace-nowrap shadow-xs"
            >
              <subject.icon className="size-4 text-green-600" />
              {subject.name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function Stats() {
  const stats = [
    { value: "100k+", label: "practice questions" },
    { value: "2,000+", label: "recorded video lessons" },
    { value: "Grade 1–9", label: "CBC content coverage" },
    { value: "KSh 750", label: "per month for live classes" },
  ]

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-medium text-green-600">📈 Built to grow with every learner</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Simple for learners. Powerful for teachers.
          </h2>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 100}>
              <div className="rounded-2xl border bg-card p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <p className="bg-linear-to-r from-green-600 to-emerald-400 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function HowItWorks() {
  const steps = [
    {
      title: "Register",
      text: "Create your account with your email or GitHub and verify it in seconds.",
    },
    {
      title: "Add your child",
      text: "Parents add each child with their grade. Every child gets their own profile.",
    },
    {
      title: "Pick a subject and learn",
      text: "Choose a subject, join live classes, watch lessons and answer questions.",
    },
    {
      title: "Subscribe and track",
      text: "Pick a plan that suits you, renew anytime and follow progress in the child report.",
    },
  ]

  return (
    <section className="bg-muted/40 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-medium text-green-600">⚡️ How it works</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Start learning in four simple steps
          </h2>
          <p className="mt-4 text-muted-foreground">
            No new habits to learn. If you can use a smartphone, you can learn on MlimaLMS.
          </p>
        </Reveal>

        <ol className="relative mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div
            aria-hidden
            className="absolute top-6 right-[12%] left-[12%] hidden h-px bg-linear-to-r from-transparent via-green-600/40 to-transparent lg:block"
          />
          {steps.map((step, i) => (
            <Reveal key={step.title} as="li" delay={i * 120} className="relative">
              <span className="relative z-10 flex size-12 items-center justify-center rounded-full bg-green-600 text-lg font-bold text-white shadow-lg ring-8 ring-background">
                {i + 1}
              </span>
              <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

export function Audiences() {
  const audiences = [
    {
      icon: GraduationCap,
      title: "Learners",
      text: "Live classes, video lessons, quizzes and revision papers that make learning fun.",
      cta: "Start learning",
      href: "/online-tuition",
    },
    {
      icon: Users,
      title: "Parents",
      text: "Follow your child's progress with clear reports and know where they need help.",
      cta: "Add your child",
      href: "/child-report",
    },
    {
      icon: Presentation,
      title: "Teachers",
      text: "Create courses, assign work, run live classes and mark quizzes automatically.",
      cta: "Teach on MlimaLMS",
      href: "/support",
    },
    {
      icon: School,
      title: "Schools",
      text: "Roll out digital learning across your school with devices, content and support.",
      cta: "Request a demo",
      href: "/schools#demo",
    },
  ]

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-medium text-green-600">🌍 Built for everyone</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            One platform for the whole learning community
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {audiences.map((audience, i) => (
            <Reveal key={audience.title} delay={i * 100}>
              <Link
                href={audience.href}
                className="group flex h-full flex-col rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-green-600/40 hover:shadow-lg"
              >
                <span className="flex size-12 items-center justify-center rounded-xl bg-green-600/10 text-green-600 transition-colors group-hover:bg-green-600 group-hover:text-white">
                  <audience.icon className="size-6" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{audience.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{audience.text}</p>
                <span className="mt-5 flex items-center gap-1 text-sm font-medium text-green-600">
                  {audience.cta}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "KSh 0",
      period: "forever",
      description: "Try MlimaLMS with sample lessons and quizzes.",
      features: ["Sample lessons in every subject", "10 practice quizzes a week", "Basic progress tracking"],
      cta: "Get started",
      href: "/signup",
    },
    {
      name: "Learner",
      price: "KSh 750",
      period: "per month",
      description: "Everything a learner needs to stay ahead.",
      features: [
        "Live classes Monday to Friday",
        "All recorded video lessons",
        "KPSEA and KJSEA revision papers",
        "Full child report for parents",
      ],
      cta: "Start learning",
      href: "/signup",
      popular: true,
    },
    {
      name: "Schools",
      price: "Custom",
      period: "per school",
      description: "The complete ICT learning package for your school.",
      features: [
        "Tablets with detachable keyboards",
        "Teacher and admin dashboards",
        "One year of mobile data",
        "Training and priority support",
      ],
      cta: "Request a demo",
      href: "/schools#demo",
    },
  ]

  return (
    <section id="pricing" className="scroll-mt-20 bg-muted/40 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-medium text-green-600">💳 Our learning packages</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, affordable pricing
          </h2>
          <p className="mt-4 text-muted-foreground">
            Pay monthly with M-Pesa or card. Cancel or renew anytime.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 120}>
              <div
                className={cn(
                  "relative flex h-full flex-col rounded-2xl border bg-card p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
                  plan.popular && "border-green-600 shadow-lg ring-1 ring-green-600"
                )}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white">
                    Most popular
                  </Badge>
                )}
                <h3 className="font-semibold">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
                <p className="mt-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-sm text-muted-foreground"> / {plan.period}</span>
                </p>
                <ul className="mt-6 flex flex-1 flex-col gap-3 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={cn(
                    buttonVariants({ size: "lg", variant: plan.popular ? "default" : "outline" }),
                    "mt-8 w-full",
                    plan.popular && "bg-green-600 text-white hover:bg-green-700"
                  )}
                >
                  {plan.cta}
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Testimonials() {
  const testimonials = [
    {
      quote:
        "My daughter looks forward to the evening classes. Her maths score went up in one term and I can see exactly what she is learning.",
      name: "Grace N.",
      role: "Parent, Nyeri",
    },
    {
      quote:
        "The revision papers and explanations helped me understand fractions. The mock exams made KPSEA feel easy.",
      name: "Brian K.",
      role: "Grade 6 learner, Meru",
    },
    {
      quote:
        "Assigning work and marking quizzes takes minutes now. The reports show me which learners need extra help.",
      name: "Tr. Mercy W.",
      role: "Teacher, Embu",
    },
  ]

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-medium text-green-600">💬 Testimonials</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Loved by learners, parents and teachers
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((item, i) => (
            <Reveal key={item.name} delay={i * 120}>
              <figure className="flex h-full flex-col rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex gap-0.5 text-amber-500">
                  {Array.from({ length: 5 }).map((_, star) => (
                    <Star key={star} className="size-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed">“{item.quote}”</blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-full bg-green-600/10 text-sm font-semibold text-green-700 dark:text-green-400">
                    {item.name.replace("Tr. ", "").charAt(0)}
                  </span>
                  <span>
                    <span className="block text-sm font-medium">{item.name}</span>
                    <span className="block text-xs text-muted-foreground">{item.role}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

const faqs = [
  {
    q: "What is MlimaLMS?",
    a: "MlimaLMS is a learning management system for learners, parents, teachers and schools. It combines live online classes, recorded video lessons, quizzes, revision papers and progress reports in one place.",
  },
  {
    q: "Which grades and subjects do you cover?",
    a: "We cover Grade 1 to Grade 9 with KICD-approved CBC content, including Mathematics, English, Kiswahili, Science & Technology, Social Studies, CRE, IRE, Agriculture, Creative Arts and more.",
  },
  {
    q: "When are the live online classes?",
    a: "Live tuition classes run Monday to Friday from 6:00 PM to 7:00 PM. Every class is recorded, so learners can rewatch it anytime.",
  },
  {
    q: "How does the child report work?",
    a: "Parents can add one or more children to their account. The child report shows lessons completed, quiz scores, time spent learning and the topics each child needs to practise.",
  },
  {
    q: "How do I pay and renew my subscription?",
    a: "Open your child's account and choose Renew to pick a package. You can pay with M-Pesa or card, and renew or cancel at any time.",
  },
  {
    q: "Can my school use MlimaLMS?",
    a: "Yes. The MlimaLMS ICT learning package includes tablets with detachable keyboards, the LMS software, one year of mobile data, teacher training and support. Request a demo to get started.",
  },
  {
    q: "Can I use MlimaLMS on my phone?",
    a: "Yes. MlimaLMS works in any modern browser on phones, tablets and computers. An Android app is coming soon.",
  },
]

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 bg-muted/40 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Reveal className="text-center">
          <span className="text-sm font-medium text-green-600">📪 FAQ</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-muted-foreground">
            Everything you need to know about learning, teaching and paying on MlimaLMS.
          </p>
        </Reveal>
        <div className="mt-12 flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <Reveal key={faq.q} delay={i * 60}>
              <details className="group rounded-xl border bg-card px-5 transition-shadow open:shadow-md">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-medium [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <Plus className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-45" />
                </summary>
                <p className="pb-5 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function CallToAction() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-green-600 to-emerald-700 px-6 py-16 text-center text-white sm:px-16">
            <div
              aria-hidden
              className="absolute -top-24 -right-24 size-72 animate-float rounded-full bg-white/10 blur-2xl"
            />
            <div
              aria-hidden
              className="absolute -bottom-24 -left-24 size-72 animate-float rounded-full bg-emerald-300/20 blur-2xl"
              style={{ animationDelay: "2s" }}
            />
            <span className="relative text-sm font-medium text-green-100">🚀 Join MlimaLMS</span>
            <h2 className="relative mx-auto mt-3 max-w-2xl text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              Embrace the future of learning today
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-green-50">
              Create a free account in minutes. Learn, teach or bring your whole school on board.
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/signup"
                className={cn(buttonVariants({ size: "lg" }), "group bg-white text-green-700 hover:bg-green-50")}
              >
                Create a free account
                <ArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/schools"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
                )}
              >
                For schools
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
