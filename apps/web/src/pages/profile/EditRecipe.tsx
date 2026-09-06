import { ChevronLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import SpinnerLoader from "@/components/SpinnerLoader";
import { Button } from "@/components/ui/button";
import { RecipeForm } from "@/features/recipes/components/RecipeForm";
import { useRecipe, useUpdateRecipe } from "@/features/recipes/useRecipes";
import { errorMessage } from "@/lib/api";

export default function EditRecipe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: recipe, isLoading, error } = useRecipe(id);
  const updateRecipe = useUpdateRecipe();

  if (isLoading) return <SpinnerLoader />;

  if (error || !recipe) {
    return (
      <div className="py-24 text-center">
        <h1 className="text-2xl font-bold">Recept niet gevonden</h1>
        <p className="mt-2 text-muted-foreground">{error ? errorMessage(error) : null}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-6 flex items-center gap-3">
        <Button asChild variant="outline" size="icon" className="h-8 w-8">
          <Link to={`/recipes/${recipe.slug}`} aria-label="Terug">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold tracking-tight">{recipe.title} bewerken</h1>
      </div>

      <RecipeForm
        recipe={recipe}
        submitLabel="Wijzigingen opslaan"
        onSubmit={async (input, image) => {
          const updated = await updateRecipe.mutateAsync({ id: recipe.id, input, image });
          toast.success("Wijzigingen opgeslagen");
          navigate(`/recipes/${updated.slug}`);
        }}
      />
    </div>
  );
}
