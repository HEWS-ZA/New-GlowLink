import { Toaster as Sonner, toast } from "sonner";
import { useTheme } from "@/context/ThemeContext";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme();

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast font-sans bg-white dark:bg-[#241C2B] text-[#501854] dark:text-[#D4C7E1] border border-[#EFBDEB] dark:border-[#3B3237] shadow-xl rounded-2xl p-4",
          description: "text-[#7E4882] dark:text-[#A695B8] text-xs",
          actionButton: "bg-[#501854] dark:bg-[#DB2777] text-white rounded-full px-3 py-1 text-xs",
          cancelButton: "bg-[#FAF2FA] dark:bg-[#372E3E] text-[#501854] dark:text-[#D4C7E1] rounded-full px-3 py-1 text-xs",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
