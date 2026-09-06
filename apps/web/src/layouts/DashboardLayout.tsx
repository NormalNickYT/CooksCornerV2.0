import { Footer } from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { DashSideBar } from "@/components/profile/DashSideBar";

type Props = {
  children: React.ReactNode;
};

export const DashBoardLayout = ({ children }: Props) => {
  return (
    <div className="flex min-h-screen dark:bg-dark-background">
      <DashSideBar />
      <div className="flex-1 flex flex-col ml-0 sm:ml-40">
        <Navbar />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
};
