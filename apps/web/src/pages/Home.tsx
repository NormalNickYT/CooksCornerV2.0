import { BannerSection } from "@/components/home/Banner";
import Hero from "@/components/home/Hero";
import { NieuwsGroepen } from "@/components/home/NieuwsGroepen";
import PopulaireRecepten from "@/components/home/PopulaireRecepten";
import RecenteRecepten from "@/components/home/RecenteRecepten";
import { useRecipeList } from "@/features/recipes/useRecipes";

export default function Home() {
  // Two distinct queries. The previous version fetched once and handed the
  // same array to both sections, so "Populair" and "Recent" always matched.
  const recent = useRecipeList({ limit: 4, sortBy: "createdAt", sortOrder: "desc" });
  const quickest = useRecipeList({ limit: 4, sortBy: "totalTime", sortOrder: "asc" });

  return (
    <div>
      <Hero />
      <section className="bg-light-background pb-20 dark:bg-dark-background">
        <PopulaireRecepten
          recipes={quickest.data?.items ?? []}
          isLoading={quickest.isLoading}
        />
        <NieuwsGroepen />
        <RecenteRecepten recipes={recent.data?.items ?? []} isLoading={recent.isLoading} />
        <BannerSection />
      </section>
    </div>
  );
}
