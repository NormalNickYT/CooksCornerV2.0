import { ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RecipeForm } from "@/features/recipes/components/RecipeForm";
import { useCreateRecipe } from "@/features/recipes/useRecipes";

export default function AddRecipe() {
  const navigate = useNavigate();
  const createRecipe = useCreateRecipe();

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-6 flex items-center gap-3">
        <Button asChild variant="outline" size="icon" className="h-8 w-8">
          <Link to="/dashboard/user-recipes" aria-label="Terug">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold tracking-tight">Nieuw recept</h1>
      </div>

      <RecipeForm
        submitLabel="Recept opslaan"
        onSubmit={async (input, image) => {
          const recipe = await createRecipe.mutateAsync({ input, image });
          toast.success(`"${recipe.title}" is opgeslagen`);
          navigate(`/recipes/${recipe.slug}`);
        }}
      />
    </div>
  );
}
