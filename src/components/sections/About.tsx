import { Blocks, BrainCircuit, Wrench } from "lucide-react";
import { highlights } from "@/data/profile";
import { Accent, SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";

const pillars = [
  {
    icon: Blocks,
    title: "Build",
    body: "Responsive business and e-commerce websites with WordPress, Elementor, Shopify and hand-written HTML, CSS and JavaScript.",
  },
  {
    icon: Wrench,
    title: "Maintain",
    body: "Keeping live websites healthy: updates, troubleshooting, security, SEO, backups and quality assurance.",
  },
  {
    icon: BrainCircuit,
    title: "Apply AI",
    body: "AI-powered tools and chatbots, prompt engineering, automation and AI-assisted development.",
  },
];

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative py-16 sm:py-24 md:py-36">
      <div className="container-page">
        <SectionHeading
          id="about-title"
          index="01"
          label="About"
          title={
            <>
              Web developer by practice.
              <br /> <Accent>AI engineer by training.</Accent>
            </>
          }
        />

        <div className="mt-10 sm:mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-10">
          <Reveal className="space-y-6 text-pretty text-base leading-relaxed text-fg-muted sm:text-lg lg:col-span-6">
            <p>
              I&apos;m <span className="text-fg">Muhammad Zubair</span>, a developer based in Karachi
              with <span className="text-fg">3+ years of hands-on experience</span> building and
              maintaining responsive websites for businesses and clients.
            </p>
            <p>
              I studied Artificial Intelligence at Dawood University of Engineering and Technology,
              and I bring that into my work through prompt engineering, AI-assisted development and
              automation, using AI where it makes a website or a workflow genuinely better.
            </p>
            <p>
              I learn quickly and keep adopting new tools and technologies as the work demands.
            </p>
          </Reveal>

          <div className="lg:col-span-6">
            <dl className="grid grid-cols-2 overflow-hidden rounded-3xl border border-line">
              {highlights.map((h, i) => (
                <Reveal
                  key={h.label}
                  delay={i * 0.06}
                  className="group relative flex min-h-32 flex-col justify-between gap-5 border-line p-5 transition-colors duration-500 hover:bg-white/[0.025] sm:min-h-44 sm:p-7 [&:nth-child(odd)]:border-r [&:nth-child(-n+2)]:border-b"
                >
                  <dt className="order-2 text-sm leading-snug text-fg-muted">{h.label}</dt>
                  <dd className="order-1 text-[1.6rem] font-semibold leading-none tracking-[-0.04em] text-fg sm:text-[2.6rem]">
                    {h.value}
                  </dd>
                  <span
                    aria-hidden
                    className="absolute right-5 top-5 size-1.5 rounded-full bg-line-strong transition-colors duration-500 group-hover:bg-accent sm:right-7 sm:top-7"
                  />
                </Reveal>
              ))}
            </dl>
          </div>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-3 lg:mt-20">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <article className="card-surface group h-full rounded-3xl p-6 transition-[border-color,transform] sm:p-7 duration-500 ease-out-expo hover:-translate-y-1 hover:border-line-strong">
                <div className="flex items-center justify-between">
                  <span className="grid size-11 place-items-center rounded-2xl border border-line-strong bg-white/[0.03] text-accent-soft transition-colors duration-500 group-hover:border-accent/50">
                    <p.icon aria-hidden className="size-5" strokeWidth={1.6} />
                  </span>
                  <span className="font-mono text-xs text-fg-subtle">0{i + 1}</span>
                </div>
                <h3 className="mt-5 text-xl font-semibold tracking-tight sm:mt-8">{p.title}</h3>
                <p className="mt-3 leading-relaxed text-fg-muted">{p.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
