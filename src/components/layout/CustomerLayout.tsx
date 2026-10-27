import { Outlet } from "react-router-dom";
import { CustomerHeader } from "./CustomerHeader";
import { CustomerBottomNav } from "./CustomerBottomNav";
import ScrollToTop from "@/components/ScrollToTop";

interface CustomerLayoutProps {
  children?: React.ReactNode;
}

export const CustomerLayout = ({ children }: CustomerLayoutProps) => {
  return (
    <div className="bg-white dark:bg-[#17111D] text-[#501854] dark:text-[#D4C7E1] min-h-screen selection:bg-[#DB2777] selection:text-white transition-colors duration-300 flex flex-col justify-between">
      <ScrollToTop />
      <CustomerHeader />
      <main className="flex-grow pt-20 sm:pt-24 pb-20 md:pb-12">{children || <Outlet />}</main>
      <CustomerBottomNav />
    </div>
  );
};
