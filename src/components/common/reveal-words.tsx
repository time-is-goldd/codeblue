"use client";

import { Fragment, useRef } from "react";
import { motion, useInView } from "framer-motion";

export interface RevealWordsProps {
  /** 줄 단위 문구 — 줄 사이에는 `<br />`가 들어간다. 각 줄은 공백 기준으로 단어를 나눈다. */
  lines: string[];
  /**
   * 등장 여부를 직접 제어할 때 쓴다(예: Hero 스크롤 진행률). 생략하면 화면에 들어올 때
   * 한 번 등장한다(`useInView`).
   */
  play?: boolean;
  /** 첫 단어가 시작되기까지 지연(초) */
  delay?: number;
  /** 단어 사이 간격(초) */
  stagger?: number;
  /** 단어 하나가 나타나는 시간(초) */
  duration?: number;
  /** 시작 시 아래로 내려가 있는 거리(px) */
  yOffset?: number;
  /** 시작 시 흐림 정도(px) */
  blur?: number;
}

const EASE_OUT_CUBIC = [0.215, 0.61, 0.355, 1] as const;

/**
 * 단어 단위 흐림→선명 등장(Reveal Text, 2026-10-07).
 *
 * 원본(독립 RevealText 컴포넌트)에서 "단어마다 흐릿하게 아래에서 떠오르며 선명해지는" 연출만
 * 가져왔다 — 글자 크기·색·태그는 감싸는 쪽(기존 Heading/SectionHeading)이 그대로 정하고,
 * 이 컴포넌트는 그 안에 들어가는 단어 span만 만든다. 그래서 기존 타이포그래피와
 * 제목 계층(H1은 Hero 하나)을 건드리지 않는다.
 *
 * 단어 사이에는 실제 공백 문자를 두어 한글 줄바꿈·복사·스크린리더 읽기가 원래 문장과 같다.
 * framer-motion(JS)이라 OS 모션 감소 설정과 무관하게 항상 보인다(사이트 공통 방침).
 *
 * 사용처: Hero "O" 안의 보조 문구(스크롤 진행률로 `play` 제어), 문의 섹션 제목·설명(램프와 함께).
 * Hero H1처럼 접속 즉시 보여야 하는 문구(LCP)에는 쓰지 않는다.
 */
export function RevealWords({
  lines,
  play,
  delay = 0,
  stagger = 0.06,
  duration = 0.8,
  yOffset = 20,
  blur = 10,
}: RevealWordsProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const visible = play ?? inView;

  let wordIndex = 0;
  return (
    <span ref={ref}>
      {lines.map((line, lineIndex) => (
        <Fragment key={lineIndex}>
          {lineIndex > 0 && <br />}
          {line
            .trim()
            .split(/\s+/)
            .map((word, i) => {
              const order = wordIndex++;
              return (
                <Fragment key={i}>
                  {i > 0 && " "}
                  <motion.span
                    className="inline-block will-change-[transform,opacity,filter]"
                    initial={false}
                    animate={
                      visible
                        ? { opacity: 1, y: 0, filter: "blur(0px)" }
                        : { opacity: 0, y: yOffset, filter: `blur(${blur}px)` }
                    }
                    transition={{
                      duration,
                      ease: EASE_OUT_CUBIC,
                      // 사라질 때는 순서 지연 없이 한꺼번에 — 다시 올라갔을 때 바로 정리되게.
                      delay: visible ? delay + order * stagger : 0,
                    }}
                  >
                    {word}
                  </motion.span>
                </Fragment>
              );
            })}
        </Fragment>
      ))}
    </span>
  );
}
