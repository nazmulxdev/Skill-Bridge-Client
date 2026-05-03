"use client";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "How do I book a session?",
    a: "Browse tutors, select a time slot, and confirm your booking. First session is free!",
  },
  {
    q: "Can I cancel a booking?",
    a: "Yes, free cancellation up to 24 hours before the session.",
  },
  {
    q: "How are tutors vetted?",
    a: "All tutors undergo background checks, ID verification, and subject assessments.",
  },
  {
    q: "What subjects are available?",
    a: "We cover 150+ subjects including Math, Science, Programming, Languages, and more.",
  },
  {
    q: "How does payment work?",
    a: "You pay securely after each session. Tutors set their own rates.",
  },
  {
    q: "Is there a refund policy?",
    a: "If you're unsatisfied, request a refund within 24 hours. Satisfaction guaranteed.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border rounded-xl overflow-hidden">
              <button
                className="w-full flex justify-between items-center p-5 text-left font-medium hover:bg-muted/30 transition-colors"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                {faq.q}
                {openIndex === idx ? (
                  <Minus className="h-4 w-4 shrink-0" />
                ) : (
                  <Plus className="h-4 w-4 shrink-0" />
                )}
              </button>
              {openIndex === idx && (
                <div className="px-5 pb-5 text-muted-foreground">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
