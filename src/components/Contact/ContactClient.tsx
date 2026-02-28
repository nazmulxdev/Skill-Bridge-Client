// components/Contact/ContactClient.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  MessageSquare,
  Users,
  Headphones,
  ArrowRight,
  Sparkles,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Youtube,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    details: ["admin@skilbridge.com", "skillbridge@tutor.com"],
    action: "Send a message",
    gradient: "from-primary to-primary/60",
    bgLight: "bg-primary/10",
    textLight: "text-primary",
  },
  {
    icon: Phone,
    title: "Call Us",
    details: ["+880 1722244445", "+880 1600003854"],
    action: "24/7 support",
    gradient: "from-primary to-primary/60",
    bgLight: "bg-primary/10",
    textLight: "text-primary",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    details: ["374 Thana Road", "Savar, Dhaka-1216"],
    action: "Get directions",
    gradient: "from-primary to-primary/60",
    bgLight: "bg-primary/10",
    textLight: "text-primary",
  },
  {
    icon: Clock,
    title: "Business Hours",
    details: ["Monday - Friday: 9AM - 8PM", "Weekends: 10AM - 4PM"],
    action: "All times EST",
    gradient: "from-primary to-primary/60",
    bgLight: "bg-primary/10",
    textLight: "text-primary",
  },
];

const faqs = [
  {
    question: "How do I book a slot?",
    answer:
      "Before booking slots you have to open an account as an student. Without opening student account , you can't able to book any slot.",
  },
  {
    question: "How do join as a tutor?",
    answer:
      "To join as a tutor first , you have to create an account as tutor role. Then go to your dashboard and complete your profile by adding fill up all information form.",
  },
  {
    question: "How do I find a tutor?",
    answer:
      "Browse our tutors, filter by subject, price, and rating, then book a session with your preferred tutor.",
  },
  {
    question: "Can I cancel a booking?",
    answer:
      "Yes, you can cancel before the session is confirmed by teacher. Late cancellations may incur a fee.",
  },
  {
    question: "How are tutors verified?",
    answer:
      "All tutors undergo a thorough background check, credential verification, and interview process before joining.",
  },
];

const socialLinks = [
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
];

