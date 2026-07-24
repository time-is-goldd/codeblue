import NextImage, { type ImageProps as NextImageProps } from "next/image";
import { cn } from "@/lib/utils";

export interface BusinessLogoProps extends Omit<NextImageProps, "src" | "alt" | "width" | "height"> {
  src: string;
  name: string;
  width?: number;
  height?: number;
  className?: string;
}

/**
 * 고객사/협업사 로고 — Trust 섹션의 LogoCloud(COMPONENT_GUIDE.md 3장)에서 사용.
 * 기본은 흑백(grayscale)으로 절제하고, hover 시에만 원색으로 전환해 과도한 시각적
 * 소음 없이 신뢰 신호를 전달한다.
 */
export function BusinessLogo({ src, name, width = 120, height = 40, className, ...props }: BusinessLogoProps) {
  return (
    <NextImage
      src={src}
      alt={`${name} 로고`}
      width={width}
      height={height}
      className={cn(
        "h-8 w-auto grayscale opacity-70 transition-all duration-base ease-out-expo hover:opacity-100 hover:grayscale-0",
        className,
      )}
      {...props}
    />
  );
}
