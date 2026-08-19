import "server-only";

/**
 * 문의 접수를 Telegram으로 알리는 최소 알림 — 이메일(Resend) 전송이 성공한 뒤에만
 * `contact.repository.ts`의 `submitInquiry`가 호출한다(운영 홈페이지 개선, 2026-08-19).
 *
 * 설계 원칙:
 * - 새 패키지를 추가하지 않는다 — Telegram Bot API(`sendMessage`)를 서버 `fetch`로 직접
 *   호출한다.
 * - `TELEGRAM_BOT_TOKEN`/`TELEGRAM_CHAT_ID`는 `NEXT_PUBLIC_` 접두사 없이 서버 전용
 *   환경변수로만 읽는다 — 클라이언트 번들에 절대 포함되지 않는다(이 파일은
 *   "server-only"이며, 애초에 클라이언트 컴포넌트에서 import할 수 없다).
 * - 메시지에는 고객 개인정보(이름/연락처/이메일/문의 내용)를 절대 포함하지 않는다 —
 *   상세 내용은 항상 이메일에서만 확인한다. 메시지 본문은 사용자 입력을 전혀 섞지 않는
 *   고정 문자열이라 `parse_mode`도 지정하지 않는다(플레인 텍스트로만 전송 — Markdown/HTML
 *   파싱으로 인한 예기치 않은 렌더링/인젝션 여지 자체를 없앤다).
 * - 실패해도 예외를 던지지 않는다 — 호출부가 이 결과를 "부가 알림"으로만 취급해,
 *   Telegram 실패가 문의 접수 전체(이메일 발송 성공)를 실패로 만들지 않는다.
 * - 응답이 오지 않는 상황이 문의 처리 전체를 오래 붙잡지 않도록 `AbortController`로
 *   타임아웃을 건다.
 */

const DEFAULT_TIMEOUT_MS = 5000;

export type TelegramNotificationFailureReason =
  | "missing_env"
  | "timeout"
  | "http_error"
  | "network_error";

export interface TelegramNotificationResult {
  success: boolean;
  /** 내부 진단/로그용 사유 — 절대 사용자(클라이언트)에게 그대로 노출하지 않는다. */
  reason?: TelegramNotificationFailureReason;
}

/** CTA 분리(2026-08-21) — 문의 유형/플랜/CTA 위치는 개인정보가 아니므로 Telegram
 *  알림에 포함해도 기존 "개인정보 절대 미포함" 원칙(이름/연락처/이메일/문의 내용)에
 *  어긋나지 않는다. 셋 다 선택 항목이라 값이 없으면 해당 줄 자체를 만들지 않는다 —
 *  기존 문의(신규 제작 상담, 값 없음)는 메시지 본문이 이전과 완전히 동일하다. */
const INQUIRY_TYPE_LABEL: Record<string, string> = {
  "new-site": "새 홈페이지 제작 상담",
  diagnosis: "기존 홈페이지 무료 진단",
};

const PLAN_LABEL: Record<string, string> = {
  launch: "Launch",
  business: "Business",
  custom: "Custom",
};

export interface SendTelegramNotificationOptions {
  /** 테스트에서 짧은 타임아웃으로 재현하기 위한 훅 — 운영 호출부는 지정하지 않는다
   *  (기본값 `DEFAULT_TIMEOUT_MS`를 그대로 쓴다). */
  timeoutMs?: number;
  /** 문의 유형("new-site"/"diagnosis") — 값이 있을 때만 메시지에 한 줄 추가된다. */
  inquiryType?: string;
  /** 선택한 플랜("launch"/"business"/"custom") — 값이 있을 때만 메시지에 한 줄 추가된다. */
  plan?: string;
  /** CTA가 클릭된 위치(예: "hero", "pricing_card") — 값이 있을 때만 메시지에 한 줄 추가된다. */
  ctaLocation?: string;
}

function formatKoreaTime(date: Date): string {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function buildNotificationText(
  context: Pick<SendTelegramNotificationOptions, "inquiryType" | "plan" | "ctaLocation"> = {},
): string {
  const lines = ["🔔 CodeBlue 새 문의가 도착했습니다.", `접수 시각: ${formatKoreaTime(new Date())}`];

  if (context.inquiryType) {
    lines.push(`문의 유형: ${INQUIRY_TYPE_LABEL[context.inquiryType] ?? context.inquiryType}`);
  }
  if (context.plan) {
    lines.push(`선택한 플랜: ${PLAN_LABEL[context.plan] ?? context.plan}`);
  }
  if (context.ctaLocation) {
    lines.push(`CTA 위치: ${context.ctaLocation}`);
  }

  lines.push("상세 내용은 등록된 이메일에서 확인하세요.");
  return lines.join("\n");
}

export async function sendTelegramNotification(
  options: SendTelegramNotificationOptions = {},
): Promise<TelegramNotificationResult> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    // 요청사항: Telegram 환경변수가 없어도 이메일 발송은 정상 작동해야 하며, 서버에
    // 한 번의 명확한 경고만 남긴다. 토큰/Chat ID 값 자체는 로그에 남기지 않는다.
    console.warn(
      "[sendTelegramNotification] TELEGRAM_BOT_TOKEN 또는 TELEGRAM_CHAT_ID가 설정되지 않아 Telegram 알림을 건너뜁니다.",
    );
    return { success: false, reason: "missing_env" };
  }

  const controller = new AbortController();
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: buildNotificationText(options),
        disable_web_page_preview: true,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      // 응답 본문(에러 설명 등)은 내부 토큰/Chat ID를 반향(echo)할 수 있어 로그에 남기지
      // 않는다 — 상태 코드만 기록한다.
      console.error(`[sendTelegramNotification] Telegram API 응답 실패: HTTP ${response.status}`);
      return { success: false, reason: "http_error" };
    }

    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.error(`[sendTelegramNotification] Telegram API 요청이 ${timeoutMs}ms 안에 응답하지 않았습니다.`);
      return { success: false, reason: "timeout" };
    }
    console.error(
      "[sendTelegramNotification] Telegram 알림 전송 중 오류가 발생했습니다:",
      error instanceof Error ? error.message : "알 수 없는 오류",
    );
    return { success: false, reason: "network_error" };
  } finally {
    clearTimeout(timeoutId);
  }
}
