// Source: the CLAT 2026 results board on lawpreptutorialdelhi.com,
// filtered to students marked "LPT Noida". Photos come from the same board.
export type Topper = {
  air: number;
  name: string;
  nlu: string;
  city: string;
  score: number;
  photo: string;
};

export const noidaToppers: Topper[] = [
  { air: 45, name: "Samiksha", nlu: "NLSIU", city: "Bangalore", score: 106.5, photo: "/images/toppers/samiksha.webp" },
  { air: 163, name: "Aarav Srivastava", nlu: "NALSAR", city: "Hyderabad", score: 100.75, photo: "/images/toppers/aarav-srivastava.webp" },
  { air: 177, name: "Nishant Nischal", nlu: "NUJS", city: "Kolkata", score: 100.25, photo: "/images/toppers/nishant-nischal.webp" },
  { air: 197, name: "Achintya Singh", nlu: "NUJS", city: "Kolkata", score: 99.75, photo: "/images/toppers/achintya-singh.webp" },
  { air: 394, name: "Siddhant Negi", nlu: "GNLU", city: "Gandhinagar", score: 96.75, photo: "/images/toppers/siddhant-negi.webp" },
  { air: 432, name: "Khanak Singh", nlu: "NLIU", city: "Bhopal", score: 96.5, photo: "/images/toppers/khanak-singh.webp" },
  { air: 474, name: "Mohinish Muppalla", nlu: "NUJS", city: "Kolkata", score: 96, photo: "/images/toppers/mohinish-muppalla.webp" },
  { air: 504, name: "Akul Singla", nlu: "RMLNLU", city: "Lucknow", score: 95.5, photo: "/images/toppers/akul-singla.webp" },
  { air: 793, name: "Kanishka", nlu: "RGNUL", city: "Patiala", score: 92.75, photo: "/images/toppers/kanishka.webp" },
  { air: 1834, name: "Rohit Yadav", nlu: "GNLU", city: "Gandhinagar", score: 87, photo: "/images/toppers/rohit-yadav.webp" },
];

export function topperSlug(t: Topper) {
  return `${t.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-air-${t.air}`;
}

export function findTopper(slug: string) {
  return noidaToppers.find((t) => topperSlug(t) === slug);
}

export type Photo = { src: string; alt: string; width: number; height: number };

// From the "Noida Centre" gallery on lawpreptutorialdelhi.com.
export const centrePhotos: Photo[] = [
  { src: "/images/noida/5.webp", alt: "Students writing a timed test in a Noida classroom", width: 1600, height: 1200 },
  { src: "/images/noida/7.webp", alt: "Students at the Noida centre", width: 1200, height: 1600 },
  { src: "/images/noida/2.webp", alt: "Toppers felicitated on stage", width: 1600, height: 1068 },
  { src: "/images/noida/4.webp", alt: "Students and faculty in front of the LawPrep banner", width: 1600, height: 1064 },
  { src: "/images/noida/6.webp", alt: "A celebration at the Noida centre", width: 1600, height: 1200 },
  { src: "/images/noida/8.webp", alt: "Students celebrating together at the centre", width: 1200, height: 1600 },
  { src: "/images/noida/3.webp", alt: "Results felicitation event", width: 1600, height: 1068 },
  { src: "/images/noida/1.webp", alt: "Faculty and students at a LawPrep event", width: 1600, height: 1068 },
];

export const academicHead = {
  name: "Anand Sharma",
  title: "Advocate · Director, LawPrep Tutorial Delhi NCR",
  education: "B.A. LL.B. (Hons.), NLIU Bhopal",
  photo: "/images/brand/anand-sharma.webp",
};

export type Program = {
  slug: string;
  name: string;
  duration: string;
  months: number;
  audience: string;
  stage: string;
  summary: string;
  detail: string;
};

// Durations and audiences match the parent site's program table.
export const programs: Program[] = [
  {
    slug: "foundation",
    name: "Foundation",
    duration: "2 years",
    months: 24,
    audience: "Class 11",
    stage: "Class 11",
    summary: "Starts early, so reading, reasoning and GK grow alongside school.",
    detail:
      "A 24-month track for students who begin in Class 11. The pace leaves room for school and boards while reading speed, legal reasoning and current affairs build up steadily.",
  },
  {
    slug: "target",
    name: "Target",
    duration: "1 year",
    months: 12,
    audience: "Class 12",
    stage: "Class 12",
    summary: "One focused year from concepts to full-length mocks.",
    detail:
      "A 12-month track for Class 12 students. It runs every CLAT and AILET section in parallel, then shifts to timed mocks and their analysis as the exam gets closer.",
  },
  {
    slug: "finisher",
    name: "Finisher",
    duration: "10 months",
    months: 10,
    audience: "Repeat aspirants",
    stage: "Repeater",
    summary: "For a second attempt. Fix what cost you marks last time.",
    detail:
      "A 10-month track for students who have already attempted the exam. It starts from your last attempt and puts the hours where the marks were lost.",
  },
];

