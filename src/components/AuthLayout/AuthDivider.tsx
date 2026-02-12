export function AuthDivider({ text }: { text: string }) {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border/50" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-card px-2 text-muted-foreground/70 backdrop-blur-sm">
          {text}
        </span>
      </div>
    </div>
  );
}
