import Hero from "@/components/Hero";
import MenuTab from "@/components/MenuTab";
import RecipeCard from "@/components/RecipeCard";

export const Home = () => {
  return (
    <div>
      <Hero />
      <section className="bg-light-background dark:bg-dark-background pb-20">
        <MenuTab />
        <RecipeCard />
      </section>
    </div>
  );
};
export default Home;
