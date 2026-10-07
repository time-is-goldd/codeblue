"use client";

import { motion } from "framer-motion";

/** 브랜드 블루(tokens.css의 --color-accent #2f6fed) — 조명 색 */
const LAMP_RGB = "47, 111, 237";
const TRANSITION = { ease: "easeInOut", delay: 0.3, duration: 0.8 } as const;
const VIEWPORT = { once: true, amount: 0.4 } as const;

/**
 * 문의 섹션 상단 램프(스포트라이트) 연출(2026-10-07).
 *
 * 섹션 맨 위 경계에 블루 빛줄기(가로선)가 켜지며 양쪽으로 넓어지고, 그 아래로 원뿔형 빛이
 * 퍼져 "프로젝트 문의" 제목을 비춘다. 사이트의 거의 모든 CTA가 도착하는 지점이라
 * "여기서 시작하세요"라는 마지막 강조로 쓰고, Hero의 블루 무드를 마무리한다.
 *
 * 원본(독립 Hero 컴포넌트)에서 조명 부분만 떼어 왔다 — 자체 H1/버튼/80vh 높이는 쓰지 않고
 * 기존 섹션 제목(H2)을 그대로 비춘다. 원뿔 가장자리는 섹션 배경색(`bg-background`, Contact는
 * base 배경)으로 덮는 마스크로 지우므로, 섹션 배경색을 바꾸면 여기 마스크 색도 맞춰야 한다.
 * 장식 요소라 스크린리더에서는 숨긴다. framer-motion(JS)이라 OS 모션 감소 설정과 무관하게
 * 항상 보인다(사이트 공통 방침). 모바일은 전체를 줄여(scale) 화면 폭에 맞춘다.
 */
export function ContactLamp() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex h-72 origin-top scale-[0.7] items-start justify-center md:scale-100"
    >
      {/* 가운데 은은한 큰 빛 */}
      <div
        className="absolute top-0 h-36 w-[28rem] translate-y-[30%] rounded-full opacity-60 blur-3xl"
        style={{ backgroundColor: `rgba(${LAMP_RGB}, 0.6)` }}
      />

      {/* 램프 심지(밝은 핵) */}
      <motion.div
        initial={{ width: "8rem" }}
        whileInView={{ width: "16rem" }}
        viewport={VIEWPORT}
        transition={TRANSITION}
        className="absolute top-0 h-36 -translate-y-[20%] rounded-full blur-2xl"
        style={{ backgroundColor: `rgba(${LAMP_RGB}, 0.6)` }}
      />

      {/* 빛줄기(가로선) */}
      <motion.div
        initial={{ width: "15rem" }}
        whileInView={{ width: "30rem" }}
        viewport={VIEWPORT}
        transition={TRANSITION}
        className="absolute top-0 h-0.5"
        style={{ backgroundColor: `rgba(${LAMP_RGB}, 0.8)`, boxShadow: `0 0 16px rgba(${LAMP_RGB}, 0.7)` }}
      />

      {/* 왼쪽 원뿔 빛 */}
      <motion.div
        initial={{ opacity: 0.5, width: "15rem" }}
        whileInView={{ opacity: 1, width: "30rem" }}
        viewport={VIEWPORT}
        transition={TRANSITION}
        className="absolute top-0 right-1/2 h-56 overflow-visible"
        style={{
          backgroundImage: `conic-gradient(from 70deg at center top, rgba(${LAMP_RGB}, 0.6), transparent, transparent)`,
        }}
      >
        <div className="absolute bottom-0 left-0 z-20 h-40 w-full bg-background [mask-image:linear-gradient(to_top,white,transparent)]" />
        <div className="absolute bottom-0 left-0 z-20 h-full w-40 bg-background [mask-image:linear-gradient(to_right,white,transparent)]" />
      </motion.div>

      {/* 오른쪽 원뿔 빛 */}
      <motion.div
        initial={{ opacity: 0.5, width: "15rem" }}
        whileInView={{ opacity: 1, width: "30rem" }}
        viewport={VIEWPORT}
        transition={TRANSITION}
        className="absolute top-0 left-1/2 h-56"
        style={{
          backgroundImage: `conic-gradient(from 290deg at center top, transparent, transparent, rgba(${LAMP_RGB}, 0.6))`,
        }}
      >
        <div className="absolute right-0 bottom-0 z-20 h-full w-40 bg-background [mask-image:linear-gradient(to_left,white,transparent)]" />
        <div className="absolute right-0 bottom-0 z-20 h-40 w-full bg-background [mask-image:linear-gradient(to_top,white,transparent)]" />
      </motion.div>
    </div>
  );
}
