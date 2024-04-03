import { Button } from "@/components/ui/button"
import logo from '../assets/img/food.png';
import { Link } from "react-router-dom";

export const Hero = () => {
    return ( 
    <section className="mx-auto max-w-full pb-20 px-4 items-center lg:flex md:px-20 min-h-screen dark:bg-background">
        <div className="space-y-4 flex-1 sm:text-center lg:text-left">
            <h1 className="text-text font-bold text-4xl xl:text-5xl dark:text-text">
                 The Best Place For 
                 <span className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent font-bold"> WorldWide Recipes </span>
            </h1>
            <p className="text-text max-w-xl leading-relaxed sm:mx-auto lg:ml-0">
            Are you tired of the same old recipes and looking for some fresh inspiration in the kitchen? Look no further than CooksCorner, where you can browse and share an endless variety of mouth-watering recipes from around the world.
            </p>
            <div className = "space-x-4">
                <Button className = "w-24 dark:bg-primary transition duration-300 hover:-translate-y-0.5 "> 
                    <Link to={"/Login"}> Login </Link>
                </Button>
                <Button className = "w-42 dark:bg-secondary30 text-white transition duration-300 hover:-translate-y-0.5"> 
                    <Link to={"/Login"}> Recent Recipes </Link>
                </Button>
            </div>
        </div>
        <div className="flex-1 text-center lg:mt-0 lg:ml-2 ">
            <img src={logo} className="h-auto" alt="Food Logo" />
        </div>
    </section>
      )
}
export default Hero