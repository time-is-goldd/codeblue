"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Section } from "@/components/common/section";
import { Container } from "@/components/common/container";
import { SectionHeading } from "@/components/common/section-heading";
import { Grid } from "@/components/common/grid";
import { ServiceCard } from "./service-card";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { resolveIcon } from "@/lib/icons";
import type { Service } from "@/types";

export interface ServicesSectionProps {
  services: Service[];
}

const ENTRANCE_DURATION = 0.6;
const EASE_OUT = "power2.out";

/**
 * Services Overview — DEVELOPMENT_PLAN.md Phase 7.5(원안에는 있었으나 미구현이었다가
 * CRO 재설계 2026-07-23에 실제 구현). Difference(왜 다른가)와 Portfolio(사례) 사이의
 * 공백인 "그래서 구체적으로 무엇을 만들어주는가"를 메운다.
 *
 * 서브페이지(`/services/[slug]`)는 이번 범위에서 보류(2차 확장)하고 홈 미리보기 카드만
 * 구현한다 — Repository(`service.repository.ts`)는 이미 서브페이지 대비 스키마
 * (slug/description/features 등)를 갖추고 있어 나중에 그대로 확장 가능하다.
 */
export function ServicesSection({ services }: ServicesSectionProps) {
  const headingRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const headingEl = headingRef.current;
    if (!headingEl) return;

    if (prefersReducedMotion) {
      gsap.set(headingEl, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(headingEl, { opacity: 0, y: 24 });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: headingEl,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(headingEl, { opacity: 1, y: 0, duration: ENTRANCE_DURATION, ease: EASE_OUT });
        },
      });
    });

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <Section id="services" background="elevated">
      <Container className="flex flex-col items-center gap-16">
        <div ref={headingRef} className="w-full">
          <SectionHeading
            align="center"
            eyebrow="Services"
            title="어떤 홈페이지가 필요하신가요?"
            description="목적과 규모에 맞는 방식으로 제작해드립니다."
          />
        </div>

        <Grid cols={{ base: 1, md: 3, lg: 3 }} className="w-full">
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              icon={resolveIcon(service.icon ?? "")}
            />
          ))}
        </Grid>
      </Container>
    </Section>
  );
}
