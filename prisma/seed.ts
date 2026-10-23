import "dotenv/config"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient, type CourseLevel } from "../lib/generated/prisma/client"

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
})

const categories = [
  { slug: "technology", name: "Technology & Programming", icon: "💻", description: "Web development, data science, cloud, cybersecurity and more." },
  { slug: "health-medicine", name: "Health & Medicine", icon: "🩺", description: "Clinical skills, nursing, public health, nutrition and first aid." },
  { slug: "accounting-finance", name: "Accounting & Finance", icon: "📊", description: "Bookkeeping, CPA revision, tax, Excel and personal finance." },
  { slug: "business", name: "Business & Entrepreneurship", icon: "💼", description: "Start, run and grow a business. Marketing, sales and management." },
  { slug: "design", name: "Design & Creativity", icon: "🎨", description: "Graphic design, UI/UX, illustration and branding." },
  { slug: "photography-video", name: "Photography & Video", icon: "📷", description: "Phone photography, video editing, filmmaking and content creation." },
  { slug: "agriculture", name: "Agriculture & Farming", icon: "🌱", description: "Modern farming, agribusiness, dairy, poultry and horticulture." },
  { slug: "languages", name: "Languages", icon: "🗣️", description: "French, German, Chinese, Kiswahili, English and more." },
  { slug: "music-arts", name: "Music & Performing Arts", icon: "🎵", description: "Instruments, music production, singing and theatre." },
  { slug: "personal-development", name: "Personal Development", icon: "🧠", description: "Productivity, communication, leadership and career growth." },
  { slug: "law", name: "Law & Governance", icon: "⚖️", description: "Kenyan law basics, contracts, human rights and governance." },
  { slug: "school", name: "School (CBC & KPSEA)", icon: "🎓", description: "CBC lessons and revision for Grade 1 to Grade 9." },
]

const instructors = [
  { id: "seed-instructor-brian", name: "Brian Otieno", email: "brian.demo@mlimalms.com", headline: "Senior software engineer", bio: "I have built web apps for banks and startups in Nairobi for 10 years. I love helping beginners write their first lines of code." },
  { id: "seed-instructor-amina", name: "Dr. Amina Hassan", email: "amina.demo@mlimalms.com", headline: "Medical doctor and public health specialist", bio: "Medical doctor with 12 years in county hospitals. I teach practical health skills everyone should know." },
  { id: "seed-instructor-peter", name: "Peter Kariuki, CPA", email: "peter.demo@mlimalms.com", headline: "Certified Public Accountant", bio: "CPA(K) and lecturer. I make accounting simple for students and small business owners." },
  { id: "seed-instructor-wanjiru", name: "Wanjiru Maina", email: "wanjiru.demo@mlimalms.com", headline: "Agripreneur and farm consultant", bio: "I run a 20 acre mixed farm in Nyeri and train young farmers on profitable, modern agriculture." },
  { id: "seed-instructor-kevin", name: "Kevin Kamau", email: "kevin.demo@mlimalms.com", headline: "Product designer and photographer", bio: "Designer by day, photographer by weekend. I teach creative skills you can use to earn." },
]

type SeedCourse = {
  slug: string
  title: string
  subtitle: string
  description: string
  category: string
  instructor: string
  price: number
  level: CourseLevel
  lessons: { title: string; duration: number; content: string }[]
}

