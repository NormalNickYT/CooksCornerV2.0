import { ChefHat, Clock, NotebookPen, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import SpinnerLoader from "@/components/SpinnerLoader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrentUser } from "@/features/auth/useAuth";
import { RecipeCard } from "@/features/recipes/components/RecipeCard";
import { useMyRecipes } from "@/features/recipes/useRecipes";

export default function Dashboard() {
  const { user } = useCurrentUser();
  const { data, isLoading } = useMyRecipes({ limit: 6 });

  // No early return before the hooks above: the previous version returned
  // "Loading..." ahead of its useEffect, which changes the hook order between
  // renders and React refuses to run it.
  if (isLoading || !user) return <SpinnerLoader />;

  const recipes = data?.items ?? [];
  const published = recipes.filter((recipe) => recipe.status === "active").length;
  const drafts = recipes.filter((recipe) => recipe.status === "draft").length;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Hoi {user.name}</h1>
          <p className="text-muted-foreground">Hier staan je recepten.</p>
        </div>
        <Button asChild className="gap-1.5">
          <Link to="/dashboard/add-recipe">
            <Plus className="h-4 w-4" />
            Recept toevoegen
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={NotebookPen} label="Totaal" value={data?.total ?? 0} />
        <StatCard icon={ChefHat} label="Gepubliceerd" value={published} />
        <StatCard icon={Clock} label="Concepten" value={drafts} />
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent</h2>
          <Button asChild variant="ghost" size="sm">
            <Link to="/dashboard/user-recipes">Bekijk alles</Link>
          </Button>
        </div>

        {recipes.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Nog geen recepten</CardTitle>
              <CardDescription>Voeg je eerste recept toe om te beginnen.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link to="/dashboard/add-recipe">Recept toevoegen</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}

function StatCard({ icon: Icon, label, value }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <Icon className="h-8 w-8 text-muted-foreground" />
        <div>
          <p className="text-2xl font-bold tabular-nums">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
