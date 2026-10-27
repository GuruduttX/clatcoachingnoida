import { noidaToppers, otherFormats, programs, topperSlug } from "@/lib/data";
import {
  BATCH_MODES,
  BATCH_SCHEDULES,
  BATCH_SEATS,
  BLOG_CATEGORIES,
  CURRENT_AFFAIRS_CATEGORIES,
  EXAM_RELEVANCE,
  FAQ_CATEGORIES,
  REVIEW_CENTRES,
  STUDY_PLAN_ICONS,
  STUDY_PLAN_INTENSITY,
  TARGET_EXAMS,
  faqCategoryLabel,
} from "./taxonomy";
import { opts, type CollectionConfig, type CollectionKey, type Field } from "./fields";

const faqPairs = (name = "faqs"): Field => ({
  type: "pairs",
  name,
  label: "FAQs",
  itemLabel: "FAQ",
  wide: true,
  keys: [
    { name: "question", label: "Question" },
    { name: "answer", label: "Answer", multiline: true },
  ],
});

const snapshot = (name: string, label: string): Field => ({
  type: "pairs",
  name,
  label,
  itemLabel: "Row",
  wide: true,
  keys: [
    { name: "label", label: "Label", placeholder: "e.g. Duration" },
    { name: "value", label: "Value", placeholder: "e.g. 24 months" },
  ],
});

const seo = (prefix: "" | "meta." = ""): Field[] => [
  {
    type: "text",
    name: prefix ? "meta.title" : "metaTitle",
    label: "SEO title",
    required: true,
    maxLength: 70,
    help: "Shown in Google results. Aim for under 60 characters.",
    wide: true,
  },
  {
    type: "textarea",
    name: prefix ? "meta.description" : "metaDescription",
    label: "SEO description",
    required: true,
    rows: 2,
    maxLength: 170,
    help: "One or two sentences, under 160 characters.",
    wide: true,
  },
];

const courseOptions = [...programs.map((p) => `${p.name} batch`), ...otherFormats.map((f) => f.name)];

