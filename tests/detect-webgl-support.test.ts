import { test, describe, afterEach } from "node:test";
import assert from "node:assert/strict";
import { detectWebglSupport } from "../src/lib/webgl/detect-webgl-support.ts";

/**
 * `detectWebglSupport()` 단위 테스트 — Hero의 WebGL 실패 대응(2026-08-19)이 실제로
 * canvas context가 `null`인 상황을 올바르게 감지하는지 확인한다.
 *
 * 새 테스트 프레임워크를 추가하지 않는다 — Node 22의 내장 `node:test` +
 * `node --experimental-strip-types`(타입 스트리핑만, 트랜스파일 없음)로 이 저장소의
 * `.ts` 소스를 그대로 실행한다. 실행: `npm test` (`package.json` 참고).
 *
 * `document`는 브라우저 전용 전역이라 Node 테스트 환경에는 원래 존재하지 않는다 —
 * jsdom 같은 무거운 의존성을 추가하는 대신, 이 함수가 실제로 필요로 하는 최소 표면
 * (`document.createElement("canvas")`가 반환하는 객체의 `getContext`)만 가짜로
 * 채워 넣는다. 각 테스트 후 `globalThis.document`를 원래 상태로 되돌려 다른 테스트
 * 파일에 영향을 주지 않는다.
 */

const originalDocument = (globalThis as { document?: unknown }).document;

afterEach(() => {
  (globalThis as { document?: unknown }).document = originalDocument;
});

function stubDocument(getContextImpl: (id: string) => unknown) {
  (globalThis as { document?: unknown }).document = {
    createElement(tag: string) {
      assert.equal(tag, "canvas");
      return { getContext: getContextImpl };
    },
  };
}

describe("detectWebglSupport", () => {
  test("document가 없으면(SSR) false를 반환한다", () => {
    (globalThis as { document?: unknown }).document = undefined;
    assert.equal(detectWebglSupport(), false);
  });

  test("getContext가 모든 조회에서 null을 반환하면 false를 반환한다(WebGL 미지원 시뮬레이션)", () => {
    stubDocument(() => null);
    assert.equal(detectWebglSupport(), false);
  });

  test("webgl2 컨텍스트를 얻을 수 있으면 true를 반환한다", () => {
    stubDocument((id) => (id === "webgl2" ? {} : null));
    assert.equal(detectWebglSupport(), true);
  });

  test("webgl2는 실패하지만 webgl은 성공하면 true를 반환한다(구형 브라우저 폴백)", () => {
    stubDocument((id) => (id === "webgl" ? {} : null));
    assert.equal(detectWebglSupport(), true);
  });

  test("getContext 호출 자체가 예외를 던지면 false를 반환한다(일부 브라우저/확장 조합)", () => {
    stubDocument(() => {
      throw new Error("WebGL context creation blocked");
    });
    assert.equal(detectWebglSupport(), false);
  });
});
