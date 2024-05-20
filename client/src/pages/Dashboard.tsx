import { DashAddRecipe } from "@/components/dashboard/DashAddRecipe";
import { DashComp } from "@/components/dashboard/DashComp";
import { DashRecipes } from "@/components/dashboard/DashRecipes"
import { DashSideBar } from "@/components/dashboard/DashSideBar"
import { useEffect, useState } from "react";
import { useLocation} from "react-router-dom";

export const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 dark:bg-dark-background bg-light-background">
      <DashSideBar />
        {tab === 'dash' && <DashComp />}
        {tab === 'recipes' && <DashRecipes />}
        {tab === 'addrecipe' && <DashAddRecipe />}
    </div>
  )
}

export default Dashboard 