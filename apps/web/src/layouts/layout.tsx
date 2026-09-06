import { Outlet } from "react-router-dom";
import { Footer } from "@/components/Footer";
import Navbar from "@/components/Navbar";

interface LayoutProps {
  /** Optional: routes render through <Outlet />, one-offs can pass children. */
  children?: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => (
  <div className="flex min-h-screen flex-col dark:bg-dark-background">
    <Navbar />
    <main className="w-full flex-1">{children ?? <Outlet />}</main>
    <Footer />
  </div>
);

export default Layout;
