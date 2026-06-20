import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EnquireButtons } from "@/components/EnquireButtons";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/returns-policy")({
  head: () => ({
    meta: [
      { title: `Returns & Reservation Policy — ${SITE.shortName}` },
      {
        name: "description",
        content:
          "Clear returns and reservation policy for roll ends from SR Carpets & Floors, Bradford. Reserve for 48 hours and our promise on faulty stock.",
      },
      { property: "og:title", content: `Returns & Reservation Policy — ${SITE.shortName}` },
      { property: "og:url", content: "/returns-policy" },
    ],
    links: [{ rel: "canonical", href: "/returns-policy" }],
  }),
  component: ReturnsPage,
});

function ReturnsPage() {
  return (
    <div className="container-page py-6 md:py-10">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Returns & Reservations" }]} />

      <article className="prose mt-6 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-black">Returns &amp; Reservations</h1>
        <p className="text-mid mt-2 leading-relaxed">
          Our roll ends and remnants are one-off pieces. Please read this short policy before you
          enquire — it makes the whole process smoother for everyone.
        </p>

        <Section title="Reserving a roll end">
          <p>
            We'll hold any roll end for <strong>up to 48 hours</strong> after you call or email.
            We'll let you know if anyone else has expressed interest so you can decide quickly.
          </p>
        </Section>

        <Section title="Payment & collection">
          <p>
            Roll ends are paid for in store or over the phone. Once paid, we'll wrap the roll for
            click &amp; collect from our Valley Road shop or arrange delivery / fitting at a date
            that works for you.
          </p>
        </Section>

        <Section title="Returns on roll ends">
          <p>
            Because each roll end is a one-off, we don't accept change-of-mind returns. Always
            check the size, colour and feel before you pay — we'll happily set the roll out on the
            shop floor for you.
          </p>
          <p>
            If a roll end is faulty or different to what we described, contact us within{" "}
            <strong>14 days</strong> and we'll replace it or refund it in full.
          </p>
        </Section>

        <Section title="Fitting service">
          <p>
            Fitting is quoted separately. Once fitting starts the carpet is considered accepted —
            we'll always show you the roll before unrolling it in your home.
          </p>
        </Section>

        <Section title="Get in touch">
          <p>
            Questions about a specific roll end or order? Drop us a line at{" "}
            <a href={SITE.emailMailto} className="text-brand font-bold">
              {SITE.email}
            </a>{" "}
            or call <a href={SITE.phoneTel} className="text-brand font-bold">{SITE.phone}</a>.
          </p>
        </Section>

        <div className="mt-8">
          <EnquireButtons />
        </div>
      </article>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-black">{title}</h2>
      <div className="text-charcoal mt-2 leading-relaxed space-y-3">{children}</div>
    </section>
  );
}