const courses: SeedCourse[] = [
  {
    slug: "web-development-for-beginners",
    title: "Web Development for Complete Beginners",
    subtitle: "Build and publish your first website with HTML, CSS and JavaScript",
    description: "Start from zero and build a real website step by step. You will learn how the web works, write HTML and CSS, add interactivity with JavaScript and publish your site online for free.",
    category: "technology",
    instructor: "seed-instructor-brian",
    price: 0,
    level: "BEGINNER",
    lessons: [
      { title: "How the web works", duration: 8, content: "Browsers, servers and URLs explained with simple examples." },
      { title: "Your first HTML page", duration: 15, content: "Headings, paragraphs, links and images. Build a profile page." },
      { title: "Styling with CSS", duration: 18, content: "Colours, fonts, spacing and layout with Flexbox." },
      { title: "Adding JavaScript", duration: 20, content: "Variables, functions and responding to button clicks." },
      { title: "Publishing your website", duration: 10, content: "Put your site online for free and share the link." },
    ],
  },
  {
    slug: "python-data-analysis",
    title: "Data Analysis with Python",
    subtitle: "Turn spreadsheets into insights with pandas and charts",
    description: "Learn Python for data analysis using real Kenyan datasets. Clean data, calculate statistics and create charts that tell a story.",
    category: "technology",
    instructor: "seed-instructor-brian",
    price: 1500,
    level: "INTERMEDIATE",
    lessons: [
      { title: "Setting up Python and Jupyter", duration: 10, content: "Install the tools and run your first notebook." },
      { title: "Loading data with pandas", duration: 16, content: "Read CSV and Excel files into DataFrames." },
      { title: "Cleaning messy data", duration: 22, content: "Handle missing values, duplicates and wrong types." },
      { title: "Charts that tell a story", duration: 18, content: "Bar, line and scatter charts with matplotlib." },
    ],
  },
  {
    slug: "first-aid-essentials",
    title: "First Aid Essentials for Everyone",
    subtitle: "Life saving skills for home, school and work",
    description: "Learn how to respond to common emergencies: CPR, choking, burns, bleeding and fractures. Practical, clear and based on current guidelines.",
    category: "health-medicine",
    instructor: "seed-instructor-amina",
    price: 0,
    level: "ALL_LEVELS",
    lessons: [
      { title: "Staying safe and calling for help", duration: 8, content: "Assess the scene and know when and how to call emergency services." },
      { title: "CPR for adults and children", duration: 18, content: "Step by step chest compressions and rescue breaths." },
      { title: "Choking, bleeding and burns", duration: 16, content: "What to do in the first few minutes." },
      { title: "Fractures and sprains", duration: 12, content: "How to support an injury until help arrives." },
    ],
  },
  {
    slug: "nutrition-and-healthy-living",
    title: "Nutrition and Healthy Living",
    subtitle: "Eat well on a Kenyan budget",
    description: "Understand food groups, plan balanced meals with local foods and prevent lifestyle diseases such as diabetes and hypertension.",
    category: "health-medicine",
    instructor: "seed-instructor-amina",
    price: 800,
    level: "BEGINNER",
    lessons: [
      { title: "Food groups made simple", duration: 10, content: "Carbohydrates, proteins, fats, vitamins and minerals." },
      { title: "Planning balanced meals", duration: 14, content: "Weekly meal plans using affordable local foods." },
      { title: "Preventing lifestyle diseases", duration: 15, content: "Diet and exercise habits that protect your heart." },
    ],
  },
  {
    slug: "bookkeeping-for-small-business",
    title: "Bookkeeping for Small Businesses",
    subtitle: "Keep clean records, track profit and stay KRA compliant",
    description: "Learn simple bookkeeping for your shop or business. Record sales and expenses, prepare a profit and loss statement and understand your KRA obligations.",
    category: "accounting-finance",
    instructor: "seed-instructor-peter",
    price: 1200,
    level: "BEGINNER",
    lessons: [
      { title: "Why records matter", duration: 8, content: "How good records help you grow and get loans." },
      { title: "Recording sales and expenses", duration: 15, content: "A simple daily cash book you can keep in a notebook or Excel." },
      { title: "Profit and loss statement", duration: 18, content: "Find out if your business is really making money." },
      { title: "KRA basics: PIN, eTIMS and turnover tax", duration: 16, content: "What small businesses need to file and when." },
    ],
  },
  {
    slug: "excel-for-accountants",
    title: "Excel for Accountants",
    subtitle: "Formulas, pivot tables and reports that save hours",
    description: "Master the Excel skills accountants use every day: lookups, pivot tables, reconciliations and clean financial reports.",
    category: "accounting-finance",
    instructor: "seed-instructor-peter",
    price: 2000,
    level: "INTERMEDIATE",
    lessons: [
      { title: "Essential formulas", duration: 15, content: "SUMIFS, XLOOKUP, IF and text functions." },
      { title: "Pivot tables", duration: 18, content: "Summarise thousands of transactions in seconds." },
      { title: "Bank reconciliation in Excel", duration: 20, content: "Match bank statements and cash book entries." },
    ],
  },
  {
    slug: "profitable-poultry-farming",
    title: "Profitable Poultry Farming",
    subtitle: "Start and grow a kienyeji or broiler business",
    description: "Everything you need to start a poultry business: housing, feeding, disease control, record keeping and finding buyers.",
    category: "agriculture",
    instructor: "seed-instructor-wanjiru",
    price: 1000,
    level: "BEGINNER",
    lessons: [
      { title: "Choosing the right breed", duration: 10, content: "Kienyeji, improved kienyeji, broilers and layers compared." },
      { title: "Housing and equipment", duration: 14, content: "Build a low cost, well ventilated poultry house." },
      { title: "Feeding and vaccination", duration: 16, content: "Feeding schedules and a vaccination calendar." },
      { title: "Selling your birds and eggs", duration: 12, content: "Pricing, markets and keeping customers." },
    ],
  },
  {
    slug: "smartphone-photography",
    title: "Smartphone Photography Masterclass",
    subtitle: "Take stunning photos with the phone in your pocket",
    description: "Learn composition, lighting and editing to take professional looking photos with any smartphone, and start earning from your photos.",
    category: "photography-video",
    instructor: "seed-instructor-kevin",
    price: 0,
    level: "ALL_LEVELS",
    lessons: [
      { title: "Know your phone camera", duration: 8, content: "Focus, exposure and the camera settings that matter." },
      { title: "Composition rules", duration: 12, content: "Rule of thirds, leading lines and framing." },
      { title: "Working with natural light", duration: 14, content: "Golden hour, shade and window light." },
      { title: "Editing with free apps", duration: 16, content: "Edit like a pro with Snapseed and Lightroom Mobile." },
    ],
  },
  {
    slug: "graphic-design-with-canva",
    title: "Graphic Design with Canva",
    subtitle: "Design posters, logos and social media content",
    description: "Learn the principles of good design and create professional posters, logos and social media posts with Canva, no experience needed.",
    category: "design",
    instructor: "seed-instructor-kevin",
    price: 900,
    level: "BEGINNER",
    lessons: [
      { title: "Design principles", duration: 12, content: "Contrast, alignment, hierarchy and white space." },
      { title: "Colour and fonts", duration: 10, content: "Choose colours and fonts that work together." },
      { title: "Designing a business poster", duration: 18, content: "A complete poster from blank page to print." },
    ],
  },
  {
    slug: "start-your-online-business",
    title: "Start Your Online Business",
    subtitle: "Turn your skill into income with social media and M-Pesa",
    description: "A practical guide to starting a business online in Kenya: find your idea, build a brand, sell on social media and get paid with M-Pesa.",
    category: "business",
    instructor: "seed-instructor-wanjiru",
    price: 1500,
    level: "BEGINNER",
    lessons: [
      { title: "Finding a business idea", duration: 10, content: "Ideas that match your skills and your market." },
      { title: "Building your brand", duration: 12, content: "Name, logo and a story customers remember." },
      { title: "Selling on social media", duration: 16, content: "WhatsApp Business, Instagram and TikTok for sales." },
      { title: "Getting paid and keeping records", duration: 12, content: "M-Pesa Till, Paybill and simple records." },
    ],
  },
  {
    slug: "public-speaking-confidence",
    title: "Public Speaking with Confidence",
    subtitle: "Speak clearly in class, at work and on stage",
    description: "Overcome nerves, structure a great talk and deliver it with confidence. Includes practice exercises after every lesson.",
    category: "personal-development",
    instructor: "seed-instructor-amina",
    price: 0,
    level: "ALL_LEVELS",
    lessons: [
      { title: "Beating stage fright", duration: 9, content: "Breathing and mindset techniques that work." },
      { title: "Structuring your talk", duration: 12, content: "A simple three part structure for any speech." },
      { title: "Voice and body language", duration: 11, content: "Speak so people listen." },
    ],
  },
  {
    slug: "grade-6-mathematics-revision",
    title: "Grade 6 Mathematics Revision",
    subtitle: "KPSEA ready maths, topic by topic",
    description: "Revise every Grade 6 maths topic with short video lessons and practice questions aligned to the CBC curriculum.",
    category: "school",
    instructor: "seed-instructor-peter",
    price: 500,
    level: "BEGINNER",
    lessons: [
      { title: "Whole numbers and place value", duration: 12, content: "Reading, writing and rounding large numbers." },
      { title: "Fractions and decimals", duration: 15, content: "Adding, subtracting and converting fractions." },
      { title: "Measurement", duration: 14, content: "Length, area, capacity and time." },
      { title: "KPSEA practice paper", duration: 20, content: "A full practice paper with worked answers." },
    ],
  },
]

