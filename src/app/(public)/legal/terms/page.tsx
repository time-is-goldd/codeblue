import type { Metadata } from "next";
import { Container } from "@/components/common/container";
import { Heading } from "@/components/ui/typography/heading";
import { Text } from "@/components/ui/typography/text";
import { CONTACT_INFO_DATA } from "@/lib/data/contact.data";

export const metadata: Metadata = {
  title: "이용약관",
  description: "CodeBlue 홈페이지와 문의 폼 이용에 관한 이용자와 운영자의 권리·의무를 안내합니다.",
  alternates: {
    canonical: "/legal/terms",
  },
};

const LAST_UPDATED = "2026-07-24";

/**
 * 이 약관은 홈페이지(문의 폼) 이용 범위만 다룬다. 실제 제작 계약의 결제/일정/저작권 등
 * 세부 조건은 프로젝트별 별도 계약서에서 정한다 — 1인 사업자·사업자등록 전이라는 현재
 * 운영 형태에서 아직 확정되지 않은 내용을 약관에 미리 못박지 않기 위함이다.
 */
export default function TermsOfServicePage() {
  return (
    <Container size="narrow" className="flex flex-col gap-10 py-16 md:py-24">
      <div className="flex flex-col gap-3">
        <Heading as="h1" size="h1">
          이용약관
        </Heading>
        <Text size="sm" color="tertiary">
          시행일자: {LAST_UPDATED}
        </Text>
      </div>

      <section className="flex flex-col gap-3">
        <Heading as="h2" size="h3">
          1. 목적
        </Heading>
        <Text size="base" color="secondary">
          이 약관은 {CONTACT_INFO_DATA.companyName}(이하 &ldquo;운영자&rdquo;)가 제공하는
          홈페이지 및 문의 폼 이용과 관련하여, 운영자와 이용자 간의 권리와 의무를 정하는
          것을 목적으로 합니다.
        </Text>
      </section>

      <section className="flex flex-col gap-3">
        <Heading as="h2" size="h3">
          2. 서비스의 내용
        </Heading>
        <Text size="base" color="secondary">
          이 홈페이지는 웹사이트 제작 관련 정보를 안내하고, 문의 폼을 통해 상담 및 견적 요청을
          받는 창구를 제공합니다. 실제 웹사이트 제작 서비스는 문의 이후 별도 협의를 거쳐
          진행되며, 결제·제작 범위·일정·결과물의 권리 관계 등 구체적인 조건은 프로젝트별
          계약서를 통해 별도로 정합니다.
        </Text>
      </section>

      <section className="flex flex-col gap-3">
        <Heading as="h2" size="h3">
          3. 이용자의 의무
        </Heading>
        <Text size="base" color="secondary">
          이용자는 문의 폼 제출 시 정확한 정보를 제공해야 하며, 허위 정보 제공으로 인해 상담
          및 견적 진행에 지장이 발생할 수 있습니다. 이용자는 이 홈페이지를 부정한 목적으로
          이용하거나 타인의 정보를 도용해서는 안 됩니다.
        </Text>
      </section>

      <section className="flex flex-col gap-3">
        <Heading as="h2" size="h3">
          4. 운영자의 의무
        </Heading>
        <Text size="base" color="secondary">
          운영자는 접수된 문의에 대해 성실하게 답변하며, 문의 과정에서 수집한 개인정보를
          개인정보처리방침에 따라 안전하게 관리합니다.
        </Text>
      </section>

      <section className="flex flex-col gap-3">
        <Heading as="h2" size="h3">
          5. 지식재산권
        </Heading>
        <Text size="base" color="secondary">
          이 홈페이지에 게시된 텍스트, 이미지, 디자인 등 모든 콘텐츠에 대한 저작권은 운영자에게
          있으며, 사전 동의 없이 무단으로 복제, 배포, 사용할 수 없습니다.
        </Text>
      </section>

      <section className="flex flex-col gap-3">
        <Heading as="h2" size="h3">
          6. 면책조항
        </Heading>
        <Text size="base" color="secondary">
          운영자는 천재지변, 통신 장애 등 운영자의 귀책사유가 없는 경우로 인해 발생한 서비스
          제공 지연 또는 중단에 대해 책임을 지지 않습니다.
        </Text>
      </section>

      <section className="flex flex-col gap-3">
        <Heading as="h2" size="h3">
          7. 약관의 변경
        </Heading>
        <Text size="base" color="secondary">
          이 약관은 필요한 경우 개정될 수 있으며, 개정 시 이 페이지를 통해 공지합니다.
        </Text>
      </section>

      <section className="flex flex-col gap-3">
        <Heading as="h2" size="h3">
          8. 문의
        </Heading>
        <Text size="base" color="secondary">
          이 약관에 대한 문의는 아래 연락처로 해주시기 바랍니다.
          <br />
          이메일: {CONTACT_INFO_DATA.email}
        </Text>
      </section>
    </Container>
  );
}
