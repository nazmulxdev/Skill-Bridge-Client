import { Mail, Phone, MapPin } from "lucide-react";

export function ContactPreview() {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-3xl mx-auto text-center px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Need Help?</h2>
        <p className="text-muted-foreground mb-8">
          Our support team is here for you 24/7.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-8">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-primary" /> support@skillbridge.com
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-primary" /> +1 (555) 123-4567
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-primary" /> San Francisco, CA
          </div>
        </div>
      </div>
    </section>
  );
}
