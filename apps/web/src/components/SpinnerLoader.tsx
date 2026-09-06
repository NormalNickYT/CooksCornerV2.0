import { cn } from "@/lib/utils";

interface SpinnerLoaderProps {
  className?: string;
  label?: string;
}

/** A plain CSS spinner, so loading state costs no extra dependency. */
export default function SpinnerLoader({ className, label = "Laden..." }: SpinnerLoaderProps) {
  return (
    <div className={cn("flex min-h-64 items-center justify-center py-16", className)} role="status">
      <span className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
      <span className="sr-only">{label}</span>
    </div>
  );
}
