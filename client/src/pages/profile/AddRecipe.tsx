import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { DashHeader } from "../../components/profile/DashHeader";
import RecipeForm from "@/components/forms/RecipeForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"
import { useState } from "react";

export function AddRecipes() {
  const [showAlert, setShowAlert] = useState(false);

  const handleRecipePosted = () => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000); 
  };
  
  const goPageBack = () => {
    history.back();
  };

  return (
    <div className="flex min-h-screen w-full sm:gap-4 sm:py-4 sm:pl-14 flex-col">
      <DashHeader />
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <div className="mx-auto w-[100%] grid flex-1 auto-rows-max gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="h-7 w-7">
              <ChevronLeft className="h-4 w-4" onClick={goPageBack} />
              <span className="sr-only">Back</span>
            </Button>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              Add Recipe
            </h1>
          </div>
          <RecipeForm onRecipePosted={handleRecipePosted} />
          {showAlert && (
          <div className="fixed bottom-4 right-4 z-50">
            <Alert className="bg-dark-primary">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>
              Your Recipe has been posted succesfully.
            </AlertDescription>
          </Alert>
        </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AddRecipes;
