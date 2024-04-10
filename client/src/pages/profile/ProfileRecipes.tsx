
import { Recipes } from "@/components/dashboard/Recipes"
import { SideBar } from "@/components/dashboard/SideBar"
import { Dashboard } from "@/components/dashboard/Main"

export const ProfileRecipes = () => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 dark:bg-dark-background bg-light-background">
      <SideBar />
      <Recipes />
    </div>
  )
}

export default ProfileRecipes 