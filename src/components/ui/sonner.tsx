import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast font-sans bg-white text-neutral-900 border border-neutral-200 shadow-xl rounded-2xl p-4",
          description: "text-neutral-500 text-xs",
          actionButton: "bg-neutral-900 text-white rounded-full px-3 py-1 text-xs",
          cancelButton: "bg-neutral-100 text-neutral-700 rounded-full px-3 py-1 text-xs",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
