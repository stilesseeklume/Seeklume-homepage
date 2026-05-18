type SeeklumeLogoProps = {
  size?: "sm" | "lg";
  className?: string;
};

export default function SeeklumeLogo({ size = "sm", className = "" }: SeeklumeLogoProps) {
  const isLarge = size === "lg";
  const box = isLarge ? "h-32 w-32 sm:h-44 sm:w-44" : "h-9 w-9";
  const text = isLarge ? "text-5xl sm:text-7xl" : "text-lg";

  return (
    <div
      className={`${box} ${className} relative grid place-items-center rounded-full border border-white/25 bg-white/[0.08] shadow-[0_0_80px_rgba(255,255,255,0.18)] backdrop-blur-md`}
      aria-label="Seeklume logo"
    >
      <span className="absolute inset-[14%] rounded-full border border-white/20" />
      <span className="absolute h-[62%] w-[62%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.34),rgba(255,255,255,0.04)_62%,transparent_70%)]" />
      <span
        className={`${text} relative text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.5)]`}
        style={{ fontFamily: "'Instrument Serif', serif" }}
      >
        S
      </span>
    </div>
  );
}
