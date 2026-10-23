import {
  BookOpenCheck,
  Compass,
  Download,
  FileText,
  HeartHandshake,
  Languages,
  LineChart,
  type LucideIcon,
  MessageCircleQuestion,
  Newspaper,
  Presentation,
  Quote,
  School,
  Sparkles,
  Users,
  Video,
} from "lucide-react"

import { categoryIcons, featuredCategories } from "@/lib/category-icons"

export type NavItem = {
  label: string
  href: string
  description?: string
  icon?: LucideIcon
}

export type NavGroup = {
  label: string
  href?: string
  items?: NavItem[]
}

export const mainNav: NavGroup[] = [
  {
    label: "Explore",
    items: [
      { label: "All courses", href: "/explore", description: "Browse every course on MlimaLMS", icon: Compass },
      ...featuredCategories
        .filter((category) =>
          ["technology", "health-medicine", "accounting-finance", "business", "agriculture", "school"].includes(
            category.slug
          )
        )
        .map((category) => ({
          label: category.name,
          href: `/explore?category=${category.slug}`,
          icon: categoryIcons[category.slug],
        })),
    ],
  },
  {
    label: "Product",
    items: [
      { label: "Our product", href: "/product", description: "Everything MlimaLMS can do", icon: BookOpenCheck },
      { label: "Online tuition", href: "/online-tuition", description: "Live classes Monday to Friday", icon: Video },
      { label: "KPSEA revision", href: "/kpsea-revision", description: "Papers, mocks and explanations", icon: FileText },
      { label: "Child report", href: "/child-report", description: "Track your child's progress", icon: LineChart },
      { label: "School of Languages", href: "/languages", description: "French, German, Chinese and more", icon: Languages },
      { label: "For schools", href: "/schools", description: "The complete ICT learning package", icon: School },
      { label: "Downloads", href: "/downloads", description: "Apps, timetables and resources", icon: Download },
    ],
  },
  { label: "Teach", href: "/teach" },
  { label: "Pricing", href: "/pricing" },
  {
    label: "About us",
    items: [
      { label: "Our DNA", href: "/about", description: "Our mission, vision and values", icon: Sparkles },
      { label: "Meet our team", href: "/about#team", description: "The people behind MlimaLMS", icon: Users },
      { label: "Testimonials", href: "/about#testimonials", description: "What learners and parents say", icon: Quote },
      { label: "MlimaLMS pitch", href: "/about#pitch", description: "Why we built MlimaLMS", icon: Presentation },
      { label: "Blog", href: "/blog", description: "Tips for learners, parents and teachers", icon: Newspaper },
    ],
  },
  {
    label: "Support",
    items: [
      { label: "Customer care", href: "/support", description: "Talk to our support team", icon: HeartHandshake },
      { label: "FAQs", href: "/faq", description: "Answers to common questions", icon: MessageCircleQuestion },
    ],
  },
]

export const contact = {
  address: "Kimathi Way, Nyeri, Kenya",
  phone: "+254 700 000 000",
  whatsapp: "+254 700 000 001",
  email: "support@mlimalms.com",
  hours: "Monday to Saturday, 8:00 AM to 8:00 PM",
}

