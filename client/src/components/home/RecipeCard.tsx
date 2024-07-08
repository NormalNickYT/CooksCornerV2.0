import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import product from "../../assets/img/food.png";

export const Recipes = () => {
  return (
    <div className="container mx-auto my-10 flex justify-center">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        <div className="max-w-sm">
          <Card className="dark:bg-dark-text5 bg-light-primary20 max-w-sm rounded-lg overflow-hidden transition duration-300 hover:scale-105">
            <CardHeader className="relative flex items-center justify-center">
              <img
                src={product}
                alt="Product Image"
                className="object-cover w-100 h-60 bg-center"
              />
              <div className="absolute top-0 left-0 bg-gradient-to-r from-[#00DF9A] to-[#237d4a] p-2 text-white">
                New Post
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-4xl font-semibold mb-2">
                Taco's
              </CardTitle>
              <div className="flex mb-2 space-x-2">
                <Category>Lunch</Category>
                <Category>Dinner</Category>
              </div>
              <p className="dark:text-[#7E8C9A] mb-2 font-semibold">
                Nick Koster
              </p>
            </CardContent>
            <CardFooter className="p-4">
              <Button className="dark:bg-dark-accent bg-light-primary dark:text-white">
                Check Recipe
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

const Category = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="dark:bg-dark-secondary30 bg-light-secondary30 rounded-full px-4 py-1">
      {children}
    </div>
  );
};

export default Recipes;
