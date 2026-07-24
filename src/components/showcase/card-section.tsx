import { ZapIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { FeatureCard, StatisticCard, TestimonialCard, ComparisonCard } from "@/components/common/cards";
import { Grid } from "@/components/common/grid";
import { ShowcaseBlock } from "./showcase-block";

export function CardSection() {
  return (
    <div className="flex flex-col gap-8">
      <ShowcaseBlock title="Base / Glass Card" description="variant: base | glass, hoverable">
        <Card padding="md" className="w-56">
          Base Card
        </Card>
        <Card variant="glass" padding="md" hoverable className="w-56">
          Glass Card (hoverable)
        </Card>
      </ShowcaseBlock>

      <ShowcaseBlock title="Feature Card">
        <Grid cols={{ base: 1, md: 2 }} className="w-full">
          <FeatureCard icon={ZapIcon} title="전환 설계" description="방문자 심리를 설계해 문의로 이어지는 구조를 만듭니다." />
          <FeatureCard icon={ZapIcon} title="속도와 SEO" description="Core Web Vitals 기준을 통과하는 빠른 사이트를 기본으로 합니다." />
        </Grid>
      </ShowcaseBlock>

      <ShowcaseBlock title="Statistic Card">
        <StatisticCard value="+240%" label="온라인 예약 전환" />
        <StatisticCard value="120+" label="누적 프로젝트" />
      </ShowcaseBlock>

      <ShowcaseBlock title="Testimonial Card">
        <TestimonialCard
          content="예약 문의가 눈에 띄게 늘었습니다."
          authorName="김○○"
          authorRole="대표 · ○○의원"
          className="w-80"
        />
      </ShowcaseBlock>

      <ShowcaseBlock title="Comparison Card">
        <ComparisonCard
          title="CodeBlue"
          highlighted
          items={[
            { label: "전환 설계", included: true },
            { label: "성능/SEO 기본 탑재", included: true },
            { label: "사후 유지관리", included: true },
          ]}
          className="w-64"
        />
        <ComparisonCard
          title="저가 템플릿"
          items={[
            { label: "전환 설계", included: false },
            { label: "성능/SEO 기본 탑재", included: false },
            { label: "사후 유지관리", included: false },
          ]}
          className="w-64"
        />
      </ShowcaseBlock>
    </div>
  );
}
