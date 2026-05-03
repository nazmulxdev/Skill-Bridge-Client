import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
      <div className="max-w-4xl mx-auto text-center px-4">
        <Sparkles className="h-10 w-10 mx-auto mb-4 opacity-80" />
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          Ready to Accelerate Your Learning?
        </h2>
        <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
          Join 45,000+ students already learning with SkillBridge. Start your
          first free session today!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup">
            <Button
              size="lg"
              variant="secondary"
              className="gap-2 bg-background text-foreground hover:bg-background/90"
            >
              Get Started Free <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/tutors">
            <Button
              size="lg"
              variant="secondary"
              className="gap-2 bg-background text-foreground hover:bg-background/90"
            >
              Browse Tutors
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
