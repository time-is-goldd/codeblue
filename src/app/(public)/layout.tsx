import { SkipLink } from "@/components/common";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingCta } from "@/components/layout/floating-cta";
import { ScrollProgressBar } from "@/components/layout/scroll-progress-bar";
import { LayoutScrollProvider } from "@/components/layout/layout-scroll-provider";
import { HEADER_HEIGHT } from "@/lib/constants/layout";
import { getCtaBySlot } from "@/lib/repositories/cta.repository";

/**
 * 공개 사이트 공통 레이아웃 (ARCHITECTURE.md 2장).
 * Phase 3A/3B로 Header/Footer/FloatingCTA/ScrollProgressBar가 모두 완성되었다.
 * `LayoutScrollProvider`가 이 네 컴포넌트가 공유하는 스크롤 상태의 단일 소스다.
 * Header가 `position: fixed`이므로 `<main>`에 HEADER_HEIGHT만큼 상단 여백을 주어
 * 첫 섹션이 Header 아래에 가려지지 않도록 한다.
 */
export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const headerCta = await getCtaBySlot("header-cta");

  return (
    <LayoutScrollProvider>
      <SkipLink />
      <ScrollProgressBar />
      <Header cta={headerCta} />
      <main id="main-content" style={{ paddingTop: HEADER_HEIGHT }}>
        {children}
      </main>
      <Footer />
      <FloatingCta />
    </LayoutScrollProvider>
  );
}