export type CourseDetail = {
  hours: string;
  schedule: string;
  phases: { title: string; span: string; focus: string }[];
  includes: string[];
  faqs: { question: string; answer: string }[];
};

// Hours and schedules come from the parent site's centre batch tables.
// Phases, inclusions and answers are placeholders that describe the track in
// general terms.
// TODO: confirm with the academic team
export const courseDetails: Record<string, CourseDetail> = {
  foundation: {
    hours: "1200+ hrs",
    schedule: "Ask the counsellor",
    phases: [
      { title: "Build the base", span: "Year 1", focus: "Reading speed, vocabulary, reasoning basics and a daily news habit, paced around school." },
      { title: "Cover the syllabus", span: "Year 2 · first half", focus: "Every CLAT and AILET section in depth, with sectional tests after each unit." },
      { title: "Test and refine", span: "Year 2 · final months", focus: "Full-length mocks, analysis sessions and revision of weak areas." },
    ],
    includes: ["Printed study material", "Mock tests and analysis", "1:1 mentorship", "LMS access", "Current affairs updates", "Doubt sessions"],
    faqs: [
      { question: "Will this clash with Class 11 and 12 studies?", answer: "The pace is set to run alongside school. Ask the counsellor for the current timings at the Noida centre." },
      { question: "What are the fees?", answer: "Fees depend on the batch and any scholarship you earn. The counsellor will share the current fee on a call." },
    ],
  },
  target: {
    hours: "800+ hrs",
    schedule: "Weekday batch",
    phases: [
      { title: "Concepts", span: "Months 1–5", focus: "All sections taught in parallel, with sectional practice every week." },
      { title: "Application", span: "Months 6–9", focus: "Mixed practice sets, previous papers and timed drills." },
      { title: "Mocks", span: "Months 10–12", focus: "Full-length mocks with one-on-one analysis before the exam." },
    ],
    includes: ["Printed study material", "Mock tests and analysis", "1:1 mentorship", "LMS access", "Current affairs updates", "Doubt sessions"],
    faqs: [
      { question: "Can I manage this with Class 12 boards?", answer: "Yes. The plan eases off around board exams and picks up again after them. The counsellor can walk you through this year's calendar." },
      { question: "What are the fees?", answer: "Fees depend on the batch and any scholarship you earn. The counsellor will share the current fee on a call." },
    ],
  },
  finisher: {
    hours: "800+ hrs",
    schedule: "Weekend batch",
    phases: [
      { title: "Diagnose", span: "Month 1", focus: "Review of your last attempt to find where the marks went." },
      { title: "Rebuild", span: "Months 2–6", focus: "Targeted teaching on weak sections, with regular sectional tests." },
      { title: "Perform", span: "Months 7–10", focus: "Full-length mocks under exam conditions, with analysis after each one." },
    ],
    includes: ["Printed study material", "Mock tests and analysis", "1:1 mentorship", "LMS access", "Current affairs updates", "Doubt sessions"],
    faqs: [
      { question: "I'm in college. Can I still join?", answer: "Yes. The weekend schedule is built for students who are studying or working alongside preparation." },
      { question: "What are the fees?", answer: "Fees depend on the batch and any scholarship you earn. The counsellor will share the current fee on a call." },
    ],
  },
};

export const otherFormats = [
  { name: "Online Live Program", note: "The full course, live from home" },
  { name: "Booster Batch", note: "A crash course for the final stretch" },
  { name: "English-Specific Batch", note: "Reading comprehension and English only" },
];

export const exams = ["CLAT (UG)", "AILET", "other law entrance tests"];

export const ncrCentres = [
  { name: "Hauz Khas", area: "South Delhi" },
  { name: "GTB Nagar", area: "North Delhi" },
  { name: "Gurugram", area: "Haryana" },
  { name: "Ghaziabad", area: "Raj Nagar" },
];
