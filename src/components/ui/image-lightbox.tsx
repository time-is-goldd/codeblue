"use client";

import type { ReactNode } from "react";
import NextImage from "next/image";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";
import { Dialog, DialogTrigger, DialogPortal, DialogOverlay, DialogClose, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export interface ImageLightboxProps {
  src: string;
  alt: string;
  /** 라이트박스를 여는 클릭 트리거로 렌더링할 콘텐츠(보통 `ResponsiveImage`) */
  children: ReactNode;
  className?: string;
}

/**
 * 이미지를 클릭하면 원본 비율을 유지한 채 화면 대부분을 차지하는 확대 보기를 여는 라이트박스
 * — Difference 섹션의 "홈페이지 제작 사기"/"템플릿" 스크린샷 5장이 텍스트가 작아 읽기
 * 어렵다는 요청으로 추가했다(2026-07-23).
 *
 * `components/ui/dialog.tsx`의 Base UI 프리미티브를 재사용해 ESC 닫힘·배경 클릭 닫힘·
 * 포커스 트랩을 별도 구현 없이 그대로 얻는다. 다만 `DialogContent`(작은 팝업 카드용 —
 * max-w-sm/패딩/불투명 배경)는 전체화면에 가까운 이미지 뷰어와 맞지 않아 쓰지 않고
 * `DialogPrimitive.Popup`을 직접 구성한다. Fade+Scale 애니메이션은 `DialogContent`가 쓰는
 * 것과 동일한 tw-animate-css 유틸(`animate-in`/`zoom-in-95`/`data-closed:` 등, globals.css가
 * 이미 로드)을 그대로 사용해 사이트 전반의 모달 모션과 일관된다.
 *
 * `next/image`의 `fill`은 부모가 명시적 크기를 가져야 하므로, 뷰포트 기준 고정 크기 박스를
 * 만들고 그 안에서 `object-contain`으로 원본 비율을 유지한 채 맞춘다(레터박스, 박스 자체는
 * 배경색이 없어 이미지 비율이 박스와 다르면 남는 공간은 그냥 어두운 Backdrop이 그대로
 * 보인다) — 이미지 실제 가로/세로 비율을 몰라도 항상 안전하다.
 *
 * 박스 크기(2026-07-23 축소): 처음엔 화면을 거의 채우는 크기(92vw/88vh)였으나 "사진을 조금
 * 크게 보여주는 정도"면 충분하다는 피드백으로 Desktop/Tablet(`sm:` 이상)은 최대
 * 75vw × 80vh로 줄였다. Mobile(`base`)은 화면 자체가 작아 그대로 축소하면 텍스트 스크린샷이
 * 오히려 더 읽기 어려워지므로 90vw × 78vh로 조금 더 여유를 둔다.
 */
export function ImageLightbox({ src, alt, children, className }: ImageLightboxProps) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <button
            type="button"
            className={cn(
              "block w-full cursor-zoom-in appearance-none rounded-md border-0 bg-transparent p-0 text-left focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
              className,
            )}
          />
        }
        aria-label={`${alt} 크게 보기`}
      >
        {children}
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="bg-black/80" />
        <DialogPrimitive.Popup
          data-slot="image-lightbox-content"
          className="fixed top-1/2 left-1/2 z-modal flex h-[78vh] w-[90vw] -translate-x-1/2 -translate-y-1/2 items-center justify-center outline-none duration-150 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 sm:h-[80vh] sm:w-[75vw]"
        >
          <DialogTitle className="sr-only">{alt}</DialogTitle>
          <div className="relative size-full">
            <NextImage src={src} alt={alt} fill sizes="92vw" className="object-contain" />
          </div>
          <DialogClose
            render={
              <button
                type="button"
                className="absolute top-3 right-3 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none sm:top-4 sm:right-4"
              />
            }
            aria-label="닫기"
          >
            <XIcon aria-hidden className="size-icon-md" />
          </DialogClose>
        </DialogPrimitive.Popup>
      </DialogPortal>
    </Dialog>
  );
}
