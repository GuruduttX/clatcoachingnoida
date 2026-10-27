import { programs } from "@/lib/data";
import { listPublished } from "@/lib/server/content";
import { destinations, site } from "@/lib/site";

// Plain-text site summary for AI assistants (llmstxt.org).
export async function GET() {
  const [plans, blogs, nlus] = await Promise.all([
    listPublished("study-plans", { select: "title slug" }),
    listPublished("blogs", { select: "title slug", limit: 30 }),
    listPublished("nlu-profiles", { select: "universityName slug" }),
  ]);

  const lines = [
    `# ${site.name}`,
    "",
    "> The Noida centre of LawPrep Tutorial: classroom and online coaching for CLAT, AILET and other law entrance exams, for Class 11, Class 12 and repeat aspirants.",
    "",
    `- Address: ${site.address ?? "Noida, Uttar Pradesh"}`,
    `- Phone: ${site.phone}`,
    `- Email: ${site.email}`,
    `- Office hours: ${site.hours}`,
    `- Part of LawPrep Tutorial Delhi NCR: ${site.parentUrl}`,
    "",
    "## Courses",
    ...programs.map((p) => `- [${p.name}](${site.url}/courses/${p.slug}): ${p.duration} for ${p.audience}. ${p.summary}`),
    "",
    ...destinations.flatMap((group) => [
      `## ${group.group}`,
      ...group.items.map((item) => `- [${item.label}](${site.url}${item.href}): ${item.note}`),
      "",
    ]),
  ];

  if (plans.length) {
    lines.push("## Study plans", ...plans.map((d) => `- [${d.title}](${site.url}/resources/study-plan/${d.slug})`), "");
  }
  if (nlus.length) {
    lines.push("## NLU profiles", ...nlus.map((d) => `- [${d.universityName}](${site.url}/resources/nlu-profiles/${d.slug})`), "");
  }
  if (blogs.length) {
    lines.push("## Recent articles", ...blogs.map((d) => `- [${d.title}](${site.url}/blog/${d.slug})`), "");
  }

  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
