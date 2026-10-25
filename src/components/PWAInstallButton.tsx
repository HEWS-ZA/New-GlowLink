import { useState, useEffect } from "react";
import { Download, Share, X, Sparkles } from "lucide-react";
import { triggerHaptic } from "@/services/haptics";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    triggerHaptic(15);
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    }
  };

  if (isInstalled) return null;
  if (!deferredPrompt && !isIOS) return null;

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="inline-flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider bg-[#501854] dark:bg-[#DB2777] text-white hover:opacity-90 transition-all shadow-xs active:scale-95 shrink-0"
        title="Install GlowLink Atelier on your device"
      >
        <Download size={12} className="text-pink-200" />
        <span className="hidden xs:inline sm:inline">Install</span>
      </button>

      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#241C2B] rounded-3xl p-6 max-w-sm w-full border border-[#EFBDEB] dark:border-[#3B3237] shadow-2xl relative text-[#501854] dark:text-[#D4C7E1]">
            <button
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-[#8C3B8A] dark:text-[#A695B8] hover:text-[#DB2777] transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#501854] dark:bg-[#DB2777] flex items-center justify-center text-white">
                <Sparkles size={16} />
              </div>
              <h3 className="font-serif text-lg text-[#501854] dark:text-[#D4C7E1] font-medium">Install GlowLink</h3>
            </div>

            <p className="text-xs text-[#7E4882] dark:text-[#A695B8] font-light leading-relaxed mb-4">
              Install GlowLink on your iPhone or iPad for instant offline access and a native full-screen atelier experience.
            </p>

            <div className="bg-[#FAF2FA] dark:bg-[#372E3E] rounded-2xl p-4 space-y-3 border border-[#EFBDEB] dark:border-[#3B3237] text-xs text-[#501854] dark:text-[#D4C7E1]">
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#501854] dark:bg-[#DB2777] text-white flex items-center justify-center text-[10px] font-bold">1</span>
                <span>Tap the <strong className="font-semibold">Share</strong> icon <Share size={12} className="inline mx-1 text-[#DB2777]" /> in Safari</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#501854] dark:bg-[#DB2777] text-white flex items-center justify-center text-[10px] font-bold">2</span>
                <span>Select <strong className="font-semibold">Add to Home Screen</strong></span>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-5 w-full bg-[#501854] dark:bg-[#DB2777] text-white py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold hover:opacity-90 active:scale-95 transition-all"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
