import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { DashHeader } from "../../components/profile/DashHeader";
import RecipeForm from "@/components/forms/RecipeForm";

export function AddRecipes() {
  return (
    <div className="flex min-h-screen w-full sm:gap-4 sm:py-4 sm:pl-14 flex-col">
      <DashHeader />
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="h-7 w-7">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              Add Recipe
            </h1>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <Button variant="outline" size="sm">
                Discard
              </Button>
              <Button variant="outline" size="sm">
                Save Recipe
              </Button>
            </div>
          </div>
          <RecipeForm />
          <div className="flex items-center justify-center gap-2 md:hidden">
            <Button variant="outline" size="sm">
              Discard
            </Button>
            <Button variant="outline" size="sm">
              Save Product
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AddRecipes;
