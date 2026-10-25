import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = "", showLabel = false }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      title={`Switch to ${isDark ? "Light" : "Dark"} theme`}
      className={`relative inline-flex items-center justify-center gap-2 rounded-full p-2 transition-all duration-300 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DB2777] ${
        isDark
          ? "bg-[#372E3E] text-[#D4C7E1] hover:bg-[#3E343C] border border-[#3B3237]"
          : "bg-[#FAF2FA] text-[#501854] hover:bg-[#F3E2F2] border border-[#EFBDEB]"
      } ${className}`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {/* Sun Icon */}
        <Sun
          className={`w-4 h-4 absolute transition-all duration-300 transform ${
            isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100 text-[#DB2777]"
          }`}
        />
        {/* Moon Icon */}
        <Moon
          className={`w-4 h-4 absolute transition-all duration-300 transform ${
            isDark ? "rotate-0 scale-100 opacity-100 text-[#DB2777]" : "-rotate-90 scale-0 opacity-0"
          }`}
        />
      </div>

      {showLabel && (
        <span className="text-xs font-medium uppercase tracking-wider select-none pr-1">
          {isDark ? "Dark" : "Light"}
        </span>
      )}
    </button>
  );
};
