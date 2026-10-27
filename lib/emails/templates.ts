import { appUrl, firstName, renderEmail } from "@/lib/emails/layout"

function formatWhen(date: Date) {
  return date.toLocaleString("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Nairobi",
  })
}

export function welcomeEmail({ name }: { name: string }) {
  return renderEmail({
    subject: "Welcome to MlimaLMS 🎉",
    preheader: "Your account is ready. Here is how to get started.",
    heading: `Karibu, ${firstName(name)}! Your account is ready.`,
    blocks: [
      {
        type: "text",
        content:
          "Thanks for joining MlimaLMS, the place to learn anything and teach what you know. Here is what you can do next:",
      },
      {
        type: "list",
        items: [
          "Explore courses in technology, health, finance, farming, design and more",
          "Join live CBC classes and KPSEA revision for Grade 4 to Grade 9",
          "Track your progress from your dashboard",
          "Share your skills by creating your own course",
        ],
      },
    ],
    cta: { label: "Explore courses", href: appUrl("/explore") },
    footnote: "Need help? Reply to this email or visit our help centre. We are happy to help.",
  })
}

export function passwordChangedEmail({ name, changedAt = new Date() }: { name: string; changedAt?: Date }) {
  return renderEmail({
    subject: "Your MlimaLMS password was changed",
    preheader: "This is a confirmation that your password was updated.",
    heading: "Your password has been updated",
    blocks: [
      {
        type: "text",
        content: `Hi ${firstName(name)}, the password for your MlimaLMS account was changed on ${formatWhen(changedAt)} (Nairobi time).`,
      },
      {
        type: "text",
        content: "For your security, you have been signed out of your other devices.",
      },
    ],
    cta: { label: "Log in to MlimaLMS", href: appUrl("/login") },
    footnote:
      "Did not change your password? Reset it right away using “Forgot password” on the login page and contact our support team.",
  })
}

export function enrollmentEmail({
  name,
  courseTitle,
  instructorName,
  lessons,
  slug,
}: {
  name: string
  courseTitle: string
  instructorName: string
  lessons: number
  slug: string
}) {
  return renderEmail({
    subject: `You are enrolled in ${courseTitle}`,
    preheader: "Your course is ready. Start your first lesson today.",
    heading: `You are in, ${firstName(name)}! 🎓`,
    blocks: [
      { type: "text", content: "You have successfully enrolled in:" },
      { type: "highlight", title: `Taught by ${instructorName} · ${lessons} lessons`, content: courseTitle },
      {
        type: "text",
        content: "Learn at your own pace. Your progress is saved automatically, so you can continue from any device.",
      },
    ],
    cta: { label: "Start learning", href: appUrl(`/learn/${slug}`) },
  })
}

export function newStudentEmail({
  instructorName,
  studentName,
  courseTitle,
  totalStudents,
  courseId,
}: {
  instructorName: string
  studentName: string
  courseTitle: string
  totalStudents: number
  courseId: string
}) {
  return renderEmail({
    subject: `New student in ${courseTitle}`,
    preheader: `${studentName} just enrolled in your course.`,
    heading: `You have a new student, ${firstName(instructorName)}!`,
    blocks: [
      { type: "text", content: `${studentName} just enrolled in your course.` },
      {
        type: "highlight",
        title: `${totalStudents} ${totalStudents === 1 ? "student" : "students"} enrolled`,
        content: courseTitle,
      },
      { type: "text", content: "Keep your lessons up to date to give your students the best experience." },
    ],
    cta: { label: "Open instructor dashboard", href: appUrl(`/instructor/courses/${courseId}`) },
  })
}

export function coursePublishedEmail({
  name,
  courseTitle,
  slug,
}: {
  name: string
  courseTitle: string
  slug: string
}) {
  return renderEmail({
    subject: `Your course “${courseTitle}” is live 🚀`,
    preheader: "Students can now find and enroll in your course.",
    heading: `Congratulations, ${firstName(name)}! Your course is live.`,
    blocks: [
      { type: "highlight", title: "Now published", content: courseTitle },
      { type: "text", content: "Students can now find your course on the Explore page and enroll. A few tips:" },
      {
        type: "list",
        items: [
          "Share the course link on WhatsApp, LinkedIn and with your network",
          "Mark your first lesson as a free preview so students can try it",
          "Add new lessons regularly to keep students engaged",
        ],
      },
    ],
    cta: { label: "View your course", href: appUrl(`/explore/${slug}`) },
  })
}

export function courseCompletedEmail({
  name,
  courseTitle,
  instructorName,
}: {
  name: string
  courseTitle: string
  instructorName: string
}) {
  return renderEmail({
    subject: `You completed ${courseTitle} 🏆`,
    preheader: "Congratulations on finishing your course!",
    heading: `Well done, ${firstName(name)}! 🏆`,
    blocks: [
      { type: "text", content: "You have completed every lesson in:" },
      { type: "highlight", title: `Taught by ${instructorName}`, content: courseTitle },
      { type: "text", content: "Keep the momentum going. Pick your next skill from hundreds of courses." },
    ],
    cta: { label: "Find your next course", href: appUrl("/explore") },
  })
}
