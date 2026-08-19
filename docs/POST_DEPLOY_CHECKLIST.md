# CodeBlue 배포 후 체크리스트

배포 직전/직후 사용자가 직접 확인해야 하는 항목입니다. `docs/PRE_DEPLOY_AUDIT_REPORT.md`의 "잔여 위험"/"최종 판정" 조건과 연결됩니다.

## 배포 직전 (필수)

- [x] `next@16.3.1`로 업그레이드 완료 (PRE_DEPLOY_AUDIT_REPORT P0-1 — Server Actions SSRF/DoS 등 HIGH 취약점 패치, 메이저 버전 변경 아님) — `npm audit` 0 vulnerabilities 확인, `npm run lint`/`npx tsc --noEmit`/`npm test`/`npm run build` 전부 재검증 완료
- [ ] Hero 3D(캔버스 렌더링), 문의 폼 제출, Kakao 링크가 실제 배포 도메인에서도 정상 동작하는지 최종 확인

## 도메인 / HTTPS / redirect

- [ ] Vercel 프로젝트에 실제 운영 도메인(`codeblue-official.co.kr`) 연결 완료
- [ ] `www.codeblue-official.co.kr` 접속 시 정규 도메인으로 리다이렉트되는지(또는 반대로) 확인 — 어느 쪽이 정규인지는 사업자가 결정
- [ ] `http://` 접속 시 `https://`로 자동 리다이렉트되는지 확인
- [ ] HSTS 적용 여부를 실제 배포 도메인에서 `curl -sI`로 확인 (`Strict-Transport-Security` 헤더)
- [ ] (선택, 되돌리기 어려운 결정이므로 신중히) HSTS preload 목록(hstspreload.org) 등록 여부 결정

## robots / sitemap / 색인

- [ ] 실제 배포 도메인에서 `/robots.txt`가 열리고 `Sitemap:` 줄이 올바른 절대 URL을 가리키는지 확인
- [ ] 실제 배포 도메인에서 `/sitemap.xml`이 열리고 `/`, `/legal/privacy`, `/legal/terms` 3개 URL이 모두 실제 배포 도메인 기준으로 200 응답인지 확인
- [ ] Google Search Console에 속성 등록 및 sitemap 제출
- [ ] Search Console에서 실제 URL(`/`) 색인 검사(URL 검사 도구) 실행
- [ ] Naver 서치어드바이저에도 동일하게 등록(이미 코드에 `naver-site-verification` 메타 태그 존재 — `src/lib/seo/metadata.ts`)

## 소셜 공유 미리보기

- [ ] 카카오톡 채팅방에 실제 배포 URL을 붙여넣어 OG 이미지/제목/설명 미리보기 정상 노출 확인
- [ ] (선택) Facebook Sharing Debugger, Twitter Card Validator 등으로 캐시 강제 갱신 확인

## GA4 / Clarity

- [ ] GA4 실시간 보고서에서 실제 배포 도메인 접속 시 유입이 잡히는지 확인
- [ ] Microsoft Clarity 대시보드에서 세션 리코딩이 실제로 쌓이는지 확인
- [ ] 아래 CTA 이벤트가 GA4 실시간/DebugView에서 정상 발생하는지 각각 확인:
  - [ ] Hero CTA 클릭 → `consult` (`cta_location: hero`)
  - [ ] 가격 카드 CTA 클릭 → `consult` (`plan` 값 포함)
  - [ ] 가격 하단 카카오 CTA → `consult`
  - [ ] 가격 하단 무료 진단 CTA → `diagnosis`
  - [ ] 후기 아래 무료 진단 배너 → `diagnosis`
  - [ ] 문의 폼 실제 제출 성공 → `contact_submit` (버튼 클릭이 아니라 성공 시에만 발생하는지 확인)
  - [ ] FloatingCta/MobileFixedCta/Contact 섹션 카카오 버튼 → `kakao_click`
  - [ ] 대표소개 이메일 클릭 → `email_click`
- [ ] 개발/로컬 환경에서 발생한 이벤트가 운영 GA4 속성에 섞이지 않았는지 확인(코드상 `NODE_ENV !== "production"`이면 아예 전송 안 되도록 되어 있음 — 실제 배포 환경변수도 맞는지 확인)

## 문의 폼 — 실제 왕복 테스트 (필수, 감사에서 의도적으로 미실행)

pre-deploy 감사에서는 실제 운영자 이메일/Telegram으로 스팸성 테스트 알림이 반복 발송되는 것을 피하기 위해 서버 왕복(실제 제출)을 트리거하지 않았습니다. 배포 전 아래를 **직접** 확인하세요.

- [ ] "새 홈페이지 제작 상담" 유형으로 실제 테스트 데이터 1건 제출
  - [ ] 관리자 이메일(`CONTACT_NOTIFICATION_EMAIL`)에 알림 도착 확인, 문의 유형/이름/연락처/내용 정상 표시
  - [ ] Telegram으로 알림 도착 확인(문의 유형/CTA 위치만, 개인정보 없이)
- [ ] "기존 홈페이지 무료 진단" 유형으로 실제 테스트 데이터 1건 제출(홈페이지 주소 포함)
  - [ ] 이메일에 "홈페이지 주소" 필드가 정상 포함되는지 확인
  - [ ] Telegram 알림 정상 도착 확인
- [ ] 두 테스트 모두 제출 후 폼이 정상적으로 비워지고 성공 메시지가 보이는지 확인
- [ ] (선택) 환경변수를 일시적으로 잘못된 값으로 바꿔 서버 오류 상황을 재현 — 사용자가 입력한 이름/연락처/문의 내용이 사라지지 않고 그대로 남아있는지, 에러 메시지가 내부 정보(스택/토큰)를 노출하지 않는지 확인 후 원래 값으로 복구

## 모바일 실제 기기

- [ ] iOS Safari에서 Hero/헤더/모바일 메뉴/문의 폼 확인
- [ ] Android Chrome에서 동일 확인
- [ ] 노치/Dynamic Island 기기에서 상단 안전영역(status bar) 겹침 없는지 확인
- [ ] "홈 화면에 추가"(PWA) 후 아이콘/실행 화면 정상인지 확인

## 성능

- [ ] PageSpeed Insights(실제 배포 URL)로 모바일/데스크톱 각각 측정 — 이 감사에서는 Lighthouse CLI 실행이 차단되어 랩 환경 CDP 계측(LCP 2188ms, CLS 0)만 기록했습니다. 실제 배포 도메인 기준 재측정 권장
- [ ] Search Console의 Core Web Vitals 리포트를 몇 주 후 확인(실사용자 데이터, INP 포함)

## 오류 페이지

- [ ] 실제 배포 도메인에서 존재하지 않는 URL 접속 시 새로 추가된 브랜드 404 페이지가 노출되는지 확인 (`src/app/not-found.tsx`)
- [ ] "홈으로 돌아가기" 링크 정상 동작 확인

## 법적 페이지

- [ ] 개인정보처리방침 최신화 여부 결정 — 실제 코드가 수집하는 `websiteUrl`/문의유형/CTA위치, Telegram 알림, GA4/Microsoft Clarity 사용을 반영할지 판단(PRE_DEPLOY_AUDIT_REPORT P1-4 참고)
- [ ] 이용약관 내용이 실제 운영 방식과 맞는지 최종 확인
