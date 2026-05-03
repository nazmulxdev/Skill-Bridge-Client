// src/app/(commonLayout)/privacy/page.tsx
import { Metadata } from "next";
import { Shield, Lock, Eye, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy - SkillBridge",
  description: "How we collect, use, and protect your data",
};

const sections = [
  {
    icon: Eye,
    title: "Information We Collect",
    content: `We collect information you provide directly:\n\n• Name, email, phone number\n• Profile picture, bio, education history\n• Payment information (processed by Stripe)\n• Communication data between users\n• Usage analytics and session data`,
  },
  {
    icon: Lock,
    title: "How We Protect Your Data",
    content: `Industry-standard security measures:\n\n• 256-bit SSL encryption\n• Encrypted database storage\n• Regular security audits\n• Two-factor authentication\n• GDPR & CCPA compliance\n• Strict access controls`,
  },
  {
    icon: Shield,
    title: "Your Rights",
    content: `You have full control over your data:\n\n• Access and download your data\n• Correct inaccurate information\n• Delete your account and data\n• Opt-out of marketing communications\n• Withdraw consent at any time\n• Export data in portable format`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10" />
        <div className="container mx-auto px-4 py-16 md:py-20 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-card text-xs mb-4">
              <FileText className="w-3 h-3 text-primary" />
              <span>Legal</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground">
              Last updated: January 1, 2026 • 10 min read
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="prose dark:prose-invert max-w-none mb-12">
          <p className="text-lg leading-relaxed text-muted-foreground">
            At SkillBridge, protecting your privacy is fundamental to our
            mission. This policy explains how we handle your data with
            transparency and respect.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {sections.map((section, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl border bg-card hover:shadow-lg transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
                <section.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-3">{section.title}</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {[
            {
              title: "Cookie Policy",
              content:
                "We use essential cookies for authentication and preferences. Analytics cookies help us improve the platform. You can control non-essential cookies through browser settings.",
            },
            {
              title: "Third-Party Services",
              content:
                "We partner with trusted services: Stripe (payments), Vercel (hosting), Cloudinary (images). Each adheres to strict privacy standards and only receives necessary data.",
            },
            {
              title: "Data Retention",
              content:
                "Active accounts: data retained • Deleted accounts: 30-day recovery period • Session recordings: 30 days • Payment records: 7 years (legal requirement) • Analytics: anonymized indefinitely",
            },
            {
              title: "Children's Privacy",
              content:
                "SkillBridge is intended for users 13 years and older. We do not knowingly collect data from children under 13. Parents can contact us to remove any inadvertently collected information.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl border bg-card hover:border-primary/30 transition-colors"
            >
              <h2 className="text-xl font-semibold mb-3">{item.title}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {item.content}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 rounded-3xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
          <h2 className="text-2xl font-bold mb-4">Questions About Privacy?</h2>
          <p className="text-muted-foreground mb-6">
            Contact our Data Protection Officer for any privacy-related
            inquiries.
          </p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>📧 privacy@skillbridge.com</p>
            <p>📞 +1 (555) 123-4567</p>
          </div>
        </div>
      </div>
    </div>
  );
}
