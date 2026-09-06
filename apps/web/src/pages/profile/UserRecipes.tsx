import { Plus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import SpinnerLoader from "@/components/SpinnerLoader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecipeCard } from "@/features/recipes/components/RecipeCard";
import { useMyRecipes } from "@/features/recipes/useRecipes";
import { errorMessage } from "@/lib/api";
import CookingWoman from "@/assets/img/cooking-woman.png";

const TABS = [
  { value: "all", label: "Alles" },
  { value: "active", label: "Gepubliceerd" },
  { value: "draft", label: "Concept" },
  { value: "archived", label: "Archief" },
] as const;

export default function UserRecipes() {
  const [tab, setTab] = useState<string>("all");
  const { data, isLoading, error } = useMyRecipes({ limit: 50 });

  if (isLoading) return <SpinnerLoader />;

  if (error) {
    return (
      <p className="rounded-md bg-destructive/10 p-4 text-destructive">
        {errorMessage(error, "Je recepten laden is niet gelukt")}
      </p>
    );
  }

  const all = data?.items ?? [];

  if (all.length === 0) {
    return (
      <Card className="mx-auto max-w-xl">
        <CardHeader className="text-center">
          <CardTitle>Je hebt nog geen recepten</CardTitle>
          <CardDescription>Voeg je eerste recept toe.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <img src={CookingWoman} alt="" className="max-h-64 object-contain" />
          <Button asChild size="lg">
            <Link to="/dashboard/add-recipe">Recept toevoegen</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Mijn recepten</h1>
        <Button asChild className="gap-1.5">
          <Link to="/dashboard/add-recipe">
            <Plus className="h-4 w-4" />
            Recept toevoegen
          </Link>
        </Button>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          {TABS.map((item) => (
            <TabsTrigger key={item.value} value={item.value}>
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {TABS.map((item) => {
          const visible = item.value === "all" ? all : all.filter((r) => r.status === item.value);
          return (
            <TabsContent key={item.value} value={item.value} className="mt-6">
              {visible.length === 0 ? (
                <p className="py-12 text-center text-muted-foreground">Niets in deze categorie.</p>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {visible.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))}
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
