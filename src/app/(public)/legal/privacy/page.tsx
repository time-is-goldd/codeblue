import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Container } from "@/components/common/container";
import { Heading } from "@/components/ui/typography/heading";
import { Text } from "@/components/ui/typography/text";
import { BUSINESS_INFO } from "@/lib/constants/business";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description:
    "코드블루(CodeBlue)가 수집하는 개인정보 항목과 이용 목적, 쿠키·방문 분석 도구, Google AdSense 광고 쿠키, 이용자 권리와 거부 방법을 안내합니다.",
  alternates: {
    canonical: "/legal/privacy",
  },
};

/** 시행일자 — sitemap.ts의 PRIVACY_LAST_MODIFIED와 반드시 일치시킨다. */
const LAST_UPDATED = "2026-10-17";
const PREVIOUS_VERSION = "2026-07-24";

const LIST_CLASS = "flex list-disc flex-col gap-1.5 pl-5 text-body text-brand-text-secondary";
const LINK_CLASS = "text-brand-accent underline-offset-4 hover:underline";

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
      {children}
    </a>
  );
}

function PolicySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <Heading as="h2" size="h3">
        {title}
      </Heading>
      {children}
    </section>
  );
}

/**
 * 개인정보처리방침 — 2026-10-17 전면 보강.
 *
 * 이전 판(2026-07-24)은 문의 폼 수집 항목만 다뤘는데, 실제로는 GA4·Microsoft Clarity가 쿠키 등
 * 방문 정보를 자동 수집하고 있었고(개인정보 보호법상 자동수집장치 고지 누락), Google AdSense
 * 정책이 요구하는 제3자 광고 쿠키 고지·거부 방법도 없었다. 이번 판에서 추가한 항목:
 * 처리위탁·국외 이전(Resend·Vercel), 자동수집장치(GA4·Clarity) 설치·운영 및 거부 방법,
 * 광고(AdSense) 쿠키와 맞춤 광고 거부 방법, 안전성 확보조치, 보호책임자 성명, 권익침해 구제방법.
 *
 * 문의 폼 필드(`lib/validations/contact.schema.ts`)나 사용하는 외부 서비스가 바뀌면 이 문서와
 * 시행일자, sitemap.ts의 날짜를 함께 갱신한다. 텔레그램 알림은 개인정보를 담지 않으므로
 * (`lib/telegram/send-telegram-notification.ts` 원칙) 위탁 대상에 넣지 않는다.
 */
