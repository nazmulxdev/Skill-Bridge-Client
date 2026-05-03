export function Partners() {
  const logos = ["Harvard", "MIT", "Stanford", "Google", "Microsoft"]; // Replace with real image paths if available
  return (
    <section className="py-12 bg-background border-t">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <p className="text-sm text-muted-foreground mb-6 uppercase tracking-wider">
          Trusted by students from top institutions
        </p>
        <div className="flex flex-wrap justify-center gap-8 opacity-50 grayscale">
          {logos.map((logo) => (
            <span
              key={logo}
              className="text-xl font-bold text-muted-foreground/50"
            >
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
