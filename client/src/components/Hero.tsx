import { Button } from "@/components/ui/button"
import logo from '../assets/img/food.png';

export const Hero = () => {
    return ( 
    <section className="mt-10 mx-auto max-w-full pb-4 px-4 items-center lg:flex md:px-20">
        <div className="space-y-4 flex-1 sm:text-center lg:text-left">
            <h1 className="text-gray-800 font-bold text-4xl xl:text-5xl">
                 The Best Place For 
                 <span className="text-[#00df9a]"> WorldWide Recipes </span>
            </h1>
            <p className="text-gray-500 max-w-xl leading-relaxed sm:mx-auto lg:ml-0">
                 The ultimate destinations for <span className="text-[#00df9a] font-bold"> Foodies and Home Cooks </span> 
            </p>
            <p className="text-gray-500 max-w-xl leading-relaxed sm:mx-auto lg:ml-0">
            Are you tired of the same old recipes and looking for some fresh inspiration in the kitchen? Look no further than CooksCorner, where you can browse and share an endless variety of mouth-watering recipes from around the world.
            </p>
            <div>
                <Button> 
                    Login
                </Button>
            </div>
        </div>
        <div className="flex-1 text-center lg:mt-0 lg:ml-3">
            <img src={logo}/>
        </div>
    </section>
      )
}

export default Hero