import { clampServings } from "@cookscorner/shared";
import { ChefHat, Clock, Pencil, Trash2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import SpinnerLoader from "@/components/SpinnerLoader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCurrentUser } from "@/features/auth/useAuth";
import { IngredientList } from "@/features/recipes/components/IngredientList";
import { ServingsStepper } from "@/features/recipes/components/ServingsStepper";
import { useDeleteRecipe, useRecipe } from "@/features/recipes/useRecipes";
import { errorMessage } from "@/lib/api";

function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours} uur` : `${hours} uur ${rest} min`;
}

/**
 * A single recipe.
 *
 * This page did not exist before: recipes could be created and listed, but
 * never opened. It is also where the serving-size control lives, because that
 * is the moment someone is standing in the kitchen deciding how much to cook.
 */
export default function RecipeDetail() {
  const { idOrSlug } = useParams<{ idOrSlug: string }>();
  const navigate = useNavigate();
  const { data: recipe, isLoading, error } = useRecipe(idOrSlug);
  const { user } = useCurrentUser();
  const deleteRecipe = useDeleteRecipe();

  // Starts at whatever the author wrote the recipe for.
  const [servings, setServings] = useState(1);

  useEffect(() => {
    if (recipe) setServings(clampServings(recipe.servings));
  }, [recipe?.id, recipe?.servings]);

  if (isLoading) return <SpinnerLoader />;

  if (error || !recipe) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-24 text-center">
        <ChefHat className="mx-auto h-12 w-12 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-bold">Dit recept bestaat niet (meer)</h1>
        <p className="mt-2 text-muted-foreground">
          {error ? errorMessage(error) : "Misschien is de link verouderd."}
        </p>
        <Button asChild className="mt-6">
          <Link to="/recipes">Bekijk alle recepten</Link>
        </Button>
      </div>
    );
  }

  const isAuthor = user?.id === recipe.author.id;

  const handleDelete = async () => {
    if (!window.confirm(`"${recipe.title}" definitief verwijderen?`)) return;
    try {
      await deleteRecipe.mutateAsync(recipe.id);
      toast.success(`"${recipe.title}" is verwijderd`);
      navigate("/dashboard/user-recipes");
    } catch (deleteError) {
      toast.error(errorMessage(deleteError, "Verwijderen is niet gelukt"));
    }
  };

  return (
    <article className="container mx-auto max-w-5xl px-4 py-8 md:px-6">
      <header className="grid gap-6 md:grid-cols-2 md:items-center">
        {recipe.image ? (
          <img
            src={recipe.image}
            alt={recipe.title}
            className="aspect-[4/3] w-full rounded-xl object-cover"
          />
        ) : (
          <div className="flex aspect-[4/3] w-full items-center justify-center rounded-xl bg-muted">
            <ChefHat className="h-16 w-16 text-muted-foreground" />
          </div>
        )}

        <div>
          {recipe.status !== "active" && (
            <Badge variant="outline" className="mb-3">
              {recipe.status === "draft" ? "Concept" : "Gearchiveerd"}
            </Badge>
          )}

          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{recipe.title}</h1>

          <p className="mt-2 text-muted-foreground">
            door <span className="font-medium text-foreground">{recipe.author.username}</span>
          </p>

          {recipe.description && <p className="mt-4 leading-relaxed">{recipe.description}</p>}

          <div className="mt-5 flex flex-wrap gap-2">
            {recipe.categories.map((category) => (
              <Badge key={category.id} variant="secondary">
                {category.title}
              </Badge>
            ))}
          </div>

          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <dt className="sr-only">Totale tijd</dt>
              <dd>
                <span className="font-semibold">{formatMinutes(recipe.totalTime)}</span>
                <span className="text-muted-foreground"> totaal</span>
              </dd>
            </div>
            <div className="flex items-center gap-2">
              <ChefHat className="h-4 w-4 text-muted-foreground" />
              <dt className="sr-only">Bereidingstijd</dt>
              <dd>
                <span className="font-semibold">{formatMinutes(recipe.preparationTime)}</span>
                <span className="text-muted-foreground"> voorbereiden</span>
              </dd>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <dt className="sr-only">Geschreven voor</dt>
              <dd>
                <span className="font-semibold">{recipe.servings}</span>
                <span className="text-muted-foreground"> personen</span>
              </dd>
            </div>
          </dl>

          {isAuthor && (
            <div className="mt-6 flex gap-2">
              <Button asChild variant="outline" size="sm" className="gap-1.5">
                <Link to={`/dashboard/recipes/${recipe.id}/edit`}>
                  <Pencil className="h-3.5 w-3.5" />
                  Bewerken
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-destructive"
                onClick={handleDelete}
                disabled={deleteRecipe.isPending}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Verwijderen
              </Button>
            </div>
          )}
        </div>
      </header>

      <Separator className="my-10" />

      <div className="grid gap-10 md:grid-cols-[minmax(0,22rem)_1fr] md:gap-12">
        <section aria-labelledby="ingredients-heading">
          <Card className="md:sticky md:top-6">
            <CardHeader className="pb-4">
              <CardTitle id="ingredients-heading">Ingrediënten</CardTitle>
              <ServingsStepper
                baseServings={recipe.servings}
                value={servings}
                onChange={setServings}
                className="pt-2"
              />
              {servings !== recipe.servings && (
                <p className="pt-1 text-sm text-muted-foreground">
                  Omgerekend vanaf {recipe.servings} {recipe.servings === 1 ? "persoon" : "personen"}.
                </p>
              )}
            </CardHeader>
            <CardContent>
              <IngredientList
                ingredients={recipe.ingredients}
                baseServings={recipe.servings}
                servings={servings}
              />
            </CardContent>
          </Card>
        </section>

        <section aria-labelledby="method-heading">
          <h2 id="method-heading" className="text-2xl font-bold">
            Bereiding
          </h2>
          <ol className="mt-5 space-y-6">
            {recipe.approachSteps.map((step, index) => (
              <li key={step.id} className="flex gap-4">
                <span
                  aria-hidden
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground"
                >
                  {index + 1}
                </span>
                <p className="pt-1 leading-relaxed">{step.content}</p>
              </li>
            ))}
          </ol>

          {recipe.tips && (
            <Card className="mt-10 bg-muted/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Tips van {recipe.author.username}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed">{recipe.tips}</p>
              </CardContent>
            </Card>
          )}

          {recipe.sourceUrl && (
            <p className="mt-6 text-sm text-muted-foreground">
              Bron:{" "}
              <a
                href={recipe.sourceUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="underline underline-offset-2"
              >
                {recipe.sourceUrl}
              </a>
            </p>
          )}
        </section>
      </div>
    </article>
  );
}
