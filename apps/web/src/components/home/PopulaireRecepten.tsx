import type { RecipeSummary } from "@cookscorner/shared";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RecipeCard } from "@/features/recipes/components/RecipeCard";
import { RecipeCardSkeleton } from "@/features/recipes/components/RecipeCardSkeleton";

interface RecipeSectionProps {
  recipes: RecipeSummary[];
  isLoading?: boolean;
}

export default function PopulaireRecepten({ recipes, isLoading }: RecipeSectionProps) {
  return (
    <section className="pb-10">
      <div className="px-4 lg:px-20">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-semibold text-text dark:text-dark-text">Snel op tafel</h2>
          <Button asChild variant="outline">
            <Link to="/recipes?sort=quickest">Alle recepten</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }, (_, index) => <RecipeCardSkeleton key={index} />)
            : recipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)}
        </div>

        {!isLoading && recipes.length === 0 && (
          <p className="py-10 text-center text-muted-foreground">Nog geen recepten gedeeld.</p>
        )}
      </div>
    </section>
  );
}
