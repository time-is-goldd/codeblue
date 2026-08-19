"use client";

/**
 * CTA 클릭 의도(문의 유형/플랜/클릭 위치)를 Contact 섹션까지 전달하는 최소 저장소
 * — CTA 분리(2026-08-21). 예: Pricing 카드의 "Launch 플랜 상담하기"를 누르면 이 값을
 * sessionStorage에 남기고 `#contact`로 스크롤 이동하며, `ContactForm`이 이 값을 읽어
 * 문의 유형/플랜을 자동 선택한다.
 *
 * 이 사이트는 전체가 단일 페이지 앵커 스크롤 구조라 `ContactForm`은 최초 페이지
 * 로드 시 이미 마운트되어 있다 — 클릭이 마운트 "이후"에 일어나므로, sessionStorage만
 * 쓰고 마운트 시 1회만 읽으면 클릭 시점의 값을 영영 놓친다(마운트가 먼저, 클릭이
 * 나중이라는 순서 문제). 그래서 `setCtaIntent`는 sessionStorage 기록과 동시에
 * `window` 커스텀 이벤트를 동기적으로 발생시키고, `ContactForm`은 마운트 중 그 이벤트를
 * 구독해 페이지 이동/새로고침 없이도 "지금 막 클릭된" 값을 즉시 반영한다.
 * sessionStorage는 그와 별개로, 만에 하나 폼이 클릭 이후에 다시 마운트되는 경우
 * (예: 향후 라우트 분리)를 대비한 보조 경로로 남겨둔다.
 *
 * 전역 상태 관리 라이브러리 없이 sessionStorage + 커스텀 이벤트만으로 구현한다 —
 * `readAndClearCtaIntent()`가 읽는 즉시 지워서, 이후 새로고침이나 다른 경로로
 * Contact에 도달했을 때 이전 클릭의 의도가 잘못 남아있지 않게 한다. sessionStorage
 * 접근이 막힌 환경(프라이빗 브라우징 등)에서도 예외를 던지지 않고 조용히 무시한다 —
 * 이 기능은 어디까지나 "가능하면 자동 선택"이라는 보조 기능이라, 실패해도 CTA의
 * 기본 동작(앵커 이동)에는 전혀 영향이 없어야 한다.
 */
const STORAGE_KEY = "codeblue:cta-intent";
const EVENT_NAME = "codeblue:cta-intent";

export type InquiryTypeValue = "new-site" | "diagnosis";
export type PlanValue = "launch" | "business" | "custom";

export interface CtaIntent {
  inquiryType?: InquiryTypeValue;
  plan?: PlanValue;
  ctaLocation?: string;
}

export function setCtaIntent(intent: CtaIntent): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(intent));
  } catch {
    // 접근 불가 환경 — 무시(기본 앵커 이동 동작은 그대로 유지된다).
  }
  window.dispatchEvent(new CustomEvent<CtaIntent>(EVENT_NAME, { detail: intent }));
}

export function readAndClearCtaIntent(): CtaIntent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    window.sessionStorage.removeItem(STORAGE_KEY);
    return JSON.parse(raw) as CtaIntent;
  } catch {
    return null;
  }
}

/** 같은 페이지에서 "지금 막" 발생한 CTA 클릭을 실시간으로 구독한다 — 마운트가 클릭보다
 *  먼저 일어나는 단일 페이지 구조에서 `readAndClearCtaIntent()`의 마운트 시점 1회 읽기가
 *  놓치는 이후의 클릭을 잡아낸다. 구독 해제 함수를 반환한다(useEffect cleanup용). */
export function subscribeToCtaIntent(callback: (intent: CtaIntent) => void): () => void {
  if (typeof window === "undefined") return () => {};

  function handleEvent(event: Event) {
    callback((event as CustomEvent<CtaIntent>).detail);
  }

  window.addEventListener(EVENT_NAME, handleEvent);
  return () => window.removeEventListener(EVENT_NAME, handleEvent);
}
