import { BannerSection } from "@/components/home/Banner";
import Hero from "@/components/home/Hero";
import { NieuwsGroepen } from "@/components/home/NieuwsGroepen";
import PopulaireRecepten from "@/components/home/PopulaireRecepten";
import RecenteRecepten from "@/components/home/RecenteRecepten";
import { useRecipes } from "@/context/RecipeProvider";
import { getRecentRecipes } from "@/services/api/recipeService";
import { useEffect, useState } from "react";

export const Home = () => {
  // Here we need the most populair recipes
  const [recentRecipes, setRecentRecipes] = useState([]);

  // TODO: Loading Component
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentRecipes = async () => {
      try {
        const recipes = await getRecentRecipes(4);
        setRecentRecipes(recipes);
      } catch (error) {
        console.error("Error fetching recent recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentRecipes();
  }, []);

  return (
    <div>
      <Hero />
      <section className="bg-light-background dark:bg-dark-background pb-20">
        <PopulaireRecepten recipes={recentRecipes} />
        <NieuwsGroepen />
        <RecenteRecepten recipes={recentRecipes} />
        <BannerSection />
      </section>
    </div>
  );
};
export default Home;
