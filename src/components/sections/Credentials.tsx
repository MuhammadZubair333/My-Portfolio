import { Award, GraduationCap } from "lucide-react";
import { SiCoursera } from "react-icons/si";
import { certifications, education } from "@/data/experience";
import { Accent, SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";

export function Credentials() {
  return (
    <section aria-labelledby="credentials-title" className="relative py-16 sm:py-24 md:py-36">
      <div className="container-page">
        <SectionHeading
          id="credentials-title"
          index="06"
          label="Education & Certifications"
          title={
            <>
              Grounded in <Accent>AI.</Accent>
            </>
          }
        />

        <div className="mt-10 sm:mt-14 grid gap-4 lg:mt-20 lg:grid-cols-12 lg:gap-5">
          <Reveal className="lg:col-span-7">
            <article
              aria-labelledby="education-title"
              className="relative flex h-full flex-col justify-between sm:min-h-[22rem] overflow-hidden rounded-[1.75rem] border border-line bg-gradient-to-br from-ink-800 via-ink-900 to-ink-950 p-6 sm:p-10"
            >
              <div aria-hidden className="hairline-grid absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" />
              <div aria-hidden className="absolute -right-10 -top-10 size-64 rounded-full bg-violet/15 blur-[80px]" />
              <div className="relative flex items-start justify-between gap-4">
                <span className="grid size-12 place-items-center rounded-2xl border border-line-strong bg-white/[0.04] text-accent-soft">
                  <GraduationCap aria-hidden className="size-6" strokeWidth={1.5} />
                </span>
                <span className="rounded-full border border-line px-3 py-1 font-mono text-[0.66rem] uppercase tracking-[0.12em] text-fg-muted">
                  {education.status}
                </span>
              </div>
              <div className="relative mt-8 sm:mt-16">
                <p className="eyebrow">Education · {education.period}</p>
                <h3 id="education-title" className="mt-4 max-w-lg text-balance text-3xl font-semibold leading-[1.1] tracking-[-0.035em] sm:text-4xl">
                  {education.degree}
                </h3>
                <p className="mt-4 text-fg-muted">
                  {education.institution}, {education.city}
                </p>
              </div>
            </article>
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-5">
            <div className="h-full rounded-[1.75rem] border border-line p-6 sm:p-8">
              <p className="eyebrow">Certifications</p>
              <ul className="mt-6 divide-y divide-line">
                {certifications.map((cert) => (
                  <li key={cert.title} className="flex items-start gap-4 py-5 first:pt-0 last:pb-0">
                    <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl border border-line bg-white/[0.03] text-fg-muted">
                      {cert.issuer === "Coursera" ? (
                        <SiCoursera aria-hidden className="size-4" />
                      ) : (
                        <Award aria-hidden className="size-4" strokeWidth={1.6} />
                      )}
                    </span>
                    <div>
                      <h3 className="font-medium leading-snug text-fg">{cert.title}</h3>
                      {cert.issuer && <p className="mt-1 text-sm text-fg-subtle">{cert.issuer}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
