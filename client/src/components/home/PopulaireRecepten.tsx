import { DisplayManualRecipe } from "../../types/displayTypes";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import CardRecipeList from "../CardRecipeList";

interface PopulaireReceptenProps {
  recipes: DisplayManualRecipe[];
}

const PopulaireRecepten = ({ recipes }: PopulaireReceptenProps) => {
  return (
    <div className="menu-tab pb-10 ">
      <div className="px-4 lg:px-20">
        <div className="flex items-center justify-between mb-6">
          <div className="text-3xl font-semibold text-center text-text dark:text-dark-text">
            Populaire Recepten
          </div>
          <Button className="dark:bg-dark-primary bg-light-primary font-bold text-white dark:text-dark-text px-4 py-2 transition duration-300 hover:scale-105 hover:shadow-lg hover:-translate-y-0.5">
            <Link to="/Login">Alle Recepten</Link>
          </Button>
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

export default PopulaireRecepten;
