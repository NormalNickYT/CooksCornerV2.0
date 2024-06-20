import { DashRecipes } from "@/components/dashboard/DashRecipes";
import { DashSideBar } from "@/components/dashboard/DashSideBar";

export const ProfileRecipes = () => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 dark:bg-dark-background bg-light-background">
      <DashSideBar />
      <DashRecipes />
    </div>
  );
};

export default ProfileRecipes;
