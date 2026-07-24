import type { Metadata } from "next";
import { Container } from "@/components/common/container";
import { Heading } from "@/components/ui/typography/heading";
import { Text } from "@/components/ui/typography/text";
import { CONTACT_INFO_DATA } from "@/lib/data/contact.data";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "CodeBlue 문의 폼이 수집하는 개인정보 항목, 이용 목적, 보유 기간과 이용자 권리를 안내합니다.",
  alternates: {
    canonical: "/legal/privacy",
  },
};

const LAST_UPDATED = "2026-07-24";

/**
 * 1인 운영, 사업자등록 전, 문의 폼(이름/연락처/이메일 수집, 상담·견적 목적)이라는
 * 현재 실제 운영 형태에 맞춘 최소 분량 개인정보처리방침. `inquirySchema`
 * (`lib/validations/contact.schema.ts`)가 수집하는 필드와 1:1로 대응해야 하므로,
 * 폼 필드가 바뀌면 이 문서도 함께 갱신한다.
 */
export default function PrivacyPolicyPage() {
  return (
    <Container size="narrow" className="flex flex-col gap-10 py-16 md:py-24">
      <div className="flex flex-col gap-3">
        <Heading as="h1" size="h1">
          개인정보처리방침
        </Heading>
        <Text size="sm" color="tertiary">
          시행일자: {LAST_UPDATED}
        </Text>
      </div>

      <Text size="base" color="secondary">
        CodeBlue({CONTACT_INFO_DATA.companyName}, 이하 &ldquo;운영자&rdquo;)는 홈페이지 제작 상담 및
        견적 제공을 위해 문의 폼을 통해 최소한의 개인정보를 수집합니다. 운영자는 현재 1인으로
        운영되는 사업 형태이며, 아래 내용에 따라 개인정보를 처리합니다.
      </Text>

      <section className="flex flex-col gap-3">
        <Heading as="h2" size="h3">
          1. 수집하는 개인정보 항목
        </Heading>
        <Text size="base" color="secondary">
          문의 폼 제출 시 다음 정보를 수집합니다.
        </Text>
        <ul className="flex list-disc flex-col gap-1.5 pl-5 text-body text-brand-text-secondary">
          <li>필수: 이름, 연락처(전화번호), 문의 내용</li>
          <li>선택: 이메일, 회사명</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <Heading as="h2" size="h3">
          2. 수집 및 이용 목적
        </Heading>
        <Text size="base" color="secondary">
          수집한 정보는 문의에 대한 상담 진행 및 견적 제공, 그리고 회신을 위한 연락 목적으로만
          사용합니다. 마케팅, 광고성 정보 발송 등 수집 목적 외의 용도로는 이용하지 않습니다.
        </Text>
      </section>

      <section className="flex flex-col gap-3">
        <Heading as="h2" size="h3">
          3. 보유 및 이용 기간
        </Heading>
        <Text size="base" color="secondary">
          상담 및 견적 제공 목적이 달성된 후, 별도 프로젝트 계약으로 이어지지 않는 문의 건은
          최대 1년간 보관 후 지체 없이 파기합니다. 이용자가 삭제를 요청하는 경우 그 즉시
          파기합니다. 실제 프로젝트 계약이 체결된 경우의 정보 보관은 해당 계약에서 별도로
          정합니다.
        </Text>
      </section>

      <section className="flex flex-col gap-3">
        <Heading as="h2" size="h3">
          4. 개인정보의 제3자 제공 및 처리위탁
        </Heading>
        <Text size="base" color="secondary">
          운영자는 수집한 개인정보를 제3자에게 제공하지 않습니다. 다만 문의 내용을 운영자
          이메일로 전달하기 위해 이메일 발송 서비스(Resend)를 이용하며, 해당 서비스는 이메일
          전송 처리 목적으로만 접근할 수 있습니다.
        </Text>
      </section>

      <section className="flex flex-col gap-3">
        <Heading as="h2" size="h3">
          5. 이용자의 권리
        </Heading>
        <Text size="base" color="secondary">
          이용자는 언제든지 자신의 개인정보에 대한 열람, 정정, 삭제를 요청할 수 있습니다.
          아래 연락처로 요청해주시면 지체 없이 처리합니다.
        </Text>
      </section>

      <section className="flex flex-col gap-3">
        <Heading as="h2" size="h3">
          6. 개인정보 보호책임자
        </Heading>
        <Text size="base" color="secondary">
          운영자(대표) 본인이 개인정보 관련 문의를 직접 처리합니다.
          <br />
          이메일: {CONTACT_INFO_DATA.email}
        </Text>
      </section>

      <section className="flex flex-col gap-3">
        <Heading as="h2" size="h3">
          7. 고지의 의무
        </Heading>
        <Text size="base" color="secondary">
          이 개인정보처리방침은 법령, 서비스 변경 사항을 반영하기 위해 수정될 수 있으며, 변경
          시 이 페이지를 통해 공지합니다.
        </Text>
      </section>
    </Container>
  );
}
