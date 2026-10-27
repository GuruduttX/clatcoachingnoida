// Option lists shared by the admin forms, the Mongoose models and the public filters.

export const REVIEW_CENTRES = ["Noida", "Hauz Khas", "GTB Nagar", "Gurugram", "Ghaziabad", "Online Live"] as const;

export const BLOG_CATEGORIES = [
  "CLAT Preparation",
  "Exam Updates",
  "Legal Reasoning",
  "Logical Reasoning",
  "English",
  "GK & Current Affairs",
  "Quantitative Techniques",
  "NLUs & Careers",
  "Noida Centre",
] as const;

export const CURRENT_AFFAIRS_CATEGORIES = [
  "Polity & Governance",
  "Legal & Judiciary",
  "Economy & Banking",
  "International Relations",
  "Environment & Ecology",
  "Science & Technology",
  "Government Schemes & Policies",
  "Awards & Honours",
  "Appointments",
  "Reports, Indices & Rankings",
  "Defence & Security",
  "Sports",
  "Art, Culture & History",
  "Books & Authors",
  "Persons in News & Obituaries",
  "National & State Affairs",
  "Important Days & Themes",
] as const;

export const EXAM_RELEVANCE = ["CLAT", "AILET", "CUET", "Other OLETs"] as const;

export const STUDY_PLAN_INTENSITY = ["Foundation", "Balanced", "Intensive"] as const;
export const STUDY_PLAN_ICONS = ["calendar", "book", "target", "zap"] as const;
export const TARGET_EXAMS = ["CLAT", "AILET"] as const;

export const FAQ_CATEGORIES = [
  { value: "clat-basics", label: "CLAT basics" },
  { value: "exam-pattern", label: "Pattern & scoring" },
  { value: "eligibility-registration", label: "Eligibility & registration" },
  { value: "nlus-counselling", label: "NLUs & counselling" },
  { value: "preparation", label: "Preparation" },
  { value: "noida-centre", label: "Noida centre & courses" },
] as const;

export type FaqCategory = (typeof FAQ_CATEGORIES)[number]["value"];

export function faqCategoryLabel(value: string) {
  return FAQ_CATEGORIES.find((c) => c.value === value)?.label ?? "FAQ";
}

export const BATCH_SCHEDULES = ["Weekday", "Weekend"] as const;
export const BATCH_MODES = ["Classroom", "Online Live", "Classroom + Online"] as const;
export const BATCH_SEATS = ["Open", "Filling fast", "Waitlist", "Closed"] as const;

export const AUTHOR = { name: "Anand Sharma", role: "Academic Lead" } as const;