export function ContactClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success("Message sent successfully!", {
      description: "We'll get back to you within 24 hours.",
      icon: <CheckCircle2 className="h-4 w-4" />,
    });

    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <main className="w-full min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      {/* Hero Section - Full Width */}
      <section className="w-full py-12 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="w-full my-8 max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-foreground mt-8">
              We're Here to{" "}
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                Help You
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Have questions about our tutoring services? Our support team is
              ready to assist you 24/7.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards - Full Width */}
      <section className="w-full pb-12">
        <div className="w-full max-w-full my-4 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 my-4">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative group h-full"
                >
                  <Card className="relative overflow-hidden border-2 border-border hover:border-primary/30 transition-all duration-500 h-full bg-card">
                    {/* Gradient Overlay */}
                    <div
                      className={cn(
                        "absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                      )}
                    />

                    <CardContent className="p-6 sm:p-8 text-center relative">
                      {/* Icon */}
                      <div className="relative mb-4 sm:mb-6 inline-block">
                        <div
                          className={cn(
                            "absolute inset-0 rounded-full blur-xl transition-all duration-500 bg-primary/10",
                          )}
                        />
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                      </div>

                      {/* Content */}
                      <h3 className="text-base sm:text-lg font-bold mb-2 sm:mb-3 text-foreground">
                        {info.title}
                      </h3>
                      {info.details.map((detail, idx) => (
                        <p
                          key={idx}
                          className="text-xs sm:text-sm text-muted-foreground"
                        >
                          {detail}
                        </p>
                      ))}
                      <p
                        className={cn("text-xs font-medium mt-3 text-primary")}
                      >
                        {info.action}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="w-full pb-12 my-4">
        <div className="w-full max-w-full my-4 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="border-2 border-border bg-card">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                        Send us a Message
                      </h2>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        We'll respond within 24 hours
                      </p>
                    </div>
                  </div>

                  <form
                    onSubmit={handleSubmit}
                    className="space-y-4 sm:space-y-5"
                  >
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="name"
                          className="text-sm text-foreground"
                        >
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          required
                          className="bg-background border-border focus:border-primary h-10 sm:h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="email"
                          className="text-sm text-foreground"
                        >
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          required
                          className="bg-background border-border focus:border-primary h-10 sm:h-11"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="subject"
                        className="text-sm text-foreground"
                      >
                        Subject
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="How can we help you?"
                        required
                        className="bg-background border-border focus:border-primary h-10 sm:h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="message"
                        className="text-sm text-foreground"
                      >
                        Message
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us more about your inquiry..."
                        rows={5}
                        required
                        className="bg-background border-border focus:border-primary resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground h-11 sm:h-12 text-sm sm:text-base"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Map & Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* Map Card */}
              <Card className="border-2 border-border bg-card overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative h-[250px] sm:h-[300px] w-full bg-gradient-to-br from-primary/10 to-primary/5">
                    {/* Interactive Map Placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center px-4">
                        <MapPin className="h-10 w-10 sm:h-12 sm:w-12 text-primary/40 mx-auto mb-3" />
                        <p className="text-xs sm:text-sm text-muted-foreground max-w-[250px] sm:max-w-none">
                          123 Education Street, San Francisco, CA 94105
                        </p>
                        <Button
                          variant="link"
                          className="text-primary mt-2 text-xs sm:text-sm"
                        >
                          Get Directions
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>

                    {/* Decorative Grid Overlay */}
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)`,
                        backgroundSize: "40px 40px",
                        opacity: 0.2,
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <Card className="border-border bg-card">
                  <CardContent className="p-3 sm:p-4 text-center">
                    <p className="text-xl sm:text-2xl font-bold text-primary">
                      24/7
                    </p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      Support
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-border bg-card">
                  <CardContent className="p-3 sm:p-4 text-center">
                    <p className="text-xl sm:text-2xl font-bold text-primary">
                      &lt; 2hr
                    </p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      Response
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-border bg-card">
                  <CardContent className="p-3 sm:p-4 text-center">
                    <p className="text-xl sm:text-2xl font-bold text-primary">
                      98%
                    </p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      Satisfaction
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Social Links */}
              <Card className="border-2 border-border bg-card">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      <span className="text-sm sm:text-base font-medium text-foreground">
                        Follow Us
                      </span>
                    </div>
                    <div className="flex gap-2 sm:gap-3">
                      {socialLinks.map((social, index) => {
                        const Icon = social.icon;
                        return (
                          <motion.a
                            key={index}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                            aria-label={social.label}
                          >
                            <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                          </motion.a>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full my-4 pb-12">
        <div className="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2 sm:mb-3 mt-8">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Find quick answers to common questions about our services
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  className={cn(
                    "border-2 transition-all duration-300 cursor-pointer bg-card",
                    activeFaq === index
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30",
                  )}
                  onClick={() =>
                    setActiveFaq(activeFaq === index ? null : index)
                  }
                >
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-sm sm:text-base font-semibold text-foreground">
                        {faq.question}
                      </h3>
                      <div
                        className={cn(
                          "w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center transition-all flex-shrink-0",
                          activeFaq === index
                            ? "bg-primary text-primary-foreground"
                            : "bg-primary/10 text-primary",
                        )}
                      >
                        <span className="text-sm sm:text-base">
                          {activeFaq === index ? "−" : "+"}
                        </span>
                      </div>
                    </div>
                    {activeFaq === index && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-xs sm:text-sm text-muted-foreground mt-3 pt-3 border-t border-border"
                      >
                        {faq.answer}
                      </motion.p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Full Width */}
      <section className="w-full pb-12">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
            <CardContent className="p-6 sm:p-8 md:p-10 text-center">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2 sm:mb-3">
                Need Immediate Assistance?
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-2xl mx-auto mb-4 sm:mb-6">
                Our support team is available 24/7 to help you with any urgent
                questions
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button
                  size="lg"
                  className="gap-2 px-6 sm:px-8 bg-primary hover:bg-primary/90 text-primary-foreground h-10 sm:h-11 md:h-12 text-xs sm:text-sm md:text-base"
                >
                  <Headphones className="h-3 w-3 sm:h-4 sm:w-4" />
                  Live Chat
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 px-6 sm:px-8 border-border hover:border-primary/30 h-10 sm:h-11 md:h-12 text-xs sm:text-sm md:text-base"
                >
                  <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
                  Call Us Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
