// CardRecipeList.tsx

import { DisplayManualRecipe } from "../types/displayTypes";
import { Badge } from "./ui/badge";
import { CardContent, Card } from "@/components/ui/card";
import { MoreVertical, Timer } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";

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
        className="w-full h-80 object-cover"
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
            <DropdownMenuItem>Favorieten</DropdownMenuItem>
            <DropdownMenuItem>Toevoegen aan collectie</DropdownMenuItem>
            <DropdownMenuItem>Profiel maker</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="text-lg font-bold text-text dark:text-dark-text">
          {recipe.title}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {recipe.user.username}
        </p>
        <div className="flex flex-wrap gap-2 mt-2">
          {recipe.categories.length > 0 ? (
            recipe.categories.map((category) => (
              <Badge
                className="bg-dark-accent"
                variant="outline"
                key={category.id}
              >
                {category.title}
              </Badge>
            ))
          ) : (
            <div>Geen Recepten</div>
          )}
        </div>
        <div className="absolute bottom-4 right-4 flex items-center space-x-2">
          <Timer className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {recipe.preparationTime} min
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardRecipeList;
