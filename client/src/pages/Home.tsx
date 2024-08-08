import { BannerSection } from "@/components/home/Banner";
import Hero from "@/components/home/Hero";
import { NieuwsGroepen } from "@/components/home/NieuwsGroepen";
import PopulaireRecepten from "@/components/home/PopulaireRecepten";
import RecenteRecepten from "@/components/home/RecenteRecepten";
import { useRecipes } from "@/context/RecipeProvider";
import { useEffect } from "react";

export const Home = () => {
  const { recipes, fetchAllUsersRecipes } = useRecipes();

  useEffect(() => {
    fetchAllUsersRecipes();
  }, []);

  return (
    <div>
      <Hero />
      <section className="bg-light-background dark:bg-dark-background pb-20">
        <PopulaireRecepten recipes={recipes} />
        <NieuwsGroepen />
        <RecenteRecepten recipes={recipes} />
        <BannerSection />
      </section>
    </div>
  );
};
export default Home;
