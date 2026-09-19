import { Building2, Code2, LayoutTemplate, ShoppingBag, Users } from "lucide-react";
import { SiShopify } from "react-icons/si";
import { clientWork } from "@/data/experience";
import { Accent, SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";

const serviceIcons = [Building2, ShoppingBag, LayoutTemplate, SiShopify, Code2];

export function ClientWork() {
  return (
    <section aria-labelledby="clients-title" className="relative py-16 sm:py-24 md:py-36">
      <div className="container-page">
        <SectionHeading
          id="clients-title"
          index="04"
          label="Client Work"
          title={
            <>
              Built around each client&apos;s <Accent>needs.</Accent>
            </>
          }
          intro={`Since ${clientWork.since} I've worked directly with individual clients as a freelance web developer. Every project starts with what the client needs, and the website is shaped around it.`}
        />

        <div className="mt-10 sm:mt-14 grid gap-4 lg:mt-20 lg:grid-cols-12 lg:gap-5">
          <Reveal className="lg:col-span-5">
            <article className="relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-line bg-gradient-to-b from-ink-800 to-ink-900 p-6 sm:p-8">
              <div aria-hidden className="absolute -right-24 -top-24 size-72 rounded-full bg-accent/15 blur-[80px]" />
              <span className="relative grid size-12 place-items-center rounded-2xl border border-line-strong bg-white/[0.04] text-accent-soft">
                <Users aria-hidden className="size-5" strokeWidth={1.6} />
              </span>
              <h3 className="relative mt-8 text-2xl font-semibold tracking-[-0.03em]">What I build for clients</h3>
              <p className="relative mt-2 text-fg-muted">
                Tailored to each business, from a simple company site to a full online store.
              </p>
              <ul className="relative mt-8 divide-y divide-line border-y border-line">
                {clientWork.services.map((s, i) => {
                  const Icon = serviceIcons[i % serviceIcons.length];
                  return (
                    <li key={s} className="flex items-center gap-4 py-3.5">
                      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent-soft ring-1 ring-inset ring-accent/20">
                        <Icon aria-hidden className="size-4" />
                      </span>
                      <span className="font-medium text-fg">{s}</span>
                    </li>
                  );
                })}
              </ul>
            </article>
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-7">
            <div className="card-surface h-full rounded-[1.75rem] p-6 sm:p-8">
              <p className="eyebrow">How a project runs</p>
              <ol className="mt-6">
                {clientWork.process.map((p, i) => (
                  <li
                    key={p.step}
                    className="group grid grid-cols-[auto_1fr] gap-x-5 border-b border-line py-5 first:pt-2 last:border-b-0 last:pb-0 sm:grid-cols-[auto_12rem_1fr] sm:items-baseline"
                  >
                    <span className="font-mono text-sm text-accent-soft">0{i + 1}</span>
                    <h3 className="text-lg font-semibold tracking-[-0.02em] text-fg">{p.step}</h3>
                    <p className="col-start-2 mt-1 leading-relaxed text-fg-muted sm:col-start-3 sm:mt-0">{p.detail}</p>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
