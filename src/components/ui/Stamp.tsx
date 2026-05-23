interface StampProps {
  children: React.ReactNode;
  variant?: "default" | "lacuna" | "classified";
  rotate?: number;
  className?: string;
}

export function Stamp({
  children,
  variant = "default",
  rotate,
  className,
}: StampProps) {
  const style =
    typeof rotate === "number" ? { transform: `rotate(${rotate}deg)` } : undefined;

  return (
    <span
      className={`stamp ${variant === "lacuna" ? "lacuna" : ""} ${
        variant === "classified" ? "classified" : ""
      } ${className ?? ""}`}
      style={style}
    >
      {children}
    </span>
  );
}

interface StampCircleProps {
  topText: string;
  centerText: string;
  bottomText?: string;
  rotate?: number;
  className?: string;
}

export function StampCircle({
  topText,
  centerText,
  bottomText,
  rotate = -12,
  className,
}: StampCircleProps) {
  return (
    <span
      className={`stamp-circle ${className ?? ""}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <span className="flex flex-col items-center gap-0.5 text-center">
        <span className="text-[8px] tracking-widest">{topText}</span>
        <span className="text-[14px] font-bold">{centerText}</span>
        {bottomText && (
          <span className="text-[7px] tracking-wide">{bottomText}</span>
        )}
      </span>
    </span>
  );
}