export default function PrivacyPolicyPage() {
  return (
    <Container size="narrow" className="flex flex-col gap-10 py-16 md:py-24">
      <div className="flex flex-col gap-3">
        <Heading as="h1" size="h1">
          개인정보처리방침
        </Heading>
        <Text size="sm" color="tertiary">
          시행일자: {LAST_UPDATED} (이전 시행일자: {PREVIOUS_VERSION})
        </Text>
      </div>

      <Text size="base" color="secondary">
        {BUSINESS_INFO.tradeName}(CodeBlue, 대표 {BUSINESS_INFO.representative}, 이하 &ldquo;운영자&rdquo;)는
        홈페이지 제작 상담과 견적 제공을 위해 필요한 최소한의 개인정보만 처리하며, 「개인정보 보호법」 등 관련
        법령을 지킵니다. 이 방침은 운영자가 운영하는 www.codeblue-official.co.kr과 그 하위 도메인
        서비스(*.codeblue-official.co.kr)에 적용됩니다.
      </Text>

      <PolicySection title="1. 수집하는 개인정보 항목과 수집 방법">
        <Text size="base" color="secondary">
          이용자가 문의 폼을 직접 작성해 제출할 때 다음 정보를 수집합니다.
        </Text>
        <ul className={LIST_CLASS}>
          <li>필수: 이름, 연락처(전화번호), 문의 유형, 문의 내용</li>
          <li>&lsquo;기존 홈페이지 무료 진단&rsquo; 선택 시 필수: 진단받을 홈페이지 주소</li>
          <li>선택: 이메일, 업체명·브랜드명, 관심 있는 요금제</li>
        </ul>
        <Text size="base" color="secondary">
          홈페이지 이용 과정에서 방문 기록, 기기·브라우저 정보, 쿠키 식별자 등이 자동으로 생성·수집될 수 있습니다.
          자세한 내용은 아래 6항과 7항에서 안내합니다.
        </Text>
      </PolicySection>

      <PolicySection title="2. 개인정보의 이용 목적">
        <Text size="base" color="secondary">
          문의 폼으로 받은 정보는 상담 진행, 견적 제공, 회신 연락 목적으로만 사용합니다. 이용자의 동의 없이
          마케팅이나 광고성 정보 발송 등 목적 외 용도로 이용하지 않습니다.
        </Text>
      </PolicySection>

      <PolicySection title="3. 보유 및 이용 기간">
        <Text size="base" color="secondary">
          계약으로 이어지지 않은 문의는 상담 목적 달성 후 최대 1년간 보관한 뒤 지체 없이 파기합니다. 이용자가
          삭제를 요청하면 즉시 파기합니다. 프로젝트 계약이 체결된 경우의 보관 기간은 해당 계약과 관련 법령(예:
          「전자상거래 등에서의 소비자보호에 관한 법률」에 따른 계약·대금결제 기록 5년)에 따릅니다.
        </Text>
      </PolicySection>

      <PolicySection title="4. 개인정보의 제3자 제공">
        <Text size="base" color="secondary">
          운영자는 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만 법령에 따라 수사기관 등이 적법한 절차로
          요청하는 경우는 예외로 합니다.
        </Text>
      </PolicySection>

      <PolicySection title="5. 개인정보 처리위탁 및 국외 이전">
        <Text size="base" color="secondary">
          원활한 서비스 운영을 위해 다음 업체에 처리를 맡기고 있으며, 이 업체들의 서버가 국외에 있어 개인정보가
          국외로 이전될 수 있습니다.
        </Text>
        <ul className={LIST_CLASS}>
          <li>
            Resend, Inc.(미국): 문의 내용을 운영자 이메일로 전달하는 이메일 발송. 이전 항목은 문의 폼 입력 정보이며,
            문의 제출 시 암호화된 네트워크로 전송됩니다.
          </li>
          <li>
            Vercel Inc.(미국): 홈페이지 호스팅과 문의 폼 처리 서버 운영. 문의 제출 시 서버를 거쳐 전송됩니다.
          </li>
        </ul>
        <Text size="base" color="secondary">
          각 업체는 위탁받은 업무 목적으로만 정보를 처리하며, 보유 기간은 위탁 업무가 끝나거나 각 업체의 정책에
          따른 기간까지입니다. 국외 이전을 원하지 않으시면 문의 폼 대신 이메일({BUSINESS_INFO.email})이나
          카카오톡으로 문의하실 수 있습니다.
        </Text>
      </PolicySection>

      <PolicySection title="6. 자동 수집 장치(쿠키 등)의 설치·운영 및 거부">
        <Text size="base" color="secondary">
          운영자는 홈페이지 개선을 위해 방문 통계를 분석하며, 이 과정에서 쿠키 등 자동 수집 장치를 사용합니다.
          쿠키는 웹사이트가 이용자의 브라우저에 저장하는 작은 텍스트 파일입니다.
        </Text>
        <ul className={LIST_CLASS}>
          <li>
            Google Analytics 4(Google LLC): 방문 페이지, 체류 시간, 유입 경로, 기기·브라우저 정보, IP 주소 기반의
            대략적 위치 등 방문 통계
          </li>
          <li>
            Microsoft Clarity(Microsoft Corporation): 클릭·스크롤 등 페이지 이용 행태 분석(히트맵·세션 기록)
          </li>
        </ul>
        <Text size="base" color="secondary">
          수집된 정보는 개인을 직접 식별하는 데 쓰지 않고, 화면 구성 개선과 이용 통계 파악에만 사용합니다. 쿠키
          저장을 원하지 않으시면 브라우저 설정에서 거부할 수 있습니다(예: Chrome은 설정 → 개인정보 보호 및 보안 →
          서드 파티 쿠키). 쿠키를 거부해도 홈페이지 이용에는 지장이 없습니다. Google Analytics 수집만 막으시려면{" "}
          <ExternalLink href="https://tools.google.com/dlpage/gaoptout">Google 애널리틱스 차단 브라우저 부가기능</ExternalLink>을
          설치하실 수 있습니다.
        </Text>
      </PolicySection>

      <PolicySection title="7. 광고(Google AdSense)와 광고 쿠키">
        <Text size="base" color="secondary">
          운영자는 운영하는 하위 도메인 서비스(*.codeblue-official.co.kr)에 Google AdSense 광고를 게재할 수
          있습니다. 이와 관련해 다음 사항을 알려드립니다.
        </Text>
        <ul className={LIST_CLASS}>
          <li>
            Google을 포함한 제3자 공급업체는 쿠키를 사용해 이용자가 이 웹사이트나 다른 웹사이트를 이전에 방문한
            기록을 바탕으로 광고를 게재합니다.
          </li>
          <li>
            Google은 광고 쿠키를 사용해 이용자의 이 사이트 및 인터넷의 다른 사이트 방문 기록을 바탕으로 이용자에게
            맞는 광고를 게재할 수 있습니다.
          </li>
          <li>
            이용자는 <ExternalLink href="https://adssettings.google.com">Google 광고 설정</ExternalLink>에서 맞춤
            광고를 사용하지 않도록 설정할 수 있습니다. 또한{" "}
            <ExternalLink href="https://www.aboutads.info/choices/">www.aboutads.info</ExternalLink>에서 제3자
            공급업체의 맞춤 광고용 쿠키 사용을 거부할 수 있습니다.
          </li>
          <li>
            Google의 광고 데이터 처리 방식은{" "}
            <ExternalLink href="https://policies.google.com/technologies/ads">Google 광고 정책</ExternalLink>에서
            확인하실 수 있습니다.
          </li>
        </ul>
      </PolicySection>

      <PolicySection title="8. 이용자의 권리와 행사 방법">
        <Text size="base" color="secondary">
          이용자는 언제든지 자신의 개인정보에 대해 열람, 정정, 삭제, 처리정지를 요청할 수 있습니다. 아래 보호책임자
          이메일로 요청하시면 본인 확인 후 지체 없이 처리합니다.
        </Text>
      </PolicySection>

      <PolicySection title="9. 개인정보의 파기 절차와 방법">
        <Text size="base" color="secondary">
          보유 기간이 끝났거나 처리 목적이 달성된 개인정보는 지체 없이 파기합니다. 전자 파일은 복구할 수 없는 방법으로
          삭제하며, 출력물이 있는 경우 분쇄하거나 소각합니다.
        </Text>
      </PolicySection>

      <PolicySection title="10. 개인정보의 안전성 확보조치">
        <ul className={LIST_CLASS}>
          <li>문의 폼의 모든 전송 구간을 HTTPS로 암호화합니다.</li>
          <li>개인정보에 접근할 수 있는 사람을 운영자 1인으로 제한합니다.</li>
          <li>문의 접수 알림(텔레그램 등)에는 이름·연락처·문의 내용 등 개인정보를 포함하지 않습니다.</li>
        </ul>
      </PolicySection>

      <PolicySection title="11. 개인정보 보호책임자">
        <Text size="base" color="secondary">
          성명: {BUSINESS_INFO.representative} (대표)
          <br />
          이메일: {BUSINESS_INFO.email}
        </Text>
      </PolicySection>

      <PolicySection title="12. 권익침해 구제 방법">
        <Text size="base" color="secondary">
          개인정보 침해에 대한 신고나 상담이 필요하시면 아래 기관에 문의하실 수 있습니다.
        </Text>
        <ul className={LIST_CLASS}>
          <li>개인정보침해신고센터: privacy.kisa.or.kr / 국번없이 118</li>
          <li>개인정보분쟁조정위원회: www.kopico.go.kr / 1833-6972</li>
          <li>대검찰청 사이버수사과: www.spo.go.kr / 국번없이 1301</li>
          <li>경찰청 사이버수사국: ecrm.police.go.kr / 국번없이 182</li>
        </ul>
      </PolicySection>

      <PolicySection title="13. 개인정보처리방침의 변경">
        <Text size="base" color="secondary">
          이 방침은 법령이나 서비스 변경을 반영해 수정될 수 있으며, 변경 시 시행일자와 함께 이 페이지에 공지합니다.
        </Text>
      </PolicySection>
    </Container>
  );
}
