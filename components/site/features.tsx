import Link from "next/link"
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  Circle,
  FileText,
  Globe2,
  Keyboard,
  Languages,
  LineChart,
  School,
  Tablet,
  Video,
  Wifi,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Reveal } from "@/components/site/reveal"

type Feature = {
  id?: string
  emoji: string
  eyebrow: string
  title: string
  description: string
  points: string[]
  cta: { label: string; href: string }
  preview: React.ReactNode
}

const features: Feature[] = [
  {
    emoji: "🎥",
    eyebrow: "Online tuition classes",
    title: "Live, interactive classes after school.",
    description:
      "Join qualified teachers live for Grade 4 to Grade 9, Monday to Friday from 6:00 PM to 7:00 PM. Ask questions, answer polls and rewatch any class you missed.",
    points: [
      "Small live classes with real teachers",
      "Every class is recorded for revision",
      "Affordable monthly plan from KSh 750",
    ],
    cta: { label: "See the timetable", href: "/online-tuition" },
    preview: <TimetablePreview />,
  },
  {
    emoji: "📊",
    eyebrow: "Child report",
    title: "Know exactly how your child is doing.",
    description:
      "Parents get a clear report for every subject: lessons completed, quiz scores, time spent learning and the topics that need more practice.",
    points: [
      "Progress per subject and per topic",
      "Weekly summary sent to parents",
      "Add more than one child to one account",
    ],
    cta: { label: "View a sample report", href: "/child-report" },
    preview: <ReportPreview />,
  },
  {
    emoji: "📝",
    eyebrow: "KPSEA and KJSEA revision",
    title: "Step by step guidance for exam candidates.",
    description:
      "Thousands of practice questions and timed mock papers, with instant marking and worked explanations so learners understand every answer.",
    points: [
      "Past papers and topical revision questions",
      "Timed mock exams with instant results",
      "Explanations for every question",
    ],
    cta: { label: "Start revising", href: "/kpsea-revision" },
    preview: <QuizPreview />,
  },
  {
    emoji: "🌍",
    eyebrow: "MlimaLMS School of Languages",
    title: "Speak a new language with confidence.",
    description:
      "Beginner to advanced language courses with native-speaking tutors, audio lessons and conversation practice for learners of every age.",
    points: [
      "French, German, Chinese, Kiswahili and English",
      "Speaking and listening practice",
      "Certificates when you complete a level",
    ],
    cta: { label: "Explore languages", href: "/languages" },
    preview: <LanguagesPreview />,
  },
]

