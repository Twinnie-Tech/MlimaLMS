export const courses = [
  { id: "math-6", title: "Mathematics", grade: "Grade 6", teacher: "Tr. Wanjiku", lessons: 48, completed: 34, emoji: "➗", color: "from-green-600 to-emerald-400" },
  { id: "eng-6", title: "English Activities", grade: "Grade 6", teacher: "Mr. Otieno", lessons: 42, completed: 27, emoji: "📖", color: "from-sky-600 to-cyan-400" },
  { id: "kis-6", title: "Kiswahili", grade: "Grade 6", teacher: "Mwl. Mutua", lessons: 40, completed: 36, emoji: "🗣️", color: "from-amber-500 to-orange-400" },
  { id: "sci-6", title: "Science & Technology", grade: "Grade 6", teacher: "Tr. Achieng", lessons: 45, completed: 18, emoji: "🔬", color: "from-violet-600 to-fuchsia-400" },
  { id: "sst-6", title: "Social Studies", grade: "Grade 6", teacher: "Mr. Kamau", lessons: 36, completed: 36, emoji: "🌍", color: "from-rose-500 to-pink-400" },
  { id: "cre-6", title: "CRE", grade: "Grade 6", teacher: "Tr. Njeri", lessons: 30, completed: 9, emoji: "✝️", color: "from-teal-600 to-emerald-400" },
]

export const liveClasses = [
  { day: "Monday", date: "26 Oct", subject: "Mathematics", topic: "Fractions and decimals", teacher: "Tr. Wanjiku", time: "6:00 PM", live: true },
  { day: "Tuesday", date: "27 Oct", subject: "English", topic: "Composition writing", teacher: "Mr. Otieno", time: "6:00 PM" },
  { day: "Wednesday", date: "28 Oct", subject: "Science & Technology", topic: "Simple machines", teacher: "Tr. Achieng", time: "6:00 PM" },
  { day: "Thursday", date: "29 Oct", subject: "Kiswahili", topic: "Insha ya maelezo", teacher: "Mwl. Mutua", time: "6:00 PM" },
  { day: "Friday", date: "30 Oct", subject: "Social Studies", topic: "Physical features of Kenya", teacher: "Mr. Kamau", time: "6:00 PM" },
]

export const recordings = [
  { subject: "Mathematics", topic: "Area of triangles", date: "23 Oct", duration: "58 min" },
  { subject: "Kiswahili", topic: "Ngeli za nomino", date: "22 Oct", duration: "55 min" },
  { subject: "Science & Technology", topic: "The human heart", date: "21 Oct", duration: "60 min" },
  { subject: "English", topic: "Reading comprehension", date: "20 Oct", duration: "57 min" },
]

export const revisionPapers = [
  { title: "KPSEA Mathematics Mock 1", subject: "Mathematics", questions: 30, minutes: 60, status: "completed" as const, score: 82 },
  { title: "KPSEA English Mock 1", subject: "English", questions: 30, minutes: 60, status: "completed" as const, score: 74 },
  { title: "KPSEA Kiswahili Mock 1", subject: "Kiswahili", questions: 30, minutes: 60, status: "in-progress" as const },
  { title: "KPSEA Integrated Science Mock 1", subject: "Integrated Science", questions: 30, minutes: 60, status: "new" as const },
  { title: "KPSEA Creative Arts Mock 1", subject: "Creative Arts & Social Studies", questions: 30, minutes: 60, status: "new" as const },
  { title: "Fractions topical quiz", subject: "Mathematics", questions: 15, minutes: 20, status: "completed" as const, score: 93 },
]

export const children = [
  { name: "Amani Wambui", grade: "Grade 6", school: "Nyeri Primary School", average: 80, lessonsThisWeek: 14, plan: "Learner", subjects: [
    { name: "Mathematics", score: 82 }, { name: "English", score: 74 }, { name: "Kiswahili", score: 88 }, { name: "Science", score: 69 },
  ] },
  { name: "Baraka Wambui", grade: "Grade 4", school: "Nyeri Primary School", average: 73, lessonsThisWeek: 9, plan: "Free", subjects: [
    { name: "Mathematics", score: 71 }, { name: "English", score: 78 }, { name: "Kiswahili", score: 70 }, { name: "Science", score: 74 },
  ] },
]

export const payments = [
  { id: "MLM-10482", date: "1 Oct 2026", description: "Learner package · Amani", method: "M-Pesa", amount: "KSh 750", status: "Paid" },
  { id: "MLM-10311", date: "1 Sep 2026", description: "Learner package · Amani", method: "M-Pesa", amount: "KSh 750", status: "Paid" },
  { id: "MLM-10154", date: "1 Aug 2026", description: "Learner package · Amani", method: "Card", amount: "KSh 750", status: "Paid" },
]

export const weeklyActivity = [
  { day: "Mon", minutes: 45 },
  { day: "Tue", minutes: 70 },
  { day: "Wed", minutes: 35 },
  { day: "Thu", minutes: 80 },
  { day: "Fri", minutes: 60 },
  { day: "Sat", minutes: 25 },
  { day: "Sun", minutes: 15 },
]