const sampleVideo = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"

async function main() {
  for (const [position, category] of categories.entries()) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { ...category, position },
      create: { ...category, position },
    })
  }

  for (const instructor of instructors) {
    await prisma.user.upsert({
      where: { id: instructor.id },
      update: { name: instructor.name, headline: instructor.headline, bio: instructor.bio },
      create: { ...instructor, emailVerified: true },
    })
  }

  for (const course of courses) {
    const category = await prisma.category.findUniqueOrThrow({ where: { slug: course.category } })
    const data = {
      title: course.title,
      subtitle: course.subtitle,
      description: course.description,
      price: course.price,
      level: course.level,
      status: "PUBLISHED" as const,
      categoryId: category.id,
      instructorId: course.instructor,
    }

    const saved = await prisma.course.upsert({
      where: { slug: course.slug },
      update: data,
      create: { ...data, slug: course.slug },
    })

    await prisma.lesson.deleteMany({ where: { courseId: saved.id } })
    await prisma.lesson.createMany({
      data: course.lessons.map((lesson, position) => ({
        ...lesson,
        position,
        courseId: saved.id,
        isFreePreview: position === 0,
        videoUrl: position === 0 ? sampleVideo : null,
      })),
    })
  }

  console.log(`Seeded ${categories.length} categories, ${instructors.length} instructors and ${courses.length} courses.`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
