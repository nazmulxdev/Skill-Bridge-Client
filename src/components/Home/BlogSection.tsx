import Link from "next/link";
import { ArrowRight, Calendar, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const posts = [
  {
    title: "10 Tips for Effective Online Learning",
    excerpt: "Discover proven strategies to maximize your tutoring sessions.",
    author: "Sarah Johnson",
    date: "Jan 15, 2026",
  },
  {
    title: "How to Choose the Right Tutor for Your Needs",
    excerpt: "Key factors to consider when selecting your perfect match.",
    author: "Mike Chen",
    date: "Jan 10, 2026",
  },
  {
    title: "The Benefits of One-on-One Tutoring",
    excerpt: "Why personalized attention leads to better results.",
    author: "Emily Davis",
    date: "Jan 5, 2026",
  },
];

export function BlogSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">
              Latest from Our Blog
            </h2>
            <p className="text-muted-foreground mt-2">
              Tips and insights for your learning journey
            </p>
          </div>
          <Link href="/blog">
            <Button variant="outline" className="gap-2">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <Card
              key={i}
              className="hover:shadow-md transition-shadow border-border/50"
            >
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" /> {post.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {post.date}
                  </span>
                </div>
                <Link
                  href="/"
                  className="text-primary text-sm font-medium mt-3 inline-block hover:underline"
                >
                  Read more →
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
