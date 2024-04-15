import {
    LineChart,
    Package,
    Home,
    Users2,
    Settings,
    LibraryBig,
    Star
  } from "lucide-react"

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
  } 
from "@/components/ui/tooltip"
import { Link, useLocation } from "react-router-dom"
import { SetStateAction, useEffect, useState } from "react";


export const DashSideBar = () => {
    // const { pathname } = useLocation();
    // const [activePath, setActivePath] = useState("");

    // useEffect(() => {
    //   setActivePath(pathname);
    // }, [pathname]);

    // const isActivePath = (targetPath: string) => {
    //   return activePath === targetPath;
    // };

    const location = useLocation();
    const [tab, setTab] = useState('');
    useEffect(() => {
      const urlParams = new URLSearchParams(location.search);
      const tabFromUrl = urlParams.get('tab');
      if (tabFromUrl) {
        setTab(tabFromUrl);
      }
    }, [location.search]);

    return (
        <aside className="fixed inset-y-30 left-0 z-10 hidden w-14 flex-col border-r sm:flex h-full ">
        <nav className="flex flex-col items-center gap-4 px- sm:py-5">
          <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                className={`flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8 ${tab === "dash" ? "" : "text-muted-foreground"}`}
                to="/dashboard?tab=dash"
                >
                <Home className="h-5 w-5" />
                <span className="sr-only">Dashboard</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Dashboard</TooltipContent>
          </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                className={`flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8 ${tab === "recipes" ? "" : "text-muted-foreground"}`}
                to="/dashboard?tab=recipes"
                >
                <LibraryBig className="h-5 w-5" />
                <span className="sr-only">Recipes</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Recipes</TooltipContent>
          </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                className={`flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8 ${tab === "favorites" ? "" : "text-muted-foreground"}`}
                to={"/dashboard?tab=favorites"}>
                <Star className="h-5 w-5" />
                <span className="sr-only">Favorites</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Favorites</TooltipContent>
          </Tooltip>
          </TooltipProvider>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        </nav>
      </aside>
    )
}
