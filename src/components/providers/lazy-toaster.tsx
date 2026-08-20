"use client";

import dynamic from "next/dynamic";

/**
 * `ssr: false`를 쓰는 `next/dynamic()`은 Server Component에서 직접 호출할 수 없다
 * (Next.js 16 제약) — `AppProviders`(Server Component)를 통째로 Client Component로
 * 바꾸는 대신, 이 지연 로드 하나만을 위한 최소 경계를 별도 파일로 분리한다
 * (PageSpeed Insights 모바일 성능 감사, 2026-08-19 — 불필요하게 넓은 "use client"
 * 경계를 만들지 않는다는 원칙).
 */
export const Toaster = dynamic(() => import("@/components/ui/sonner").then((mod) => mod.Toaster), { ssr: false });
