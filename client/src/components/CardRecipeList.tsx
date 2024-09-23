import { DisplayManualRecipe } from "../types/displayTypes";
import { Badge } from "./ui/badge";
import { CardContent, Card } from "@/components/ui/card";
import { MoreVertical, Timer, Plus, Star, CircleUser} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import {Utensils} from "lucide-react";

interface CardRecipeListProps {
  recipe: DisplayManualRecipe;
}

const CardRecipeList = ({ recipe }: CardRecipeListProps) => {
  return (
    <Card
      key={recipe.id}
      className="flex flex-col transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:bg-gray-100 dark:hover:bg-dark-secondary"
    >
      <img
        src={recipe.image}
        alt={recipe.title}
        className="w-full h-40 object-cover"
      />
      <CardContent className="relative p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className="absolute top-2 right-2 h-8 w-8"
            >
              <MoreVertical className="h-3.5 w-3.5" />
              <span className="sr-only">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Star className=" h-4 text-gray-600 dark:text-gray-400" />
            Favorieten
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Plus className=" h-4 text-gray-600 dark:text-gray-400" />
            Toevoegen aan collectie
            </DropdownMenuItem>
            <DropdownMenuItem>
             <CircleUser className=" h-4 text-gray-600 dark:text-gray-400" />
              Profiel maker
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="text-lg font-bold text-text dark:text-dark-text">
          {recipe.title}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {recipe.user.username}
        </p>
        <div className="flex flex-wrap gap-2 mt-2 mb-6">
          {recipe.categories.length > 0 ? (
            recipe.categories.map((categoryObj) => (
              <Badge
                className="bg-dark-primary text-white"
                variant="outline"
                key={categoryObj.category.id}
              >
                {categoryObj.category.title}
              </Badge>
            ))
          ) : (
            <div>Geen Recepten</div>
          )}
        </div>
        <div className="right-4 flex items-center space-x-2">
          <Timer className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {recipe.totalTime} min (total time)
            
          </p> 
        </div>
        <div className="right-4 flex items-center space-x-2">
        <Utensils className="h-6 w-6 text-gray-600 dark:text-gray-400" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
            {recipe.servings} servings
          </p> 
        </div> 
      </CardContent>
    </Card>
  );
};

export default CardRecipeList;
