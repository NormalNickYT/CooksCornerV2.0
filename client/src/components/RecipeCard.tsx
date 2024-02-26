import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Button } from "./ui/button"
import { Link } from "react-router-dom"
import product from '../assets/img/food.png';
import MenuTab from "./MenuTab";

export const Recipes = () => {
    return (
     <div className="container mx-auto my-10">
        <Card className="bg-[#1E262F] max-w-sm rounded-lg overflow-hidden transition duration-300 hover:scale-105">
            <CardHeader className="relative">
            <img
                src= {product}
                alt="Product Image"
                className="object-cover h-100 bg-center"
            />
            <div className="absolute top-0 left-0 bg-gradient-to-r from-[#00DF9A] to-[#237d4a] p-2 text-white">
                New Post
            </div>
            </CardHeader>
            <CardContent className="p-4">
            <CardTitle className="text-5xl font-semibold mb-2 font-bold">Taco's</CardTitle>
            <p className="text-[#7E8C9A] mb-2 font-semibold	">Nick Koster</p>
            </CardContent>
            <CardFooter className="p-4 bg-[#1E262F]">
            <Button className = "bg-[#2B4555] text-white"> 
                Check Recipe 
            </Button>
            </CardFooter>
        </Card>
    </div>
    )
}

export default Recipes