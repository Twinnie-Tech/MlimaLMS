import { Hero } from "@/components/site/hero";
import { Features, Schools } from "@/components/site/features";
import { CategoriesSection, PopularCourses, TeachBanner } from "@/components/site/marketplace";
import {
  Audiences,
  CallToAction,
  Faq,
  HowItWorks,
  Pricing,
  Stats,
  SubjectsMarquee,
  Testimonials,
} from "@/components/site/sections";

export default function Home() {
  return (
    <>
      <Hero />
      <SubjectsMarquee />
      <CategoriesSection />
      <PopularCourses />
      <TeachBanner />
      <Features />
      <Stats />
      <Schools />
      <HowItWorks />
      <Audiences />
      <Pricing />
      <Testimonials />
      <Faq />
      <CallToAction />
    </>
  );
}