export const collections: CollectionConfig[] = [
  {
    key: "blogs",
    label: "Blogs",
    singular: "Blog post",
    model: "Blog",
    description: "Articles for the blog: exam updates, preparation advice and centre news.",
    titleField: "title",
    subtitle: (d) => [d.category, d.readTime ? `${d.readTime} min read` : ""].filter(Boolean).join(" · "),
    imageField: "image",
    filterField: { name: "category", label: "Category", options: opts(BLOG_CATEGORIES) },
    sort: { updatedAt: -1 },
    article: true,
    publicPath: (d) => `/blog/${d.slug}`,
    sections: [
      {
        title: "Basics",
        fields: [
          { type: "text", name: "title", label: "Title", wide: true },
          { type: "slug", name: "slug", label: "URL slug", from: "title" },
          { type: "select", name: "category", label: "Category", options: opts(BLOG_CATEGORIES), required: true },
          { type: "textarea", name: "excerpt", label: "Excerpt", rows: 2, required: true, wide: true, help: "Shown on cards. One or two sentences." },
        ],
      },
      {
        title: "Cover image",
        fields: [
          { type: "image", name: "image", label: "Cover image", folder: "blogs", required: true },
          { type: "text", name: "alt", label: "Image description (alt text)", required: true },
        ],
      },
      {
        title: "Article",
        fields: [
          { type: "textarea", name: "tldr", label: "TL;DR", rows: 2, wide: true, help: "Optional quick answer at the top of the post." },
          { type: "list", name: "keyTakeaways", label: "Key takeaways", itemLabel: "Takeaway", wide: true },
          { type: "richtext", name: "content", label: "Body", required: true, wide: true },
          faqPairs(),
        ],
      },
      {
        title: "SEO & linking",
        fields: [
          ...seo("meta."),
          { type: "list", name: "tags", label: "Tags", itemLabel: "Tag" },
          { type: "list", name: "relatedPostSlugs", label: "Related post slugs", itemLabel: "Slug" },
          { type: "list", name: "sources", label: "Sources (URLs)", itemLabel: "URL", wide: true },
        ],
      },
    ],
  },
  {
    key: "current-affairs",
    label: "Current Affairs",
    singular: "Current affairs article",
    model: "CurrentAffair",
    description: "Exam-focused news explainers with key facts and sources.",
    titleField: "title",
    subtitle: (d) => [d.category, d.eventDate].filter(Boolean).join(" · "),
    imageField: "heroImage.url",
    filterField: { name: "category", label: "Category", options: opts(CURRENT_AFFAIRS_CATEGORIES) },
    sort: { eventDate: -1, updatedAt: -1 },
    article: true,
    publicPath: (d) => `/resources/current-affairs/${d.slug}`,
    sections: [
      {
        title: "Basics",
        fields: [
          { type: "text", name: "title", label: "Headline", wide: true },
          { type: "slug", name: "slug", label: "URL slug", from: "title" },
          { type: "date", name: "eventDate", label: "Event date", required: true },
          { type: "select", name: "category", label: "Category", options: opts(CURRENT_AFFAIRS_CATEGORIES), required: true },
          { type: "multiselect", name: "examRelevance", label: "Relevant for", options: opts(EXAM_RELEVANCE) },
        ],
      },
      {
        title: "Cover image",
        fields: [
          { type: "image", name: "heroImage.url", label: "Image", folder: "current-affairs", required: true },
          { type: "text", name: "heroImage.alt", label: "Image description (alt text)", required: true },
        ],
      },
      {
        title: "Quick read",
        description: "The part most students will read. Keep it short.",
        fields: [
          { type: "textarea", name: "summary", label: "Summary", rows: 3, required: true, wide: true },
          snapshot("keyFacts", "Key facts"),
          { type: "list", name: "keyTakeaways", label: "Exam takeaways", itemLabel: "Takeaway", wide: true },
        ],
      },
      {
        title: "Full story",
        fields: [
          { type: "richtext", name: "content", label: "Body", required: true, wide: true },
          {
            type: "pairs",
            name: "sources",
            label: "Sources",
            itemLabel: "Source",
            required: true,
            wide: true,
            help: "At least one source is needed to publish.",
            keys: [
              { name: "label", label: "Name", placeholder: "e.g. PIB" },
              { name: "url", label: "Link", placeholder: "https://" },
            ],
          },
          faqPairs(),
        ],
      },
      {
        title: "SEO & linking",
        fields: [...seo(), { type: "list", name: "tags", label: "Tags", itemLabel: "Tag" }, { type: "list", name: "relatedSlugs", label: "Related article slugs", itemLabel: "Slug" }],
      },
    ],
  },
  {
    key: "nlu-profiles",
    label: "NLU Profiles",
    singular: "NLU profile",
    model: "University",
    description: "Profiles of National Law Universities: seats, fees, cut-offs and campus facts.",
    titleField: "universityName",
    subtitle: (d) => [d.shortName, (d.location as { city?: string } | undefined)?.city, d.universityRank && `NIRF ${d.universityRank}`].filter(Boolean).join(" · "),
    imageField: "heroImage.url",
    sort: { universityName: 1 },
    publicPath: (d) => `/resources/nlu-profiles/${d.slug}`,
    sections: [
      {
        title: "University",
        fields: [
          { type: "text", name: "universityName", label: "Full name", wide: true },
          { type: "slug", name: "slug", label: "URL slug", from: "universityName" },
          { type: "text", name: "shortName", label: "Short name", placeholder: "e.g. NLSIU" },
          { type: "text", name: "location.city", label: "City", required: true },
          { type: "text", name: "location.country", label: "State / country", required: true, placeholder: "e.g. Karnataka, India" },
          { type: "text", name: "universityRank", label: "NIRF rank", placeholder: "e.g. 1" },
        ],
      },
      {
        title: "Header",
        fields: [
          { type: "text", name: "h1", label: "Page heading", required: true, wide: true },
          { type: "textarea", name: "quickAnswer", label: "Quick answer", rows: 3, required: true, wide: true, help: "Two or three sentences a student can read in ten seconds." },
          { type: "image", name: "heroImage.url", label: "Campus image", folder: "nlu-profiles" },
          { type: "text", name: "heroImage.altText", label: "Image description (alt text)" },
        ],
      },
      {
        title: "At a glance",
        fields: [
          snapshot("atAGlance", "Fact tiles"),
          {
            type: "pairs",
            name: "aiExtractionFacts",
            label: "Verified facts",
            itemLabel: "Fact",
            wide: true,
            keys: [
              { name: "fact", label: "Fact", multiline: true },
              { name: "sourceLabel", label: "Source" },
            ],
          },
        ],
      },
      { title: "Profile", fields: [{ type: "richtext", name: "content", label: "Body", required: true, wide: true }, faqPairs()] },
      {
        title: "SEO",
        fields: [
          ...seo(),
          { type: "text", name: "schemaTitle", label: "Schema title", wide: true },
          { type: "textarea", name: "schemaDescription", label: "Schema description", rows: 2, wide: true },
        ],
      },
    ],
  },
  {
    key: "toppers-strategy",
    label: "Toppers' Strategy",
    singular: "Topper strategy",
    model: "TopperStrategy",
    description: "How Noida toppers prepared, in their own words.",
    titleField: "title",
    subtitle: (d) => {
      const t = noidaToppers.find((x) => topperSlug(x) === d.studentSlug);
      return t ? `${t.name} · AIR ${t.air}` : "";
    },
    sort: { updatedAt: -1 },
    article: true,
    publicPath: (d) => `/resources/toppers-strategy/${d.slug}`,
    sections: [
      {
        title: "Topper",
        fields: [
          { type: "text", name: "title", label: "Title", wide: true },
          { type: "slug", name: "slug", label: "URL slug", from: "title" },
          {
            type: "select",
            name: "studentSlug",
            label: "Student",
            required: true,
            options: noidaToppers.map((t) => ({ value: topperSlug(t), label: `${t.name} · AIR ${t.air}` })),
            help: "Photo, rank and NLU come from the results list.",
          },
        ],
      },
      {
        title: "Quick read",
        fields: [
          { type: "textarea", name: "quickAnswer", label: "In one paragraph", rows: 3, required: true, wide: true },
          snapshot("strategySnapshot", "Strategy at a glance"),
          { type: "list", name: "keyTakeaways", label: "Takeaways", itemLabel: "Takeaway", wide: true },
        ],
      },
      { title: "Full story", fields: [{ type: "richtext", name: "content", label: "Body", required: true, wide: true }, faqPairs()] },
      { title: "SEO & linking", fields: [...seo(), { type: "list", name: "tags", label: "Tags", itemLabel: "Tag" }, { type: "list", name: "relatedStrategySlugs", label: "Related strategy slugs", itemLabel: "Slug" }] },
    ],
  },
  {
    key: "study-plans",
    label: "Study Plans",
    singular: "Study plan",
    model: "StudyPlan",
    description: "Week-by-week preparation plans for each runway.",
    titleField: "title",
    subtitle: (d) => [d.timeline, d.intensity].filter(Boolean).join(" · "),
    sort: { durationMonths: -1, updatedAt: -1 },
    article: true,
    publicPath: (d) => `/resources/study-plan/${d.slug}`,
    sections: [
      {
        title: "Plan card",
        description: "What students see on the study-plan hub.",
        fields: [
          { type: "text", name: "title", label: "Title", wide: true },
          { type: "slug", name: "slug", label: "URL slug", from: "title" },
          { type: "text", name: "bestFor", label: "Best for", required: true, placeholder: "e.g. Class 11 students" },
          { type: "text", name: "timeline", label: "Timeline", required: true, placeholder: "e.g. 24 months" },
          { type: "number", name: "durationMonths", label: "Duration (months)", min: 0 },
          { type: "text", name: "weeklyLoad", label: "Weekly load", required: true, placeholder: "e.g. 8–10 hours" },
          { type: "text", name: "mockCadence", label: "Mock cadence", required: true, placeholder: "e.g. 1 mock every 2 weeks" },
          { type: "number", name: "totalMocks", label: "Total mocks", min: 0 },
          { type: "select", name: "intensity", label: "Intensity", options: opts(STUDY_PLAN_INTENSITY), required: true },
          { type: "select", name: "icon", label: "Icon", options: opts(STUDY_PLAN_ICONS), required: true },
          { type: "multiselect", name: "targetExams", label: "Exams", options: opts(TARGET_EXAMS) },
          { type: "text", name: "programLabel", label: "Matching course", required: true, placeholder: "e.g. Foundation batch" },
          { type: "text", name: "programHref", label: "Course link", required: true, placeholder: "/courses/foundation" },
        ],
      },
      {
        title: "Quick read",
        fields: [
          { type: "textarea", name: "quickAnswer", label: "Quick answer", rows: 3, required: true, wide: true },
          snapshot("planSnapshot", "Plan at a glance"),
          { type: "list", name: "keyTakeaways", label: "Takeaways", itemLabel: "Takeaway", wide: true },
        ],
      },
      { title: "Full plan", fields: [{ type: "richtext", name: "content", label: "Body", required: true, wide: true }, faqPairs()] },
      { title: "SEO & linking", fields: [...seo(), { type: "list", name: "tags", label: "Tags", itemLabel: "Tag" }, { type: "list", name: "relatedPlanSlugs", label: "Related plan slugs", itemLabel: "Slug" }] },
    ],
  },
  {
    key: "faqs",
    label: "FAQs",
    singular: "FAQ",
    model: "Faq",
    description: "Short answers grouped by category for the FAQ section.",
    titleField: "question",
    subtitle: (d) => faqCategoryLabel(String(d.category ?? "")),
    filterField: { name: "category", label: "Category", options: [...FAQ_CATEGORIES] },
    sort: { category: 1, order: 1 },
    publicPath: (d) => `/faq/${d.category}`,
    sections: [
      {
        title: "Question",
        fields: [
          { type: "text", name: "question", label: "Question", maxLength: 240, wide: true },
          { type: "textarea", name: "answer", label: "Answer", rows: 5, maxLength: 900, required: true, wide: true, help: "Keep it under 80 words." },
          { type: "select", name: "category", label: "Category", options: [...FAQ_CATEGORIES], required: true },
          { type: "number", name: "order", label: "Order", min: 0, help: "Lower numbers show first." },
        ],
      },
      {
        title: "Links & verification",
        fields: [
          {
            type: "pairs",
            name: "resources",
            label: "Read next",
            itemLabel: "Link",
            wide: true,
            keys: [
              { name: "label", label: "Label" },
              { name: "href", label: "Link", placeholder: "/courses or https://" },
            ],
          },
          {
            type: "pairs",
            name: "sources",
            label: "Sources",
            itemLabel: "Source",
            wide: true,
            keys: [
              { name: "label", label: "Label" },
              { name: "href", label: "Link", placeholder: "https://" },
            ],
          },
          { type: "date", name: "reviewedAt", label: "Last reviewed", required: true },
          { type: "text", name: "verificationNote", label: "Verification note", maxLength: 300 },
        ],
      },
    ],
  },
  {
    key: "reviews",
    label: "Reviews",
    singular: "Review",
    model: "Review",
    description: "Student and parent reviews. Only publish with consent.",
    titleField: "studentName",
    subtitle: (d) => [d.centre, d.program, d.year].filter(Boolean).join(" · "),
    imageField: "studentImage",
    filterField: { name: "centre", label: "Centre", options: opts(REVIEW_CENTRES) },
    sort: { updatedAt: -1 },
    publicPath: () => "/reviews",
    sections: [
      {
        title: "Reviewer",
        fields: [
          { type: "text", name: "studentName", label: "Name" },
          { type: "boolean", name: "isParentReview", label: "This is a parent's review" },
          { type: "select", name: "centre", label: "Centre", options: opts(REVIEW_CENTRES), required: true },
          { type: "text", name: "program", label: "Course", placeholder: "e.g. CLAT 2027 Finisher Batch" },
          { type: "number", name: "year", label: "Year", min: 2000, max: 2100, required: true },
          { type: "image", name: "studentImage", label: "Photo", folder: "reviews" },
          { type: "text", name: "studentImageAlt", label: "Photo description (alt text)" },
        ],
      },
      {
        title: "Review",
        fields: [
          { type: "textarea", name: "reviewText", label: "Review", rows: 5, required: true, wide: true },
          {
            type: "select",
            name: "rating",
            label: "Rating",
            required: true,
            numeric: true,
            options: ["5", "4", "3", "2", "1"].map((v) => ({ value: v, label: `${v} star${v === "1" ? "" : "s"}` })),
          },
          { type: "text", name: "googleReviewUrl", label: "Google review link", placeholder: "https://" },
        ],
      },
    ],
  },
  {
    key: "batches",
    label: "Batches",
    singular: "Batch",
    model: "Batch",
    description: "Upcoming start dates shown on the batches screen.",
    titleField: "title",
    subtitle: (d) => [d.startDate, d.schedule, d.seats].filter(Boolean).join(" · "),
    sort: { startDate: 1, order: 1 },
    publicPath: () => "/batches",
    sections: [
      {
        title: "Batch",
        fields: [
          { type: "text", name: "title", label: "Name", placeholder: "e.g. CLAT 2027 Target Batch", wide: true },
          { type: "select", name: "course", label: "Course", options: opts(courseOptions), required: true },
          { type: "text", name: "audience", label: "For", placeholder: "e.g. Class 12" },
          { type: "date", name: "startDate", label: "Start date", help: "Leave empty if not announced yet." },
          { type: "select", name: "schedule", label: "Schedule", options: opts(BATCH_SCHEDULES), required: true },
          { type: "text", name: "timing", label: "Timing", placeholder: "e.g. 4:00–7:00 PM" },
          { type: "select", name: "mode", label: "Mode", options: opts(BATCH_MODES), required: true },
          { type: "select", name: "seats", label: "Seats", options: opts(BATCH_SEATS), required: true },
          { type: "text", name: "hours", label: "Total hours", placeholder: "e.g. 800+ hrs" },
          { type: "number", name: "order", label: "Order", min: 0, help: "Lower numbers show first on the same date." },
        ],
      },
    ],
  },
];

export function getCollection(key: string) {
  return collections.find((c) => c.key === key);
}

export const collectionKeys = collections.map((c) => c.key) as CollectionKey[];
