const HeroSection = () => {
  return (
    <section className="relative min-h-[80vh] w-full bg-black text-white flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      {/* Soft background halo */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12)_0%,rgba(0,0,0,0)_55%)]" />
        <div className="stars absolute inset-0" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center max-w-3xl">
        {/* Small label */}
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-1.5 text-[11px] md:text-xs uppercase tracking-[0.25em] text-white/60 backdrop-blur-sm">
          Synthetic Society Simulator
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-300/80 animate-pulse" />
        </span>

        {/* Main heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold md:font-bold tracking-tight mb-5">
          Civora
        </h1>


        {/* Primary subheading */}
        <p className="text-lg md:text-2xl text-white/80 mb-4">
          A synthetic society where decisions come to life.
        </p>

        {/* Secondary description */}
        <p className="text-sm md:text-base lg:text-lg text-white/55 max-w-2xl">
          Simulate policies, watch virtual citizens react, and uncover hidden
          consequences before your choices ever reach the real world.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;

