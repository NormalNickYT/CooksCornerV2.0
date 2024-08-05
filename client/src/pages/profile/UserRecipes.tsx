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
import { Link } from "react-router-dom";
import { DashHeader } from "../../components/profile/DashHeader";
import { getUserRecipes } from "@/services/api/recipeService";
import { useEffect, useState } from "react";
import UserRecipesList from "@/components/profile/UserRecipeList";
import { DisplayManualRecipe } from "@/types/displayTypes";

export const UserRecipes = () => {
  const [resultArray, setResultArray] = useState<DisplayManualRecipe[]>([]);

  const handleManualSubmit = async () => {
    try {
      const result = await getUserRecipes();
      setResultArray(result);

      console.log(result);
    } catch (error) {
      console.error("Error creating recipe:", error);
    }
  };

  useEffect(() => {
    handleManualSubmit();
  }, []);

  return (
    <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 dark:bg-dark-background">
      <DashHeader />
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 ">
        <Tabs defaultValue="all">
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
          <TabsContent value="all">
            <Card x-chunk="dashboard-06-chunk-0">
              <CardHeader>
                <CardTitle>Recipes</CardTitle>
                <CardDescription>Manage your Recipes</CardDescription>
              </CardHeader>
              <CardContent>
                <UserRecipesList recipes={resultArray} />
              </CardContent>
              <CardFooter>
                <div className="text-xs text-muted-foreground">
                  Showing <strong>1-10</strong> of <strong>32</strong> products
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};
export default UserRecipes;
