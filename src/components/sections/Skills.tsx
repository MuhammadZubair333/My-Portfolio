import { skillGroups, type Skill, type SkillGroup } from "@/data/skills";
import { cn } from "@/lib/cn";
import { Accent, SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";

/** Brand logos sit on their brand-colour tile; generic concepts get a soft accent tile. */
function SkillIcon({ skill, size = "md" }: { skill: Skill; size?: "sm" | "md" }) {
  if (!skill.icon) return null;
  const Icon = skill.icon;
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
        size === "md" ? "size-9 rounded-xl sm:size-10" : "size-8 rounded-lg",
        !skill.brand && "bg-accent/12 text-accent-soft ring-1 ring-inset ring-accent/25",
      )}
      style={skill.brand ? { backgroundColor: skill.brand.bg, color: skill.brand.fg } : undefined}
    >
      <Icon aria-hidden className={size === "md" ? "size-5" : "size-4"} />
    </span>
  );
}

function PrimaryGroup({ group, index }: { group: SkillGroup; index: number }) {
  return (
    <article
      aria-labelledby={`skills-${group.id}`}
      className="card-surface relative h-full overflow-hidden rounded-[1.75rem] p-6 sm:p-8"
    >
      <div aria-hidden className="absolute -right-20 -top-20 size-56 rounded-full bg-accent/10 blur-[70px]" />
      <div className="relative flex items-center justify-between">
        <p className="eyebrow">{group.kicker}</p>
        <span className="font-mono text-xs text-fg-subtle">0{index + 1}</span>
      </div>
      <h3 id={`skills-${group.id}`} className="relative mt-4 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
        {group.title}
      </h3>
      <p className="relative mt-2 max-w-md text-fg-muted">{group.description}</p>

      <ul className="relative mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {group.skills.map((skill) => (
          <li
            key={skill.name}
            className="group flex min-h-[3.75rem] items-center gap-3 rounded-2xl sm:min-h-[5.5rem] sm:flex-col sm:items-start sm:justify-between border border-line bg-ink-950/40 p-2.5 transition-[border-color,background-color,transform] sm:p-3.5 duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:bg-white/[0.03]"
          >
            <SkillIcon skill={skill} />
            <span className="text-[0.8rem] font-medium leading-tight text-fg sm:text-[0.84rem]">{skill.name}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function SupportingGroup({ group }: { group: SkillGroup }) {
  return (
    <article aria-labelledby={`skills-${group.id}`} className="h-full rounded-[1.75rem] border border-line p-6 sm:p-8">
      <p className="eyebrow">{group.kicker}</p>
      <h3 id={`skills-${group.id}`} className="mt-4 text-xl font-semibold tracking-[-0.02em]">
        {group.title}
      </h3>
      <p className="mt-1.5 text-sm text-fg-muted">{group.description}</p>
      <ul className="mt-6 divide-y divide-line border-y border-line">
        {group.skills.map((skill) => (
          <li key={skill.name} className="flex items-center gap-3 py-2.5 text-sm">
            <SkillIcon skill={skill} size="sm" />
            <span className="text-fg">{skill.name}</span>
            {skill.note && (
              <span className="ml-auto rounded-full border border-line px-2 py-0.5 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-fg-subtle">
                {skill.note}
              </span>
            )}
          </li>
        ))}
      </ul>
    </article>
  );
}

export function Skills() {
  const primary = skillGroups.filter((g) => g.tier === "primary");
  const supporting = skillGroups.filter((g) => g.tier === "supporting");

  return (
    <section id="skills" aria-labelledby="skills-title" className="relative py-16 sm:py-24 md:py-36">
      <div className="container-page">
        <SectionHeading
          id="skills-title"
          index="05"
          label="Skills"
          title={
            <>
              Tools I <Accent>work with.</Accent>
            </>
          }
          intro="Web development and AI are the core of my work. Everything else supports them."
        />

        <div className="mt-10 sm:mt-14 grid gap-4 lg:mt-20 lg:grid-cols-2 lg:gap-5">
          {primary.map((g, i) => (
            <Reveal key={g.id} delay={i * 0.08} className="h-full">
              <PrimaryGroup group={g} index={i} />
            </Reveal>
          ))}
          {supporting.map((g, i) => (
            <Reveal key={g.id} delay={i * 0.08} className="h-full">
              <SupportingGroup group={g} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
