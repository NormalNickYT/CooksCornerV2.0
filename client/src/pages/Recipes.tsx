
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { SVGProps, useEffect, useState } from "react"
import { JSX } from "react/jsx-runtime"
import { BannerRecipe } from "@/components/home/BannerRecipe"
import { getRecentRecipes } from "@/services/api/recipeService"
import RecenteRecepten from "@/components/home/RecenteRecepten"

export const Recipes = () => {

  const [recentRecipes, setRecentRecipes] = useState([]);
  // TODO: Loading Component
  const [loading, setLoading] = useState(true);
  const limit = 4;

  useEffect(() => {
    const fetchRecentRecipes = async () => {
      try {
        const recipes = await getRecentRecipes(limit);
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
    <BannerRecipe />
    <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8 my-10">
      <div>
        <Tabs defaultValue="starters">
          <TabsList className="flex gap-4 mb-4">
            <TabsTrigger value="starters">Starters</TabsTrigger>
            <TabsTrigger value="dinner">Dinner</TabsTrigger>
            <TabsTrigger value="dessert">Dessert</TabsTrigger>
            <TabsTrigger value="snacks">Snacks</TabsTrigger>
          </TabsList>
          <TabsContent value="starters">
            <p className="text-muted-foreground mb-4">You have 23 recipes to explore</p>
            <RecenteRecepten recipes={recentRecipes} />
           {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
             <Card>
                <img
                  src="/placeholder.svg"
                  alt="Recipe 1"
                  width={300}
                  height={200}
                  className="rounded-t-lg object-cover w-full h-48"
                  style={{ aspectRatio: "300/200", objectFit: "cover" }}
                />
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-2">Caprese Salad</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ClockIcon className="w-4 h-4" />
                    <span>15 min</span>
                    <UserIcon className="w-4 h-4" />
                    <span>2 servings</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <img
                  src="/placeholder.svg"
                  alt="Recipe 2"
                  width={300}
                  height={200}
                  className="rounded-t-lg object-cover w-full h-48"
                  style={{ aspectRatio: "300/200", objectFit: "cover" }}
                />
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-2">Grilled Salmon</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ClockIcon className="w-4 h-4" />
                    <span>30 min</span>
                    <UserIcon className="w-4 h-4" />
                    <span>4 servings</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <img
                  src="/placeholder.svg"
                  alt="Recipe 3"
                  width={300}
                  height={200}
                  className="rounded-t-lg object-cover w-full h-48"
                  style={{ aspectRatio: "300/200", objectFit: "cover" }}
                />
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-2">Chocolate Mousse</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ClockIcon className="w-4 h-4" />
                    <span>45 min</span>
                    <UserIcon className="w-4 h-4" />
                    <span>6 servings</span>
                  </div>
                </CardContent>
              </Card>
            </div> */}
          </TabsContent>
          <TabsContent value="dinner">
            <p className="text-muted-foreground mb-4">You have 18 recipes to explore</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6" />
          </TabsContent>
          <TabsContent value="dessert">
            <p className="text-muted-foreground mb-4">You have 12 recipes to explore</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6" />
          </TabsContent>
          <TabsContent value="snacks">
            <p className="text-muted-foreground mb-4">You have 8 recipes to explore</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6" />
          </TabsContent>
        </Tabs>
      </div>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="categories" className="mb-2">
                Categories
              </Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    Select categories
                    <ChevronDownIcon className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-full">
                  <DropdownMenuCheckboxItem>Starters</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Dinner</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Dessert</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Snacks</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div>
              <Label htmlFor="prep-time" className="mb-2">
                Prep Time
              </Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    Select prep time
                    <ChevronDownIcon className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-full">
                  <DropdownMenuCheckboxItem>Less than 15 min</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Less than 30 min</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Less than 45 min</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div>
              <Label htmlFor="total-time" className="mb-2">
                Total Time
              </Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    Select total time
                    <ChevronDownIcon className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-full">
                  <DropdownMenuCheckboxItem>Less than 15 min</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Less than 30 min</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Less than 45 min</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div>
              <Label htmlFor="servings" className="mb-2">
                Servings
              </Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    Select servings
                    <ChevronDownIcon className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-full">
                  <DropdownMenuCheckboxItem>1</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>2</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>3</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>4</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>6</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sort By</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  Newest
                  <ChevronDownIcon className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-full">
                <DropdownMenuRadioGroup value="newest">
                  <DropdownMenuRadioItem value="newest">Newest</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="total-time">Total Time (Shortest)</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="prep-time">Prep Time (Shortest)</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
  )
}

function ChevronDownIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}


function ClockIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}


function UserIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}