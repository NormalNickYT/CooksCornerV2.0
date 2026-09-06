import { LayoutDashboard, ListPlus, LogOut, Menu, NotebookPen, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser, useLogout } from "@/features/auth/useAuth";
import { cn } from "@/lib/utils";
import Switcher from "./ui/switcher";

const NAV_ITEMS = [
  { to: "/", label: "Home", end: true },
  { to: "/recipes", label: "Recepten", end: false },
];

/** Initials for the avatar fallback, so it is never a generic placeholder. */
function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated } = useCurrentUser();
  const logout = useLogout();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout.mutateAsync();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="sticky top-0 z-50 border-b backdrop-blur-lg dark:bg-dark-background/90">
      <div className="mx-auto flex items-center justify-between px-4 md:px-20">
        <div className="flex items-center gap-10">
          <Link to="/" className="text-2xl font-bold dark:text-dark-text">
            CooksCorner
          </Link>

          <ul className="hidden items-center gap-8 font-semibold lg:flex">
            {NAV_ITEMS.map((item) => (
              <li key={item.to} className="py-4">
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn("text-lg dark:text-dark-text", isActive && "text-dark-accent")
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden items-center gap-4 font-semibold lg:flex">
          {isAuthenticated && user ? (
            <>
              <Button asChild size="sm" className="gap-1.5">
                <Link to="/dashboard/add-recipe">
                  <ListPlus className="h-4 w-4" />
                  Recept toevoegen
                </Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
                    <Avatar className="h-8 w-8">
                      {/* avatar is null for password accounts; AvatarImage
                          simply falls through to the initials. */}
                      {user.avatar && <AvatarImage src={user.avatar} referrerPolicy="no-referrer" />}
                      <AvatarFallback>{initials(user.name)}</AvatarFallback>
                    </Avatar>
                    <span className="sr-only">Accountmenu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel className="font-normal">
                    <span className="block font-medium">{user.name}</span>
                    <span className="block text-xs text-muted-foreground">{user.email}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/user-recipes">
                      <NotebookPen className="mr-2 h-4 w-4" />
                      Mijn recepten
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={handleLogout} disabled={logout.isPending}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Uitloggen
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button asChild variant="outline" size="sm">
                <Link to="/login">Inloggen</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/register">Account aanmaken</Link>
              </Button>
            </>
          )}
          <Switcher />
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Menu sluiten" : "Menu openen"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileOpen && (
        <div className="border-t px-4 py-6 lg:hidden dark:bg-dark-background">
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 text-lg dark:text-dark-text"
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Button asChild onClick={() => setMobileOpen(false)}>
                  <Link to="/dashboard/add-recipe">Recept toevoegen</Link>
                </Button>
                <Button asChild variant="outline" onClick={() => setMobileOpen(false)}>
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
                <Button variant="ghost" onClick={handleLogout} disabled={logout.isPending}>
                  Uitloggen
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="outline" onClick={() => setMobileOpen(false)}>
                  <Link to="/login">Inloggen</Link>
                </Button>
                <Button asChild onClick={() => setMobileOpen(false)}>
                  <Link to="/register">Account aanmaken</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
