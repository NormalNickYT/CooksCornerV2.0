import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SpinnerLoader from "@/components/SpinnerLoader";
import { badgeVariants } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RecipeCard } from "@/features/recipes/components/RecipeCard";
import { useCategories, useRecipeList } from "@/features/recipes/useRecipes";
import type { RecipeListParams } from "@/features/recipes/recipe.api";
import { errorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";

const SORT_OPTIONS: Array<{ value: string; label: string; params: Partial<RecipeListParams> }> = [
  { value: "newest", label: "Nieuwste eerst", params: { sortBy: "createdAt", sortOrder: "desc" } },
  { value: "title", label: "Op titel", params: { sortBy: "title", sortOrder: "asc" } },
  { value: "quickest", label: "Snelst klaar", params: { sortBy: "totalTime", sortOrder: "asc" } },
];

const TIME_OPTIONS = [
  { value: "all", label: "Maakt niet uit" },
  { value: "15", label: "Binnen 15 min" },
  { value: "30", label: "Binnen 30 min" },
  { value: "60", label: "Binnen een uur" },
];

const PAGE_SIZE = 12;

/**
 * Browse every published recipe.
 *
 * This page used to render a hardcoded mock ("Caprese Salad", "COUNT HERE")
 * and never called the API. Filters live in the URL, so a filtered view can
 * be bookmarked and shared.
 */
export default function Recipes() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchDraft, setSearchDraft] = useState(searchParams.get("search") ?? "");

  const category = searchParams.get("category") ?? "all";
  const sort = searchParams.get("sort") ?? "newest";
  const maxTime = searchParams.get("time") ?? "all";
  const page = Math.max(0, Number(searchParams.get("page") ?? 0));

  const params = useMemo<RecipeListParams>(() => {
    const sortParams = SORT_OPTIONS.find((option) => option.value === sort)?.params ?? {};
    return {
      ...sortParams,
      search: searchParams.get("search") || undefined,
      category: category === "all" ? undefined : category,
      maxTotalTime: maxTime === "all" ? undefined : Number(maxTime),
      limit: PAGE_SIZE,
      offset: page * PAGE_SIZE,
    };
  }, [searchParams, category, sort, maxTime, page]);

  const { data, isLoading, isFetching, error } = useRecipeList(params);
  const { data: categories } = useCategories();

  /** Any filter change resets to the first page. */
  const setFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value === "" || value === "all") next.delete(key);
    else next.set(key, value);
    next.delete("page");
    setSearchParams(next, { replace: true });
  };

  const goToPage = (nextPage: number) => {
    const next = new URLSearchParams(searchParams);
    if (nextPage <= 0) next.delete("page");
    else next.set("page", String(nextPage));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container mx-auto grid gap-8 px-4 py-10 md:grid-cols-[1fr_18rem] md:px-6">
      <div className="md:order-1">
        <form
          className="mb-6 flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            setFilter("search", searchDraft.trim());
          }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Label htmlFor="recipe-search" className="sr-only">
              Zoek een recept
            </Label>
            <Input
              id="recipe-search"
              value={searchDraft}
              onChange={(event) => setSearchDraft(event.target.value)}
              placeholder="Zoek op titel of beschrijving"
              className="pl-9"
            />
          </div>
          <Button type="submit">Zoeken</Button>
        </form>

        {isLoading ? (
          <SpinnerLoader />
        ) : error ? (
          <p className="rounded-md bg-destructive/10 p-4 text-destructive">
            {errorMessage(error, "Recepten laden is niet gelukt")}
          </p>
        ) : !data || data.items.length === 0 ? (
          <div className="rounded-lg border border-dashed py-20 text-center">
            <h2 className="text-lg font-semibold">Geen recepten gevonden</h2>
            <p className="mt-1 text-muted-foreground">Probeer een andere zoekterm of filter.</p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-muted-foreground">
              {data.total} {data.total === 1 ? "recept" : "recepten"} gevonden
            </p>

            <div
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
              aria-busy={isFetching}
            >
              {data.items.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>

            {(page > 0 || data.hasMore) && (
              <div className="mt-8 flex items-center justify-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 0 || isFetching}
                >
                  Vorige
                </Button>
                <span className="text-sm text-muted-foreground">Pagina {page + 1}</span>
                <Button
                  variant="outline"
                  onClick={() => goToPage(page + 1)}
                  disabled={!data.hasMore || isFetching}
                >
                  Volgende
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <aside className="space-y-4 md:order-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-2">
              <Label htmlFor="sort">Sorteren</Label>
              <Select value={sort} onValueChange={(value) => setFilter("sort", value)}>
                <SelectTrigger id="sort">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="time">Totale tijd</Label>
              <Select value={maxTime} onValueChange={(value) => setFilter("time", value)}>
                <SelectTrigger id="time">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIME_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <span className="text-sm font-medium">Categorie</span>
              <div className="flex flex-wrap gap-1.5">
                {/* Buttons rather than <Badge asChild>: a filter is an action,
                    and this keeps it keyboard-operable. */}
                <button
                  type="button"
                  onClick={() => setFilter("category", "all")}
                  className={cn(badgeVariants({ variant: category === "all" ? "default" : "outline" }))}
                  aria-pressed={category === "all"}
                >
                  Alles
                </button>
                {categories?.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFilter("category", item.slug)}
                    className={cn(badgeVariants({ variant: category === item.slug ? "default" : "outline" }))}
                    aria-pressed={category === item.slug}
                  >
                    {item.title} ({item.recipeCount})
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
