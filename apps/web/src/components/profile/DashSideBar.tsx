import { Home, LibraryBig, Star } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

export const DashSideBar = () => {
  const location = useLocation();

  useEffect(() => {
    console.log(location.pathname);
  }, [location.pathname]);

  return (
    <>
      <aside className="fixed left-0 w-40 hidden flex-col border-r h-full bg-white dark:bg-dark-background sm:flex">
        <nav className="flex flex-col py-5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  className={`flex items-center p-3 rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground ${
                    location.pathname === "/dashboard"
                      ? ""
                      : "text-muted-foreground"
                  }`}
                  to="/dashboard"
                >
                  <Home className="h-5 w-5" />
                  <span className="ml-3 text-md">Dashboard</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Dashboard</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  className={`flex items-center p-3 rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground ${
                    location.pathname === "/dashboard/user-recipes"
                      ? ""
                      : "text-muted-foreground"
                  }`}
                  to="/dashboard/user-recipes"
                >
                  <LibraryBig className="h-5 w-5" />
                  <span className="ml-3 text-md">Recipes</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Recipes</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  className={`flex items-center p-3 rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground ${
                    location.pathname === "/dashboard/favorites"
                      ? ""
                      : "text-muted-foreground"
                  }`}
                  to="/dashboard/favorites"
                >
                  <Star className="h-5 w-5" />
                  <span className="ml-3 text-md">Favorites</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Favorites</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5"></nav>
      </aside>
    </>
  );
};