export function Features() {
  return (
    <section id="features" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="rounded-full px-3 py-1">
            ✨ Everything in one place
          </Badge>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            One platform for learning, revision and reporting
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            MlimaLMS is an intelligent e-tutoring platform for learners, parents
            and teachers, built around the Kenyan curriculum.
          </p>
        </Reveal>

        <div className="mt-20 flex flex-col gap-24">
          {features.map((feature, index) => (
            <div
              key={feature.eyebrow}
              className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
            >
              <Reveal className={cn(index % 2 === 1 && "lg:order-2")}>
                <span className="text-sm font-medium text-green-600">
                  {feature.emoji} {feature.eyebrow}
                </span>
                <h3 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                  {feature.title}
                </h3>
                <p className="mt-4 text-muted-foreground">{feature.description}</p>
                <ul className="mt-6 flex flex-col gap-3">
                  {feature.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green-600" />
                      {point}
                    </li>
                  ))}
                </ul>
                <Link
                  href={feature.cta.href}
                  className={cn(buttonVariants({ variant: "outline" }), "group mt-8")}
                >
                  {feature.cta.label}
                  <ArrowRight className="transition-transform group-hover:translate-x-1" />
                </Link>
              </Reveal>

              <Reveal delay={150} className={cn(index % 2 === 1 && "lg:order-1")}>
                <div className="rounded-2xl border bg-linear-to-br from-green-600/10 via-transparent to-emerald-400/10 p-6 sm:p-10">
                  {feature.preview}
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TimetablePreview() {
  const classes = [
    { day: "Mon", subject: "Mathematics", teacher: "Tr. Wanjiku", live: true },
    { day: "Tue", subject: "English", teacher: "Mr. Otieno" },
    { day: "Wed", subject: "Science & Technology", teacher: "Tr. Achieng" },
    { day: "Thu", subject: "Kiswahili", teacher: "Mwl. Mutua" },
    { day: "Fri", subject: "Social Studies", teacher: "Mr. Kamau" },
  ]

  return (
    <div className="rounded-xl border bg-card p-4 shadow-lg transition-transform duration-500 hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <p className="font-semibold">This week · Grade 6</p>
        <Badge variant="secondary">6:00 PM to 7:00 PM</Badge>
      </div>
      <ul className="mt-4 flex flex-col gap-2">
        {classes.map((item) => (
          <li
            key={item.day}
            className="flex items-center gap-3 rounded-lg border bg-background/60 px-3 py-2"
          >
            <span className="w-10 text-xs font-medium text-muted-foreground">{item.day}</span>
            <Video className="size-4 text-green-600" />
            <span className="flex-1 text-sm">
              <span className="font-medium">{item.subject}</span>
              <span className="text-muted-foreground"> · {item.teacher}</span>
            </span>
            {item.live ? (
              <span className="flex items-center gap-1.5 text-xs font-medium text-red-600">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-500 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-red-500" />
                </span>
                Live
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">Upcoming</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

function ReportPreview() {
  const subjects = [
    { name: "Mathematics", score: 82, color: "bg-green-600" },
    { name: "English", score: 74, color: "bg-sky-500" },
    { name: "Kiswahili", score: 88, color: "bg-amber-500" },
    { name: "Science & Tech", score: 69, color: "bg-violet-500" },
    { name: "Social Studies", score: 77, color: "bg-rose-500" },
  ]

  return (
    <div className="rounded-xl border bg-card p-4 shadow-lg transition-transform duration-500 hover:-translate-y-1">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-full bg-green-600/15 font-semibold text-green-700 dark:text-green-400">
          AW
        </span>
        <div className="flex-1">
          <p className="font-semibold">Amani Wambui</p>
          <p className="text-xs text-muted-foreground">Grade 6 · Term 2 report</p>
        </div>
        <LineChart className="size-5 text-green-600" />
      </div>
      <ul className="mt-5 flex flex-col gap-3">
        {subjects.map((subject, i) => (
          <li key={subject.name}>
            <div className="flex justify-between text-sm">
              <span>{subject.name}</span>
              <span className="font-medium">{subject.score}%</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className={cn("h-full origin-left animate-fill-bar rounded-full", subject.color)}
                style={{ width: `${subject.score}%`, animationDelay: `${i * 120}ms` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function QuizPreview() {
  const options = ["3/4", "5/8", "7/8", "1/2"]

  return (
    <div className="rounded-xl border bg-card p-4 shadow-lg transition-transform duration-500 hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <Badge className="bg-green-600/10 text-green-700 dark:text-green-400">
          <FileText />
          KPSEA Mock · Mathematics
        </Badge>
        <span className="text-xs text-muted-foreground">Question 7 of 30</span>
      </div>
      <p className="mt-4 font-medium">What is 1/4 + 5/8?</p>
      <ul className="mt-4 grid grid-cols-2 gap-2">
        {options.map((option) => {
          const correct = option === "7/8"
          return (
            <li
              key={option}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm",
                correct && "border-green-600 bg-green-600/10 font-medium"
              )}
            >
              {correct ? (
                <CheckCircle2 className="size-4 text-green-600" />
              ) : (
                <Circle className="size-4 text-muted-foreground" />
              )}
              {option}
            </li>
          )
        })}
      </ul>
      <div className="mt-4 rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">Explanation: </span>
        1/4 is the same as 2/8, and 2/8 + 5/8 = 7/8.
      </div>
    </div>
  )
}

function LanguagesPreview() {
  const languages = [
    { flag: "🇫🇷", name: "French", level: "Beginner A1", progress: 64 },
    { flag: "🇩🇪", name: "German", level: "Beginner A1", progress: 38 },
    { flag: "🇨🇳", name: "Chinese", level: "HSK 1", progress: 22 },
    { flag: "🇰🇪", name: "Kiswahili", level: "Fasihi", progress: 91 },
  ]

  return (
    <div className="rounded-xl border bg-card p-4 shadow-lg transition-transform duration-500 hover:-translate-y-1">
      <div className="flex items-center gap-2">
        <Languages className="size-5 text-green-600" />
        <p className="font-semibold">My language courses</p>
        <Globe2 className="ml-auto size-4 text-muted-foreground" />
      </div>
      <ul className="mt-4 flex flex-col gap-2">
        {languages.map((language, i) => (
          <li key={language.name} className="flex items-center gap-3 rounded-lg border px-3 py-2">
            <span className="text-2xl">{language.flag}</span>
            <div className="flex-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{language.name}</span>
                <span className="text-xs text-muted-foreground">{language.level}</span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full origin-left animate-fill-bar rounded-full bg-green-600"
                  style={{ width: `${language.progress}%`, animationDelay: `${i * 120}ms` }}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Schools() {
  const packageItems = [
    { icon: Tablet, title: "10 inch tablet", text: "A durable learning tablet for every learner." },
    { icon: Keyboard, title: "Detachable keyboard", text: "Ready for typing, coding and ICT lessons." },
    { icon: BookOpenCheck, title: "LMS software", text: "Full MlimaLMS access for teachers and learners." },
    { icon: Wifi, title: "One year of data", text: "Mobile internet included for a full year." },
  ]

  return (
    <section id="schools" className="scroll-mt-20 bg-muted/40 py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <Reveal>
          <span className="text-sm font-medium text-green-600">🏫 MlimaLMS for schools</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            The complete ICT learning package for your school.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Give every learner a high quality tablet with a detachable keyboard,
            the MlimaLMS platform and a full year of mobile internet. Learners
            get KICD-approved content from Grade 1 to Grade 9 and thousands of
            professionally recorded video lessons.
          </p>
          <ul className="mt-6 flex flex-col gap-3 text-sm">
            {[
              "Teacher dashboard to assign work and track classes",
              "Hundreds of thousands of approved learning resources",
              "Training and support for your teachers",
            ].map((point) => (
              <li key={point} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green-600" />
                {point}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/schools#demo"
              className={cn(buttonVariants({ size: "lg" }), "bg-green-600 text-white hover:bg-green-700")}
            >
              <School />
              Request a demo
            </Link>
            <Link href="/schools" className={buttonVariants({ size: "lg", variant: "outline" })}>
              Learn more
            </Link>
          </div>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2">
          {packageItems.map((item, i) => (
            <Reveal key={item.title} delay={i * 100}>
              <div className="group h-full rounded-xl border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-green-600/40 hover:shadow-lg">
                <span className="flex size-11 items-center justify-center rounded-lg bg-green-600/10 text-green-600 transition-colors group-hover:bg-green-600 group-hover:text-white">
                  <item.icon className="size-5" />
                </span>
                <p className="mt-4 font-semibold">{item.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
