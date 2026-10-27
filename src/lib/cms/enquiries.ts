// Shared by the Enquiry model, the public form and the admin inbox.
export const ENQUIRY_SOURCES = [
  "enquiry-sheet",
  "visit",
  "scholarship",
  "admissions",
  "course",
  "batches",
  "article",
  "study-planner",
  "results",
  "faculty",
  "other",
] as const;

export const ENQUIRY_SOURCE_LABELS: Record<string, string> = {
  "enquiry-sheet": "Enquiry button",
  visit: "Visit page",
  scholarship: "Scholarship",
  admissions: "Admissions",
  course: "Course page",
  batches: "Batches",
  article: "Article / resource",
  "study-planner": "Study planner",
  results: "Results page",
  faculty: "Faculty page",
  other: "Website",
};

export const ENQUIRY_STATUSES = ["new", "contacted", "converted", "closed"] as const;
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

export const STAGES = ["Class 10", "Class 11", "Class 12", "Repeat attempt"];
export const INTERESTS = ["Foundation", "Target", "Finisher", "Online", "Scholarship test", "Not sure yet"];
