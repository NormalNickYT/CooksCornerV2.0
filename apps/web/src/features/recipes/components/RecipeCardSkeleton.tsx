import { Card, CardContent } from "@/components/ui/card";

/** Placeholder with the same shape as RecipeCard, so the grid does not jump. */
export function RecipeCardSkeleton() {
  return (
    <Card className="overflow-hidden" aria-hidden>
      <div className="h-44 w-full animate-pulse bg-muted" />
      <CardContent className="space-y-3 p-4">
        <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
        <div className="flex gap-2 pt-1">
          <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
          <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
        </div>
        <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
      </CardContent>
    </Card>
  );
}

export default RecipeCardSkeleton;