export const team = [
  { name: "Wanjiru Maina", role: "Founder & CEO", bio: "Former high school teacher on a mission to make quality learning affordable for every Kenyan child." },
  { name: "Brian Otieno", role: "Chief Technology Officer", bio: "Builds the platform that powers live classes, quizzes and reports for thousands of learners." },
  { name: "Achieng Odhiambo", role: "Head of Curriculum", bio: "Leads our teachers in creating CBC-aligned lessons and revision papers." },
  { name: "David Mutua", role: "Head of Schools", bio: "Helps schools roll out the ICT learning package and trains their teachers." },
  { name: "Grace Njeri", role: "Customer Care Lead", bio: "Makes sure every parent, learner and school gets help when they need it." },
  { name: "Kevin Kamau", role: "Product Designer", bio: "Designs simple experiences that work on any phone, tablet or computer." },
]

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  category: string
  author: string
  date: string
  readTime: string
  content: string[]
}

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-prepare-for-kpsea",
    title: "How to prepare your child for KPSEA in 8 weeks",
    excerpt: "A simple week by week revision plan that builds confidence without the stress.",
    category: "Revision",
    author: "Achieng Odhiambo",
    date: "2026-10-12",
    readTime: "6 min read",
    content: [
      "KPSEA assesses what learners have mastered from Grade 4 to Grade 6. The best preparation is steady, daily practice rather than last minute cramming.",
      "Start by taking one full mock paper per subject to find the topics your child finds hardest. The MlimaLMS child report highlights these automatically.",
      "Spend the next six weeks on short topical revision sessions of 30 to 45 minutes. Mix new questions with topics your child already knows to build confidence.",
      "In the final two weeks, sit timed mock papers under exam conditions and go through every explanation together. Celebrate progress, not just scores.",
    ],
  },
  {
    slug: "cbc-explained-for-parents",
    title: "The Competency Based Curriculum explained for parents",
    excerpt: "What CBC means for your child, what the learning areas are and how you can help at home.",
    category: "Parents",
    author: "Wanjiru Maina",
    date: "2026-09-28",
    readTime: "5 min read",
    content: [
      "The Competency Based Curriculum focuses on what learners can do, not only on what they can remember. Learners build skills such as communication, critical thinking and creativity.",
      "Each grade has learning areas such as Mathematics, English, Kiswahili, Science & Technology, Social Studies, Creative Arts and Religious Education.",
      "Parents play a big role. Ask your child to explain what they learned today, encourage projects at home and keep an eye on progress in the child report.",
    ],
  },
  {
    slug: "making-online-classes-work",
    title: "5 tips to make evening online classes work for your family",
    excerpt: "Small routines that help learners stay focused and get the most from live classes.",
    category: "Online learning",
    author: "Grace Njeri",
    date: "2026-09-10",
    readTime: "4 min read",
    content: [
      "Set up a quiet learning corner with good light and a charged device before 6:00 PM.",
      "Join a few minutes early so your child is settled when the teacher starts.",
      "Encourage your child to ask questions in the chat. Teachers love curious learners.",
      "Rewatch recorded classes on weekends to revise difficult topics.",
      "Check the weekly report together and celebrate small wins.",
    ],
  },
  {
    slug: "digital-learning-in-schools",
    title: "Bringing digital learning to rural schools in Mt Kenya",
    excerpt: "How tablets, offline content and teacher training are changing classrooms.",
    category: "Schools",
    author: "David Mutua",
    date: "2026-08-22",
    readTime: "7 min read",
    content: [
      "Many schools want to go digital but face challenges with devices, internet and training. The MlimaLMS ICT learning package addresses all three.",
      "Each learner gets a 10 inch tablet with a detachable keyboard, preloaded with KICD-approved content and one year of mobile data.",
      "Teachers receive hands-on training so they can assign work, run live lessons and track progress from day one.",
    ],
  },
]

export const downloads = [
  { title: "MlimaLMS Android app", description: "Learn on the go with live classes, lessons and quizzes.", type: "App", size: "Coming soon", href: "#" },
  { title: "Online tuition timetable, Term 3", description: "Weekly timetable for live classes from Grade 4 to Grade 9.", type: "PDF", size: "180 KB", href: "#" },
  { title: "KPSEA sample paper: Mathematics", description: "A full sample paper with marking scheme.", type: "PDF", size: "420 KB", href: "#" },
  { title: "KPSEA sample paper: English", description: "A full sample paper with marking scheme.", type: "PDF", size: "390 KB", href: "#" },
  { title: "Parent's guide to MlimaLMS", description: "How to add children, read reports and renew packages.", type: "PDF", size: "1.2 MB", href: "#" },
  { title: "Schools ICT package brochure", description: "Everything included in the ICT learning package.", type: "PDF", size: "2.4 MB", href: "#" },
]
