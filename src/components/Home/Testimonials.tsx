"use client";
import { useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    name: "Alex Johnson",
    role: "Student",
    comment:
      "SkillBridge helped me ace my calculus exams. My tutor was incredibly patient and knowledgeable.",
    rating: 5,
  },
  {
    name: "Maria Garcia",
    role: "Student",
    comment:
      "I learned Python in just 2 months! The flexible scheduling was perfect for my busy life.",
    rating: 5,
  },
  {
    name: "James Chen",
    role: "Student",
    comment:
      "The 1-on-1 attention made all the difference. Highly recommend the free trial.",
    rating: 5,
  },
  {
    name: "Emily Davis",
    role: "Tutor",
    comment:
      "Teaching on SkillBridge has been a rewarding experience. The platform handles everything seamlessly.",
    rating: 5,
  },
  {
    name: "Daniel Kim",
    role: "Student",
    comment:
      "Affordable rates and top-notch tutors. I've already booked 10 sessions.",
    rating: 5,
  },
];

export function Testimonials() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () =>
    setCurrent(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          What Our Users Say
        </h2>
        <p className="text-muted-foreground mb-12">
          Real stories from our community
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="border-none shadow-lg bg-card">
              <CardContent className="p-8 md:p-12">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-6 w-6 ${i < testimonials[current].rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
                    />
                  ))}
                </div>
                <p className="text-lg md:text-xl italic mb-6">
                  "{testimonials[current].comment}"
                </p>
                <Avatar className="mx-auto h-12 w-12 mb-2">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {testimonials[current].name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <p className="font-semibold">{testimonials[current].name}</p>
                <p className="text-sm text-muted-foreground">
                  {testimonials[current].role}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center gap-2 mt-6">
          <Button variant="outline" size="icon" onClick={prev}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={next}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
