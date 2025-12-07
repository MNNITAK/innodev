// src/components/branding/CivoraLogo.jsx
export function CivoraLogo({ size = 32, className = "", labelClassName = "" }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className="flex items-center justify-center rounded-full"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="12" cy="12" r="3" stroke="currentColor" fill="none" />
          <circle cx="8" cy="8" r="2" stroke="currentColor" fill="none" opacity="0.7" />
          <circle cx="16" cy="8" r="2" stroke="currentColor" fill="none" opacity="0.7" />
          <circle cx="8" cy="16" r="2" stroke="currentColor" fill="none" opacity="0.7" />
          <circle cx="16" cy="16" r="2" stroke="currentColor" fill="none" opacity="0.7" />
          <path
            d="M10 10 L12 12 M14 10 L12 12 M10 14 L12 12 M14 14 L12 12"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.5"
          />
        </svg>
      </div>
      <span
        className={`text-sm font-medium tracking-[0.2em] uppercase ${labelClassName}`}
      >
        CIVORA
      </span>
    </div>
  );
}
