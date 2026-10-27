import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CheckCircleIcon, GraduationCapIcon, SealCheckIcon } from "@phosphor-icons/react/ssr";
import { Accordion } from "@/components/accordion";
import { EnquireButton } from "@/components/enquire-button";
import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/page-header";
import { PersonPhoto } from "@/components/site/avatar";
import { ReadMoreSheet } from "@/components/site/read-more-sheet";
import { Section } from "@/components/site/section";
import { facultyMembers, getFacultyMemberBySlug, getFacultyProfileBySlug, publicCredential } from "@/lib/faculty";
import { button } from "@/lib/ui";

export function generateStaticParams() {
  return facultyMembers.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: PageProps<"/faculty/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const member = getFacultyMemberBySlug(slug);
  if (!member) return {};
  return {
    title: `${member.name}, ${member.role}`,
    description: member.bio,
    openGraph: member.image.startsWith("http") ? { images: [member.image] } : undefined,
  };
}

const HIDDEN_FACTS = new Set(["Name", "Role"]);

export default function FacultyProfilePage({ params }: PageProps<"/faculty/[slug]">) {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <FacultyProfile params={params} />
    </Suspense>
  );
}

function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse px-4 pt-2 md:grid md:grid-cols-[0.9fr_1.1fr] md:gap-12 md:px-6 md:pt-10">
      <div className="aspect-[4/5] rounded-[28px] bg-mist md:rounded-[36px]" />
      <div className="mt-5 space-y-3 md:mt-0 md:self-end md:pb-4">
        <div className="h-8 w-2/3 rounded-full bg-mist" />
        <div className="h-5 w-1/2 rounded-full bg-mist" />
        <div className="grid grid-cols-2 gap-2.5 pt-2">
          <div className="h-20 rounded-[20px] bg-mist" />
          <div className="h-20 rounded-[20px] bg-mist" />
        </div>
      </div>
    </div>
  );
}

async function FacultyProfile({ params }: { params: PageProps<"/faculty/[slug]">["params"] }) {
  const { slug } = await params;
  const member = getFacultyMemberBySlug(slug);
  const profile = getFacultyProfileBySlug(slug);
  if (!member || !profile) notFound();

  const credential = publicCredential(member);
  const facts = profile.quickFacts.filter((f) => !HIDDEN_FACTS.has(f.label) && !/pending/i.test(f.value));
  const others = facultyMembers.filter((m) => m.slug !== slug).slice(0, 6);

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 pt-2 md:grid md:grid-cols-[0.9fr_1.1fr] md:items-end md:gap-12 md:px-6 md:pt-10">
        <Reveal>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-mist md:rounded-[36px]">
            <PersonPhoto src={member.image} name={member.name} eager sizes="(min-width: 768px) 45vw, 100vw" className="text-[3em]" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/80 to-transparent md:hidden" />
            <div className="absolute inset-x-5 bottom-5 text-white md:hidden">
              <p className="text-[13px] font-bold text-sun">{member.title}</p>
              <h1 className="mt-1 font-display text-[38px] font-bold leading-[0.95] tracking-[-0.04em]">{member.name}</h1>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.06} className="mt-5 md:mt-0 md:pb-4">
          <div className="hidden md:block">
            <p className="text-[13px] font-bold text-brand">{member.title}</p>
            <h1 className="mt-1.5 font-display text-[64px] font-bold leading-[0.95] tracking-[-0.04em]">{member.name}</h1>
          </div>
          <p className="font-display text-[22px] font-bold leading-tight tracking-[-0.02em] md:mt-4 md:text-[26px]">{member.role}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {credential && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-mist px-3.5 py-1.5 text-[13px] font-semibold">
                <GraduationCapIcon size={15} weight="fill" className="text-brand" /> {credential}
              </span>
            )}
            {member.verified && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-mist px-3.5 py-1.5 text-[13px] font-semibold">
                <SealCheckIcon size={15} weight="fill" className="text-emerald-600" /> Verified profile
              </span>
            )}
          </div>

          {facts.length > 0 && (
            <dl className="mt-5 grid grid-cols-2 gap-2.5">
              {facts.map((f) => (
                <div key={f.label} className="rounded-[20px] bg-mist px-4 py-3.5">
                  <dt className="text-[12px] font-semibold text-ink-3">{f.label}</dt>
                  <dd className="mt-1 font-bold leading-snug">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
            <EnquireButton source="other" interest="Not sure yet" className={`${button("primary", "lg")} sm:flex-1`}>
              Book a counselling call
            </EnquireButton>
            <ReadMoreSheet
              label="Read full profile"
              title={member.name}
              description={member.title}
              className={`${button("quiet", "lg")} sm:flex-1`}
              sections={[
                { paragraphs: [profile.heroSummary] },
                { heading: profile.background.title, paragraphs: profile.background.paragraphs },
                { heading: "How the classes run", paragraphs: profile.teaching.paragraphs },
                { heading: profile.whyItMatters.title, paragraphs: profile.whyItMatters.paragraphs },
              ]}
            />
          </div>
        </Reveal>
      </div>

      <Section>
        <Reveal>
          <SectionHeader title="Teaches" />
          <ul className="flex flex-wrap gap-2">
            {member.expertise.map((e) => (
              <li key={e} className="rounded-full border border-line px-4 py-2 text-sm font-semibold">
                {e}
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      {profile.teachingPoints.length > 0 && (
        <Section>
          <Reveal>
            <SectionHeader title="In the classroom" subtitle={profile.teaching.title} />
          </Reveal>
          <Reveal delay={0.06}>
            <ul className="rail -mx-4 scroll-pl-4 gap-3 px-4 md:mx-0 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0">
              {profile.teachingPoints.map((p, i) => (
                <li key={p.title} className="w-[78%] shrink-0 sm:w-[45%] md:w-auto">
                  <div className={`h-full rounded-[24px] p-5 md:p-6 ${i === 0 ? "bg-ink text-white" : "bg-mist"}`}>
                    <CheckCircleIcon size={26} weight="fill" className={i === 0 ? "text-sun" : "text-brand"} />
                    <p className="mt-5 font-display text-[20px] font-bold leading-tight tracking-[-0.02em]">{p.title}</p>
                    <p className={`mt-1.5 text-[15px] leading-relaxed ${i === 0 ? "text-white/70" : "text-ink-2"}`}>{p.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </Section>
      )}

      {profile.faqs.length > 0 && (
        <Section>
          <Reveal>
            <SectionHeader title="Questions" />
            <Accordion items={profile.faqs} />
          </Reveal>
        </Section>
      )}

      <Section className="pb-14 md:pb-28">
        <Reveal>
          <SectionHeader title="More mentors" />
        </Reveal>
        <ul className="rail -mx-4 scroll-pl-4 gap-3 px-4 md:mx-0 md:grid md:grid-cols-6 md:gap-4 md:overflow-visible md:px-0">
          {others.map((m) => (
            <li key={m.slug} className="w-[34%] shrink-0 sm:w-[24%] md:w-auto">
              <Link href={`/faculty/${m.slug}`} className="group block active:scale-[0.96]">
                <span className="relative block aspect-square overflow-hidden rounded-[20px] bg-mist">
                  <PersonPhoto src={m.image} name={m.name} sizes="(min-width: 768px) 15vw, 34vw" />
                </span>
                <span className="mt-2 block truncate text-sm font-bold">{m.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
