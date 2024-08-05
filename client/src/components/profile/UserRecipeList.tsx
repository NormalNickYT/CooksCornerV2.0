import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { DisplayManualRecipe } from "@/types/displayTypes";
import { deleteRecipe } from "@/services/api/recipeService";

interface UserRecipesListProps {
  recipes: DisplayManualRecipe[];
  onDelete: (recipeId: string) => void;
}

const UserRecipesList = ({ recipes, onDelete }: UserRecipesListProps) => {
  const handleClickDeleteRecipe = (recipeId: string) => (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    onDelete(recipeId);
  };

  const getStatusStyles = (status : string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500 text-white';
      case 'archived':
        return 'bg-gray-500 text-white';
      case 'draft':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-gray-200 text-black';
    }
  };

  return (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead className="hidden w-[100px] sm:table-cell">
          <span className="sr-only">Image</span>
        </TableHead>
        <TableHead>Name</TableHead>
        <TableHead>Status</TableHead>
        <TableHead className="hidden md:table-cell">Categories</TableHead>
        <TableHead className="hidden md:table-cell">Created at</TableHead>
        <TableHead>
          <span className="sr-only">Actions</span>
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {recipes.map((recipe) => (
        <TableRow key={recipe.title}>
          <TableCell className="hidden sm:table-cell">
            <img
              className="aspect-square rounded-md object-cover"
              height="64"
              width="64"
              src={recipe.image}
            />
          </TableCell>
          <TableCell className="font-medium">{recipe.title}</TableCell>
          <TableCell>
          <Badge className={getStatusStyles(recipe.status)} variant="outline">
            {recipe.status}
          </Badge>
          </TableCell>
          <TableCell className="hidden md:table-cell">
            {recipe.categories.length > 0 ? (
              recipe.categories.map((category) => (
                <Badge className="bg-dark-accent" variant="outline" key = {category.id} >{category.title}</Badge>
              ))
            ) : (
              <div>Geen Categorieen</div>
            )}
          </TableCell>
          <TableCell>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button aria-haspopup="true" size="icon" variant="ghost">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={handleClickDeleteRecipe(recipe.id)}>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
)};

export default UserRecipesList;
