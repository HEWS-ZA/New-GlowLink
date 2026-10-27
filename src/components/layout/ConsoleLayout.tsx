import { Outlet } from "react-router-dom";
import { ConsoleHeader } from "./ConsoleHeader";
import { ConsoleBottomNav } from "./ConsoleBottomNav";
import ScrollToTop from "@/components/ScrollToTop";

interface ConsoleLayoutProps {
  children?: React.ReactNode;
}

export const ConsoleLayout = ({ children }: ConsoleLayoutProps) => {
  return (
    <div className="bg-white dark:bg-[#17111D] text-[#501854] dark:text-[#D4C7E1] min-h-screen selection:bg-[#DB2777] selection:text-white transition-colors duration-300 flex flex-col justify-between">
      <ScrollToTop />
      <ConsoleHeader />
      <main className="flex-grow">{children || <Outlet />}</main>
      <ConsoleBottomNav />
    </div>
  );
};
