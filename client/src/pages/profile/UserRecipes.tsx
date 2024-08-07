import { ListFilter, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "react-router-dom";
import { DashHeader } from "../../components/profile/DashHeader";
import { deleteRecipe } from "@/services/api/recipeService";
import UserRecipesList from "@/components/profile/UserRecipeList";
import CookingWoman from "../../assets/img/cooking-woman.png";
import { useRecipes } from "@/context/RecipeProvider";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export const UserRecipes = () => {
  const { recipes, fetchRecipes } = useRecipes();
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [deletedRecipeTitle, setDeletedRecipeTitle] = useState<string | null>(null);

  const handleDeleteRecipe = async (recipeId: string) => {
    try {
      const recipe = recipes.find(r => r.id === recipeId);
      await deleteRecipe(recipeId);
      fetchRecipes();

      // TODO: We use this alert multiple times maybe make this a specific component
      setShowAlert(true);
      setDeletedRecipeTitle(recipe?.title || "");
      setTimeout(() => setShowAlert(false), 3000);
      } catch (error) {
        console.error("Error deleting recipe:", error);
      }
  };

  const handleNavigateAddRecipe = () => {
    navigate('/dashboard/add-recipe');
  };

  return (
    <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 dark:bg-dark-background">
      <DashHeader />
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 ">
        <Tabs defaultValue="all">
         {recipes.length > 0 &&  (
          <div className="flex items-center">
            <TabsList className="dark:bg-dark-text5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
              <TabsTrigger value="archived" className="hidden sm:flex">
                Archived
              </TabsTrigger>
            </TabsList>
            <div className="ml-auto flex items-center gap-2 ">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <ListFilter className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Filter
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem checked>
                    Active
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <Link to="/dashboard/add-recipe">
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Recipe
                  </span>
                </Link>
              </Button>
            </div>
          </div>
         )}
          <TabsContent value="all">
            <Card x-chunk="dashboard-06-chunk-0">
            {recipes.length > 0 &&  (
          <CardHeader>
           <CardTitle className="font-bold">Recepten</CardTitle>
           <CardDescription>Beheer je recepten</CardDescription>
          </CardHeader>
        )}
              <CardContent>
              <div className="w-full items-center justify-center flex py-16 flex-col space-y-10">
              {recipes.length === 0 ? (
                <div className="text-center">
                  <h2 className="text-lg font-bold">Je hebt nog geen recepten</h2>
                  <p className="text-sm text-muted-foreground">Voeg een recept toe</p>
                  <img src={CookingWoman} className="max-w-sm max-h-80 mx-auto object-contain" alt="Food Logo" />
                  <Button
                  type="submit"
                  onClick={handleNavigateAddRecipe}
                  className="bg-dark-primary text-lg font-bold text-white my-5">
                  Voeg Recept Toe
                </Button>
                </div>
              ) : (
                <UserRecipesList recipes={recipes} onDelete={handleDeleteRecipe} />
              )}
              </div>
              {showAlert && (
                <div className="fixed bottom-4 right-4 z-50">
                  <Alert className="bg-dark-primary">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Success!</AlertTitle>
                    <AlertDescription>
                     {deletedRecipeTitle} deleted
                    </AlertDescription>
                  </Alert>
                </div>
              )}
              </CardContent>
              <CardFooter>
              {recipes.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  Showing <strong>1-10</strong> of <strong>{recipes.length}</strong> products
                </div>
              )}
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};
export default UserRecipes;
