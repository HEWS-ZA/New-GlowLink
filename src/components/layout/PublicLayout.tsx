import { Outlet } from "react-router-dom";
import { PublicHeader } from "./PublicHeader";
import { PublicBottomNav } from "./PublicBottomNav";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

interface PublicLayoutProps {
  children?: React.ReactNode;
}

export const PublicLayout = ({ children }: PublicLayoutProps) => {
  return (
    <div className="bg-white dark:bg-[#17111D] text-[#501854] dark:text-[#D4C7E1] min-h-screen selection:bg-[#DB2777] selection:text-white transition-colors duration-300 flex flex-col justify-between">
      <ScrollToTop />
      <PublicHeader />
      <main className="flex-grow">{children || <Outlet />}</main>
      <Footer />
      <PublicBottomNav />
    </div>
  );
};
