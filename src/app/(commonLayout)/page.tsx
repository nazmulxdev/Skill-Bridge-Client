// app/(commonLayout)/page.tsx
import { publicFeaturedTutor } from "@/actions/public.action";
import { Hero } from "@/components/Home/Hero";
import { FeaturedTutors } from "@/components/Home/FeaturedTutors";
import { TopCategories } from "@/components/Home/TopCategories";
import { HowItWorks } from "@/components/Home/HowItWorks";
import { StatsSection } from "@/components/Home/StatsSection";
import { WhyChooseUs } from "@/components/Home/WhyChooseUs";
import { Testimonials } from "@/components/Home/Testimonials";
import { FAQSection } from "@/components/Home/FAQSection";
import { BlogSection } from "@/components/Home/BlogSection";
import { CTASection } from "@/components/Home/CTASection";
import { Partners } from "@/components/Home/Partners";
import { ContactPreview } from "@/components/Home/ContactPreview";

export default async function CommonPage() {
  const { data: featuredTutors } = await publicFeaturedTutor();
  return (
    <div>
      <Hero />
      <StatsSection />
      <FeaturedTutors initialData={featuredTutors} />
      <WhyChooseUs />
      <TopCategories />
      <HowItWorks />
      <Testimonials />
      <BlogSection />
      <Partners />
      <FAQSection />
      <CTASection />
      <ContactPreview />
    </div>
  );
}
