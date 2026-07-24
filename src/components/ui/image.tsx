import NextImage, { type ImageProps as NextImageProps } from "next/image";
import { cn } from "@/lib/utils";

export interface ImageProps extends NextImageProps {
  rounded?: boolean;
}

/**
 * next/image 래퍼 — DESIGN_SYSTEM.md 12장(다크 테마에서 이미지는 subtle border + radius-md 처리).
 * `alt`은 next/image 타입 상 필수이므로 접근성(의미 있는 대체 텍스트) 누락을 구조적으로 방지한다.
 */
export function Image({ className, rounded = true, alt, ...props }: ImageProps) {
  return (
    <NextImage
      alt={alt}
      className={cn(rounded && "rounded-md border border-brand-border-subtle", className)}
      {...props}
    />
  );
}
