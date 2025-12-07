import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export function CTA() {
  const { loginWithRedirect } = useAuth0();
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  const handleLogin = async () => {
    try {
      console.log("Attempting login...");
      await loginWithRedirect({
        appState: {
          returnTo: "/dashboard",
        },
      });
    } catch (error) {
      if (error?.message?.includes('message port') || 
          error?.message?.includes('lastError') ||
          error?.message?.includes('Extension context')) {
        return;
      }
      console.error("❌ Login error:", error);
    }
  };

  return (
    <section className="border-t border-white/10 bg-[oklch(0.12_0_0)]/30 py-24">
      <div
        ref={ref}
        className={`mx-auto max-w-3xl px-6 text-center transition-all duration-700 ${
          isVisible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-8 scale-95"
        }`}
      >
        <h2 className="mb-4 text-3xl font-bold md:text-4xl text-white">
          Ready to simulate the future?
        </h2>
        <p className="mb-8 text-lg text-white/70">
          Join policymakers and researchers who are making data-driven decisions
          with CIVORA.
        </p>
        <Button
          size="lg"
          className="gap-2 bg-[oklch(0.75_0.18_165)] text-black hover:bg-[oklch(0.78_0.18_165)] shadow-lg shadow-[oklch(0.75_0.18_165)]/20"
          onClick={handleLogin}
        >
          Start Your Journey
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}