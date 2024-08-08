import { DisplayManualRecipe } from "../../types/displayTypes";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { CardContent, Card } from "@/components/ui/card";
import { MoreVertical, Timer } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CardRecipeList from "../CardRecipeList";

interface PopulaireReceptenProps {
  recipes: DisplayManualRecipe[];
}

const RecenteRecepten = ({ recipes }: PopulaireReceptenProps) => {
  return (
    <div className="menu-tab pb-10 ">
      <div className="px-4 lg:px-20">
        <div className="flex items-center justify-between mb-6">
          <div className="text-3xl font-semibold text-center text-text dark:text-dark-text">
            Recente Recepten
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
          {recipes.map((recipe) => (
            <CardRecipeList key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecenteRecepten;
