import Image from "next/image";

type LogoProps = {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

const sizeMap = {
  sm: 36,
  md: 52,
  lg: 72,
  xl: 96,
};

export default function Logo({
  size = "lg",
  className = "",
}: LogoProps) {
  const dimension = sizeMap[size];

  return (
    <div
      className={`relative shrink-0 ${className}`}
      style={{ width: dimension, height: dimension }}
    >
      <Image
        src="/tendrils-logo.png"
        alt="Tendrils logo"
        fill
        priority
        className="object-contain"
        sizes={`${dimension}px`}
      />
    </div>
  );
}