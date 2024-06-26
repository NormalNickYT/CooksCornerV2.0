import { DashAddRecipe } from "@/components/dashboard/DashAddRecipe";
import { DashComp } from "@/components/dashboard/DashComp";
import { DashRecipes } from "@/components/dashboard/DashRecipes";
import { DashSideBar } from "@/components/dashboard/DashSideBar";
import { Navigate, Routes } from "react-router-dom";
import { Route } from "react-router-dom";

export const Dashboard = () => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 dark:bg-dark-background">
      <DashSideBar />
      <Routes>
        <Route path="dash" element={<DashComp />} />
        <Route path="recipes" element={<DashRecipes />} />
        <Route path="addrecipe" element={<DashAddRecipe />} />
        <Route path="/" element={<Navigate to="dash" replace />} />
      </Routes>
    </div>
  );
};

export default Dashboard;
