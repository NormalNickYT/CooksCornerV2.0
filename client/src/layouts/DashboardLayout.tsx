import { DashSideBar } from "@/components/profile/DashSideBar";

type Props = {
  children: React.ReactNode;
};

export const DashBoardLayout = ({ children }: Props) => {
  return (
    <div className="flex min-h-screen w-full flex-col dark:bg-dark-background">
      <DashSideBar />
      <div className="w-full">{children}</div>
    </div>
  );
};
