import type { RecipeSummary } from "@cookscorner/shared";
import { ChefHat, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface RecipeCardProps {
  recipe: RecipeSummary;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
      {/* The whole card is one link, so there is a single tab stop per
          recipe rather than one per element inside it. */}
      <Link to={`/recipes/${recipe.slug}`} className="block focus-visible:outline-none">
        {recipe.image ? (
          <img
            src={recipe.image}
            alt=""
            loading="lazy"
            className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-44 w-full items-center justify-center bg-muted">
            <ChefHat className="h-10 w-10 text-muted-foreground" />
          </div>
        )}

        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold leading-snug group-hover:underline">{recipe.title}</h3>
            {recipe.status !== "active" && (
              <Badge variant="outline" className="shrink-0 text-xs">
                {recipe.status === "draft" ? "Concept" : "Archief"}
              </Badge>
            )}
          </div>

          <p className="mt-0.5 text-sm text-muted-foreground">{recipe.author.username}</p>

          {recipe.categories.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {recipe.categories.slice(0, 3).map((category) => (
                <Badge key={category.id} variant="secondary" className="text-xs">
                  {category.title}
                </Badge>
              ))}
            </div>
          )}

          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {recipe.totalTime} min
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              {recipe.servings} {recipe.servings === 1 ? "persoon" : "personen"}
            </span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}

export default RecipeCard;
