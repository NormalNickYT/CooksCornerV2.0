import Hero from "@/components/home/Hero";
import MenuTab from "@/components/home/MenuTab";
import RecipeCard from "@/components/home/RecipeCard";

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
