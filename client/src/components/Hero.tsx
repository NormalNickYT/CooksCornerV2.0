import { Button } from "@/components/ui/button"
import logo from '../assets/img/food.png';
import { Link } from "react-router-dom";

export const Hero = () => {
    return ( 
    <section className="mx-auto max-w-full pb-20 px-4 items-center lg:flex md:px-20 min-h-screen bg-light-background bg-dark-background">
        <div className="space-y-4 flex-1 sm:text-center lg:text-left">
            <h1 className="dark:text-dark-text text-4xl xl:text-4xl tracking-wide dark:text-text font-bold">
                 The Best Place For 
                 <span className="bg-gradient-to-r from-dark-accent to-dark-secondary bg-clip-text text-transparent"> WorldWide Recipes </span>
            </h1>
            <p className="dark:text-dark-text max-w-xl leading-relaxed sm:mx-auto lg:ml-0">
            Are you tired of the same old recipes and looking for some fresh inspiration in the kitchen? Look no further than CooksCorner, where you can browse and share an endless variety of mouth-watering recipes from around the world.
            </p>
            <div className = "space-x-4">
                <Button className = "w-24 bg-light-primary dark:bg-dark-primary transition duration-300 hover:-translate-y-0.5 "> 
                    <Link to={"/Login"}> Login </Link>
                </Button>
                <Button className = "w-42 bg-light-secondary30 dark:bg-dark-secondary30 dark:text-white transition duration-300 hover:-translate-y-0.5"> 
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