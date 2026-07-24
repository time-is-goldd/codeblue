/**
 * DATA_SCHEMA.md 5장 기준. Supabase 이관 시 `services` 테이블과 1:1 대응한다.
 */
export interface ServiceFeature {
  title: string;
  description: string;
}

export interface Service {
  id: string;
  slug: string;
  name: string;
  summary: string;
  description: string;
  targetAudience: string[];
  /**
   * 카드 하단에 노출하는 업종 한 줄 소개 — "OO 홈페이지 제작"처럼 실제 검색 의도와
   * 맞닿은 완전한 구(句) 형태로 작성한다(targetAudience의 단일 명사 배열만으로는
   * 화면에 이 표현이 노출되지 않는다). 없으면 카드에 이 줄 자체를 렌더링하지 않는다.
   */
  industryHighlight?: string;
  features: ServiceFeature[];
  icon?: string;
  relatedPortfolioIds?: string[];
  order: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}
