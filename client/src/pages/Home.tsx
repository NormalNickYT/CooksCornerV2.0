import Hero from "@/components/Hero"
import MenuHeading from "@/components/MenuHeading"
import MenuTab from "@/components/MenuTab"
import RecipeCard from "@/components/RecipeCard"

export const Home = () => {
    return (
        <div> 
            <Hero />
            <section className = "bg-background pb-20">
                <MenuTab />
                <RecipeCard />
            </section>
        </div>
    )
}
export default Home