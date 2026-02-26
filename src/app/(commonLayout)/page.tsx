import { publicFeaturedTutor } from "@/actions/public.action";
import { FeaturedTutors } from "@/components/Home/FeaturedTutors";
import { Hero } from "@/components/Home/Hero";
import { HowItWorks } from "@/components/Home/HowItWorks";
import { TopCategories } from "@/components/Home/TopCategories";

export default async function CommonPage() {
  const { data: featuredTutors } = await publicFeaturedTutor();
  return (
    <div>
      <Hero />
      <FeaturedTutors initialData={featuredTutors} />
      <TopCategories />
      <HowItWorks />
    </div>
  );
}
