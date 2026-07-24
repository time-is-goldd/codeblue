// Pretendard Variable 서브셋 생성 스크립트 — DEVELOPMENT_PLAN.md Phase 10B(Performance & Core
// Web Vitals), SEO_PLAN.md 9.4에서 예고된 작업.
//
// 실측(Lighthouse `total-byte-weight`): 원본 `PretendardVariable.woff2`가 2,058,289 bytes로
// 페이지 전체에서 가장 무거운 단일 리소스였다(2번째로 큰 JS 청크의 8배 이상). 전체 한글
// 음절(11,172자) + 여러 스크립트를 담고 있지만, 이 사이트가 실제로 렌더링하는 글자는 훨씬
// 적다 — 사용 중인 글자만 골라 서브셋하면 파일이 크게 줄어든다.
//
// 사용법: `node scripts/subset-font.mjs`
// 이 스크립트는 `src/**/*.{ts,tsx}` 전체를 스캔해 등장하는 모든 문자(코드/주석 포함,
// 안전하게 넉넉히 잡음)를 모아 `PretendardVariable.woff2`(원본, 보존)에서
// `PretendardVariable.subset.woff2`(신규, 실제 로드 대상)를 생성한다. 가변 폰트의
// 굵기(weight) 축은 건드리지 않는다(`layout.tsx`가 `weight: "45 920"` 전체 범위를 그대로
// 사용하므로 글자 커버리지만 줄인다).
//
// ⚠️ 새 한글 문구를 추가한 뒤에는 이 스크립트를 다시 실행해야 새 글자가 폰트에 포함된다
// (실행하지 않으면 서브셋에 없는 글자는 대체 폰트로 폴백되어 화면에서 어긋나 보일 수 있다).

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import subsetFont from "subset-font";

const projectRoot = fileURLToPath(new URL("..", import.meta.url));
const srcDir = join(projectRoot, "src");
const fontDir = join(projectRoot, "src/assets/fonts");
const sourceFont = join(fontDir, "PretendardVariable.woff2");
const outputFont = join(fontDir, "PretendardVariable.subset.woff2");

function collectFiles(dir, exts, files = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".next") continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      collectFiles(full, exts, files);
    } else if (exts.includes(extname(entry))) {
      files.push(full);
    }
  }
  return files;
}

const files = collectFiles(srcDir, [".ts", ".tsx"]);
const charSet = new Set();
for (const file of files) {
  const content = readFileSync(file, "utf-8");
  for (const ch of content) charSet.add(ch);
}
// 폰트 자체가 렌더링에 필요로 하는 기본 문자(공백류)를 안전하게 포함시킨다.
[" ", " ", "\n", "\t"].forEach((ch) => charSet.add(ch));

const text = [...charSet].join("");
console.log(`[subset-font] scanned ${files.length} files, ${charSet.size} unique characters`);

const original = readFileSync(sourceFont);
const subsetBuffer = await subsetFont(original, text, { targetFormat: "woff2" });

writeFileSync(outputFont, subsetBuffer);

const originalSize = original.byteLength;
const subsetSize = subsetBuffer.byteLength;
const reduction = (((originalSize - subsetSize) / originalSize) * 100).toFixed(1);
console.log(
  `[subset-font] ${originalSize.toLocaleString()} bytes -> ${subsetSize.toLocaleString()} bytes (-${reduction}%)`,
);
console.log(`[subset-font] wrote ${outputFont}`);
