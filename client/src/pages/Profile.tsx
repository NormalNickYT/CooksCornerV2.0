
import { Recipes } from "@/components/dashboard/Recipes"
import { SideBar } from "@/components/dashboard/SideBar"
import { Dashboard } from "@/components/dashboard/Main"

export const Profile = () => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 dark:bg-dark-background bg-light-background">
      <SideBar />
      <Dashboard />
    </div>
  )
}

export default Profile 