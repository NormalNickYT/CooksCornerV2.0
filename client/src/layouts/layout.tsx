import { Footer } from "@/components/Footer";
import Navbar from "@/components/Navbar";

type Props = {
  children: React.ReactNode;
};

export const Layout = ({ children }: Props) => {
  return (
    <div className="flex flex-col min-h-screen dark:bg-dark-background">
      <Navbar />
      <main className="flex-1 w-full">{children}</main>
      {/* <Footer /> */}
    </div>
  );
};
