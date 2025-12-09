import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export function Hero() {
  const { loginWithRedirect } = useAuth0(); // Removed unused 'isAuthenticated'
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  const handleLogin = async () => {
    try {
      console.log("Attempting login...");
      await loginWithRedirect({
        appState: {
          returnTo: "/dashboard",
        },
        // Uses default from Auth0Provider
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
    <section className="relative flex min-h-screen items-center justify-center pt-24">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />

      <div
        ref={ref}
        className={`relative z-10 mx-auto max-w-4xl px-6 text-center transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-[oklch(0.15_0_0)]/50 backdrop-blur-sm px-5 py-2 text-xs tracking-[0.15em] uppercase text-white shadow-lg shadow-black/20">
          SYNTHETIC SOCIETY SIMULATOR
          <span className="h-2 w-2 rounded-full bg-[oklch(0.75_0.18_165)] shadow-[0_0_8px_oklch(0.75_0.18_165)]" />
        </div>

        <h1 className="mb-6 text-6xl font-bold tracking-tight text-white md:text-8xl drop-shadow-lg">
          Civora
        </h1>

        <p className="mb-4 text-xl text-white md:text-2xl font-light">
          A synthetic society where decisions come to life.
        </p>

        <p className="mx-auto max-w-2xl text-base text-white/70 md:text-lg font-light leading-relaxed">
          Simulate policies, watch virtual citizens react, and uncover hidden
          consequences before your choices ever reach the real world.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row mt-10">
          <Button
            size="lg"
            className="gap-2 bg-[oklch(0.75_0.18_165)] text-black hover:bg-[oklch(0.78_0.18_165)] shadow-lg shadow-[oklch(0.75_0.18_165)]/20"
            onClick={handleLogin}
          >
            Launch Simulation
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="absolute bottom-20 left-10 h-32 w-32 rounded-full bg-[oklch(0.75_0.18_165)]/10 blur-3xl" />
      <div className="absolute right-10 top-40 h-40 w-40 rounded-full bg-[oklch(0.75_0.18_165)]/10 blur-3xl" />
    </section>
  );
}