import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { DashSideBar } from "@/components/profile/DashSideBar";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export const DashBoardLayout = ({ children }: DashboardLayoutProps) => (
  <div className="flex min-h-screen dark:bg-dark-background">
    <DashSideBar />
    <div className="ml-0 flex flex-1 flex-col sm:ml-40">
      <Navbar />
      <main className="flex-1 p-4">{children ?? <Outlet />}</main>
    </div>
  </div>
);

export default DashBoardLayout;
