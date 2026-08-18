import { test, describe, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { sendTelegramNotification } from "../src/lib/telegram/send-telegram-notification.ts";

/**
 * `sendTelegramNotification()` 단위 테스트 — 문의 이메일 + Telegram 알림(2026-08-19)의
 * 요청사항을 실제 네트워크 요청 없이(항상 `global.fetch`를 모킹) 검증한다.
 *
 * 실행: `npm test`. `--conditions=react-server`로 실행해야 한다(`package.json` 참고) —
 * 이 파일이 import하는 소스는 `"server-only"`로 시작하는데, 그 패키지는 Next.js
 * 빌드(react-server 조건)에서만 no-op으로 대체되고 순수 Node 실행에서는 무조건
 * 예외를 던지도록 되어 있다.
 *
 * 실제 Telegram Bot에 메시지를 보내지 않는다 — 모든 테스트가 `global.fetch`를 직접
 * 교체한 가짜 구현으로 실행된다.
 */

const originalFetch = globalThis.fetch;
const originalBotToken = process.env.TELEGRAM_BOT_TOKEN;
const originalChatId = process.env.TELEGRAM_CHAT_ID;
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

interface FetchCall {
  url: string;
  init?: RequestInit;
}

let fetchCalls: FetchCall[];
let consoleOutput: string[];

beforeEach(() => {
  fetchCalls = [];
  consoleOutput = [];
  console.warn = (...args: unknown[]) => {
    consoleOutput.push(String(args[0]));
  };
  console.error = (...args: unknown[]) => {
    consoleOutput.push(String(args[0]));
  };
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalBotToken === undefined) delete process.env.TELEGRAM_BOT_TOKEN;
  else process.env.TELEGRAM_BOT_TOKEN = originalBotToken;
  if (originalChatId === undefined) delete process.env.TELEGRAM_CHAT_ID;
  else process.env.TELEGRAM_CHAT_ID = originalChatId;
  console.warn = originalConsoleWarn;
  console.error = originalConsoleError;
});

function setEnv(botToken: string | undefined, chatId: string | undefined) {
  if (botToken === undefined) delete process.env.TELEGRAM_BOT_TOKEN;
  else process.env.TELEGRAM_BOT_TOKEN = botToken;
  if (chatId === undefined) delete process.env.TELEGRAM_CHAT_ID;
  else process.env.TELEGRAM_CHAT_ID = chatId;
}

function mockFetchOk() {
  globalThis.fetch = (async (url: string, init?: RequestInit) => {
    fetchCalls.push({ url, init });
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }) as typeof fetch;
}

function mockFetchHttpError(status: number) {
  globalThis.fetch = (async (url: string, init?: RequestInit) => {
    fetchCalls.push({ url, init });
    return new Response(JSON.stringify({ ok: false, description: "unauthorized" }), { status });
  }) as typeof fetch;
}

function mockFetchNetworkError() {
  globalThis.fetch = (async () => {
    throw new Error("network down");
  }) as typeof fetch;
}

/** 실제 `fetch`가 abort될 때 던지는 DOMException(name: "AbortError")을 흉내 낸다. */
function mockFetchHangsUntilAborted() {
  globalThis.fetch = ((url: string, init?: RequestInit) => {
    fetchCalls.push({ url, init });
    return new Promise((_resolve, reject) => {
      init?.signal?.addEventListener("abort", () => {
        const err = new Error("The operation was aborted.");
        err.name = "AbortError";
        reject(err);
      });
    });
  }) as typeof fetch;
}

describe("sendTelegramNotification", () => {
  test("TELEGRAM_BOT_TOKEN/CHAT_ID가 없으면 fetch를 호출하지 않고 missing_env를 반환한다", async () => {
    setEnv(undefined, undefined);
    mockFetchOk();

    const result = await sendTelegramNotification();

    assert.deepEqual(result, { success: false, reason: "missing_env" });
    assert.equal(fetchCalls.length, 0);
    // 요청사항: 환경변수가 없으면 서버에 명확한 경고를 1회 남긴다.
    assert.equal(consoleOutput.length, 1);
  });

  test("이메일 성공 시나리오와 동일하게, 정상 응답이면 success: true를 반환한다", async () => {
    setEnv("test-bot-token", "12345");
    mockFetchOk();

    const result = await sendTelegramNotification();

    assert.deepEqual(result, { success: true });
    assert.equal(fetchCalls.length, 1);
  });

  test("Telegram 응답이 성공 코드가 아니면 http_error로 실패 처리한다(토큰을 노출하지 않는다)", async () => {
    setEnv("test-bot-token", "12345");
    mockFetchHttpError(401);

    const result = await sendTelegramNotification();

    assert.deepEqual(result, { success: false, reason: "http_error" });
    // 로그에 상태 코드는 남기되, 봇 토큰 값 자체는 절대 남기지 않는다.
    const joined = consoleOutput.join("\n");
    assert.match(joined, /401/);
    assert.doesNotMatch(joined, /test-bot-token/);
  });

  test("네트워크 오류가 나도 예외를 던지지 않고 network_error로 실패 처리한다", async () => {
    setEnv("test-bot-token", "12345");
    mockFetchNetworkError();

    const result = await sendTelegramNotification();

    assert.deepEqual(result, { success: false, reason: "network_error" });
  });

  test("응답이 늦으면 timeout으로 실패 처리한다(합리적인 timeout 적용)", async () => {
    setEnv("test-bot-token", "12345");
    mockFetchHangsUntilAborted();

    const result = await sendTelegramNotification({ timeoutMs: 50 });

    assert.deepEqual(result, { success: false, reason: "timeout" });
  });

  test("메시지에 고객 이름·전화번호·이메일·문의 내용이 포함되지 않는다(최소 알림만 전송)", async () => {
    setEnv("test-bot-token", "12345");
    mockFetchOk();

    await sendTelegramNotification();

    assert.equal(fetchCalls.length, 1);
    const body = JSON.parse(String(fetchCalls[0]!.init!.body));

    assert.match(body.text, /CodeBlue 새 문의가 도착했습니다/);
    assert.match(body.text, /접수 시각/);
    assert.match(body.text, /상세 내용은 등록된 이메일에서 확인하세요/);
    // 이 함수는 애초에 고객 데이터를 인자로 받지 않는다 — 그래도 PII로 흔히 쓰이는
    // 키/마커가 실수로 섞여 들어가지 않았는지 본문 문자열 자체를 방어적으로 확인한다.
    for (const forbidden of ["이름", "전화", "연락처", "이메일:", "문의 내용", "@"]) {
      assert.ok(!body.text.includes(forbidden), `메시지에 "${forbidden}"가 포함되면 안 됩니다`);
    }
    // parse_mode는 사용하지 않는다(플레인 텍스트로만 전송).
    assert.equal(body.parse_mode, undefined);
    assert.equal(body.disable_web_page_preview, true);
  });

  test("Bot Token/Chat ID는 요청 URL/payload 안에서만 쓰이고 다른 곳으로 새지 않는다", async () => {
    setEnv("secret-token-value", "chat-id-value");
    mockFetchOk();

    await sendTelegramNotification();

    const call = fetchCalls[0]!;
    assert.match(call.url, /secret-token-value/);
    const body = JSON.parse(String(call.init!.body));
    assert.equal(body.chat_id, "chat-id-value");
    // 성공 케이스이므로 콘솔에는 아무것도 남지 않아야 한다(토큰이 로그로 샐 여지 자체가 없다).
    assert.equal(consoleOutput.length, 0);
  });
});
