import {
  Building2,
  ShieldCheck,
  Zap,
  Heart,
  AlertTriangle,
  MessageCircleQuestion,
  Sparkles,
  MousePointerClick,
  LayoutTemplate,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";

/**
 * 데이터에 문자열로 저장된 아이콘 이름을 실제 Lucide 컴포넌트로 변환하는 레지스트리.
 * Supabase 등 DB에는 컴포넌트 참조를 저장할 수 없으므로(Service.icon 등 이미 문자열 키로
 * 설계됨 — DATA_SCHEMA.md), 렌더링 시점에 이 맵으로 조회한다.
 * 새 아이콘이 필요해지면 이 맵에 한 줄만 추가하면 된다.
 */
export const ICON_MAP: Record<string, LucideIcon> = {
  Building2,
  ShieldCheck,
  Zap,
  Heart,
  AlertTriangle,
  MessageCircleQuestion,
  Sparkles,
  MousePointerClick,
  LayoutTemplate,
  RefreshCw,
  "layout-template": LayoutTemplate,
  "building-2": Building2,
  "refresh-cw": RefreshCw,
};

const DEFAULT_ICON: LucideIcon = Building2;

export function resolveIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? DEFAULT_ICON;
}
