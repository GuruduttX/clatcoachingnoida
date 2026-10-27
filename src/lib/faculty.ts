// Same faculty as lawpreptutorialdelhi.com (ported from its data/faculty.ts).

export interface FAQItem {
  question: string;
  answer: string;
}

export interface KeyFactRow {
  label: string;
  value: string;
  note?: string;
}

export interface FacultyMember {
  slug: string;
  name: string;
  title: string;
  credential: string;
  role: string;
  href: string;
  image: string;
  alt: string;
  verified: boolean;
  group?: "director" | "faculty";
  bio: string;
  expertise: string[];
}

export interface FacultyProfileSection {
  title: string;
  paragraphs: string[];
}

export interface FacultyTeachingPoint {
  title: string;
  description: string;
}

export type FacultyBackgroundPillarIcon =
  | "landmark"
  | "scale"
  | "shield-check";

export interface FacultyBackgroundPillar {
  title: string;
  text: string;
  icon: FacultyBackgroundPillarIcon;
}

export interface FacultyProfileData {
  heroTitle: string;
  heroSummary: string;
  quickFacts: KeyFactRow[];
  background: FacultyProfileSection;
  backgroundEyebrow: string;
  backgroundHeading: string;
  backgroundDescription: string;
  backgroundPillars: FacultyBackgroundPillar[];
  teaching: FacultyProfileSection;
  teachingPoints: FacultyTeachingPoint[];
  whyItMatters: FacultyProfileSection;
  faqs: FAQItem[];
}

export const facultyMembers: FacultyMember[] = [
  {
    slug: "anand-sharma",
    name: "Anand Sir",
    title: "Director & Academic Mentor",
    credential: "B.A. LL.B., National Law University, Bhopal",
    role: "Critical Reasoning mentor",
    href: "/faculty/anand-sharma",
    image: "/images/brand/anand-sharma.webp",
    alt: "Anand Sir, Director and Critical Reasoning mentor at LPT Delhi NCR",
    verified: true,
    group: "director",
    bio: "Anand Sir is the Director & Academic Mentor at Law Prep Tutorial Delhi NCR, specializing in Critical Reasoning, academic planning, curriculum development, and student mentoring.",
    expertise: [
      "Critical Reasoning",
      "Analytical thinking",
      "CLAT exam strategy",
    ],
  },
  {
    slug: "eikluvya-sir",
    name: "Eikluvya Sir",
    title: "Director & Academic Mentor",
    credential: "B.A. LL.B., National Law University, Bhopal",
    role: "Legal Reasoning mentor",
    href: "/faculty/eikluvya-sir",
    image:
      "https://res.cloudinary.com/dnhau4zv2/image/upload/v1784376220/LPT_DELHI/reviews/file_ze75lb.webp",
    alt: "Eikluvya Sir, Director and Legal Reasoning mentor at LPT Delhi NCR",
    verified: true,
    group: "director",
    bio: "Eikluvya Sir is the Director & Academic Mentor at Law Prep Tutorial Delhi NCR, specializing in Legal Reasoning, legal aptitude, curriculum planning, and student mentorship.",
    expertise: [
      "Legal Reasoning",
      "Legal aptitude",
      "Principle-based reasoning",
    ],
  },
  {
    slug: "priyam-maam",
    name: "Priyam Ma'am",
    title: "Director & Academic Mentor",
    credential: "B.Tech in Computer Science",
    role: "GK and Current Affairs mentor",
    href: "/faculty/priyam-maam",
    image:
      "https://res.cloudinary.com/dnhau4zv2/image/upload/v1782885540/LPT_DELHI/reviews/file_zhadbv.webp",
    alt: "Priyam Ma'am, Director and GK Current Affairs mentor at LPT Delhi NCR",
    verified: true,
    group: "director",
    bio: "Priyam Ma'am is the Director & Academic Mentor at Law Prep Tutorial Delhi NCR, specializing in General Knowledge, Current Affairs, revision strategy, and academic mentoring.",
    expertise: [
      "General Knowledge & Current Affairs",
      "Current affairs analysis",
      "CLAT-focused revision strategy",
    ],
  },
  {
    slug: "vikrant-sir",
    name: "Vikrant Sir",
    title: "Faculty & Academic Mentor",
    credential: "Credentials pending verification",
    role: "Critical Reasoning and English mentor",
    href: "/faculty/vikrant-sir",
    image:
      "https://res.cloudinary.com/dnhau4zv2/image/upload/v1783926896/LPT_DELHI/reviews/file_tzdjix.webp",
    alt: "Vikrant Sir, Critical Reasoning and English faculty at LPT Delhi NCR",
    verified: false,
    bio: "Vikrant Sir teaches Critical Reasoning and English Reading Comprehension, helping students improve analytical thinking, reading speed, and accuracy.",
    expertise: [
      "Critical Reasoning",
      "English Reading Comprehension",
      "Analytical thinking",
    ],
  },
  {
    slug: "shashank-sir",
    name: "Shashank Sir",
    title: "Faculty & Academic Mentor",
    credential: "BA LL.B. (pending verification)",
    role: "General Knowledge and Current Affairs mentor",
    href: "/faculty/shashank-sir",
    image:
      "https://res.cloudinary.com/dnhau4zv2/image/upload/v1782970758/LPT_DELHI/reviews/file_jlhl0a.webp",
    alt: "Shashank Sir, GK and Current Affairs faculty at LPT Delhi NCR",
    verified: false,
    bio: "Shashank Sir teaches General Knowledge and Current Affairs through structured updates, revision cycles, quizzes, and CLAT-focused context building.",
    expertise: ["General Knowledge", "Current Affairs", "Static GK revision"],
  },
  {
    slug: "krishna-sir",
    name: "Krishna Sir",
    title: "Faculty & Academic Mentor",
    credential: "Credentials pending verification",
    role: "Logical Reasoning mentor",
    href: "/faculty/krishna-sir",
    image:
      "https://res.cloudinary.com/dnhau4zv2/image/upload/v1782970673/LPT_DELHI/reviews/file_hmye6z.webp",
    alt: "Krishna Sir, Logical Reasoning faculty at LPT Delhi NCR",
    verified: false,
    bio: "Krishna Sir teaches Logical Reasoning through concept-based learning, analytical practice, and structured problem-solving methods.",
    expertise: [
      "Logical Reasoning",
      "Analytical problem-solving",
      "CLAT reasoning strategy",
    ],
  },
  {
    slug: "sachin-sir",
    name: "Sachin Sir",
    title: "Faculty & Academic Mentor",
    credential: "B.Sc. & M.Sc.",
    role: "Legal Reasoning mentor",
    href: "/faculty/sachin-sir",
    image:
      "https://res.cloudinary.com/dnhau4zv2/image/upload/v1782969370/LPT_DELHI/reviews/file_nxsfiz.webp",
    alt: "Sachin Sir, Legal Reasoning faculty at LPT Delhi NCR",
    verified: false,
    bio: "Sachin Sir teaches Legal Reasoning with an emphasis on concept-first learning, analytical thinking, and exam-oriented practice.",
    expertise: ["Quantitative techniques"],
  },
  {
    slug: "atul-sir",
    name: "Atul Sir",
    title: "Faculty & Academic Mentor",
    credential: "B.Sc. Maths (Hons.), DU",
    role: "Quantitative Techniques mentor",
    href: "/faculty/atul-sir",
    image: "/images/faculty-placeholder.svg",
    alt: "Atul Sir, Quantitative Techniques faculty at LPT Delhi NCR",
    verified: false,
    bio: "Atul Sir teaches Quantitative Techniques, helping students build confidence in arithmetic, data interpretation, speed, and accuracy.",
    expertise: [
      "Quantitative Techniques",
      "Data interpretation",
      "Arithmetic and shortcuts",
    ],
  },
  {
    slug: "namrata-maam",
    name: "Namrata Ma'am",
    title: "Faculty & Academic Mentor",
    credential: "Credentials pending verification",
    role: "English Language and Reading Comprehension mentor",
    href: "/faculty/namrata-maam",
    image:
      "https://res.cloudinary.com/dnhau4zv2/image/upload/v1784376322/LPT_DELHI/reviews/file_mictx8.webp",
    alt: "Namrata Ma'am, English faculty at LPT Delhi NCR",
    verified: false,
    bio: "Namrata Ma'am teaches English Language and Reading Comprehension through reading practice, vocabulary development, and exam-focused mentoring.",
    expertise: [
      "English Language",
      "Reading Comprehension",
      "Vocabulary and verbal ability",
    ],
  },
  {
    slug: "aman-sir",
    name: "Aman Sir",
    title: "Faculty & Academic Mentor",
    credential: "Credentials pending verification",
    role: "Logical Reasoning mentor",
    href: "/faculty/aman-sir",
    image:
      "https://res.cloudinary.com/dnhau4zv2/image/upload/v1782969221/LPT_DELHI/reviews/file_gvlg9t.webp",
    alt: "Aman Sir, Logical Reasoning faculty at LPT Delhi NCR",
    verified: false,
    bio: "Aman Sir teaches Logical Reasoning through concept-driven problem solving, timed practice, and personalized academic guidance.",
    expertise: [
      "Logical Reasoning",
      "Analytical reasoning",
      "Puzzles and decision-making",
    ],
  },
  {
    slug: "ankit-sir",
    name: "Ankit Sir",
    title: "Faculty & Academic Mentor",
    credential: "Bachelor of Engineering (B.E.)",
    role: "Critical Reasoning mentor",
    href: "/faculty/ankit-sir",
    image:
      "https://res.cloudinary.com/dnhau4zv2/image/upload/v1782969279/LPT_DELHI/reviews/file_vw35zs.webp",
    alt: "Ankit Sir, Critical Reasoning faculty at LPT Delhi NCR",
    verified: false,
    bio: "Ankit Sir teaches Critical Reasoning, combining an engineering background with 13+ years of mentoring experience for law entrance aspirants.",
    expertise: [
      "Critical Reasoning",
      "Logical arguments",
      "Exam-oriented reasoning strategy",
    ],
  },
];

export const directorMembers = facultyMembers.filter(
  (member) => member.group === "director"
);

export const anandSharmaProfile: FacultyProfileData = {
  heroTitle: "Anand Sir | Director & Academic Mentor",
  heroSummary:
    "Anand Sir is the Director & Academic Mentor at Law Prep Tutorial Delhi NCR, specializing in Critical Reasoning for CLAT and other leading law entrance examinations. A graduate of B.A. LL.B. from National Law University, Bhopal, he brings over 10 years of teaching and mentoring experience to the classroom. His structured, concept-driven teaching methodology has helped thousands of aspirants strengthen their analytical thinking, logical reasoning, and examination strategy. Along with teaching, he plays an active role in academic planning, curriculum development, and student mentoring across the Delhi NCR centres.",
  quickFacts: [
    { label: "Name", value: "Anand Sir" },
    {
      label: "Role",
      value: "Director & Academic Mentor, Law Prep Tutorial Delhi NCR",
    },
    {
      label: "Education",
      value: "B.A. LL.B., National Law University (NLU), Bhopal",
    },
    {
      label: "Teaches",
      value: "Critical Reasoning Legal reasoning",
      note: "Specializes in logical reasoning, analytical thinking, and exam strategy for CLAT aspirants.",
    },
    {
      label: "Experience",
      value: "10+ Years",
      note: "More than a decade of mentoring students for CLAT and other law entrance examinations.",
    },
  ],
  background: {
    title: "Educational & Professional Background",
    paragraphs: [
      "Anand Sir completed his B.A. LL.B. from National Law University (NLU), Bhopal, where he developed a strong academic foundation in law, legal analysis, and critical thinking. His legal education has enabled him to simplify complex reasoning concepts into practical techniques that are easily understood by CLAT aspirants.",
      "As the Director & Academic Mentor at Law Prep Tutorial Delhi NCR, Anand Sir leads academic initiatives while mentoring students preparing for CLAT and other law entrance examinations. His responsibilities include curriculum planning, faculty coordination, classroom instruction, doubt-solving sessions, and guiding students throughout their preparation journey.",
      "With over 10 years of teaching experience, Anand Sir has mentored thousands of students in Critical Reasoning. His consistent focus on conceptual clarity, structured practice, and examination strategy has helped students improve analytical abilities, logical accuracy, and overall performance in competitive law entrance examinations.",
    ],
  },
  backgroundEyebrow: "Director & Academic Mentor",
  backgroundHeading:
    "Meet Anand Sir, Director & Academic Mentor at Law Prep Tutorial Delhi NCR",
  backgroundDescription:
    "Anand Sir combines legal education with extensive teaching experience to help students master Critical Reasoning. His academic leadership and student-centric mentoring approach enable aspirants to build confidence, think analytically, and perform effectively in competitive law entrance examinations.",
  backgroundPillars: [
    {
      title: "Educational & Professional Strength",
      text: "Graduated with a B.A. LL.B. from National Law University, Bhopal, Anand Sir possesses a strong academic foundation in legal studies and analytical reasoning. His expertise enables students to understand complex reasoning concepts through structured and practical learning.",
      icon: "landmark",
    },
    {
      title: "Role at Law Prep Tutorial",
      text: "As the Director & Academic Mentor, Anand Sir oversees academic planning, mentors students, contributes to curriculum development, and teaches Critical Reasoning through a structured, exam-oriented approach.",
      icon: "scale",
    },
    {
      title: "Achievements & Experience",
      text: "With 10+ years of CLAT mentoring experience, Anand Sir has guided thousands of law aspirants through classroom teaching, mock analysis, doubt-solving sessions, and personalized academic support.",
      icon: "shield-check",
    },
  ],
  teaching: {
    title: "Critical Reasoning with structure, logic, and exam strategy.",
    paragraphs: [
      "Anand Sir teaches Critical Reasoning, focusing on logical arguments, assumptions, conclusions, inference-based questions, analytical reasoning, and decision-making techniques. His classes are designed to help students understand concepts before applying them to complex examination scenarios.",
      "His teaching methodology combines conceptual learning, interactive classroom discussions, sectional practice, previous-year question analysis, and continuous performance evaluation. By encouraging students to think logically rather than memorize patterns, he helps them develop the confidence and accuracy needed to excel in CLAT and other law entrance examinations.",
    ],
  },
  teachingPoints: [
    {
      title: "Conceptual Clarity",
      description:
        "Builds a strong foundation by explaining reasoning concepts step by step, ensuring students understand the logic behind every question.",
    },
    {
      title: "Exam-Oriented Preparation",
      description:
        "Focuses on CLAT-specific question patterns, timed practice sessions, previous-year papers, and strategic approaches to maximize examination performance.",
    },
    {
      title: "Individual Student Mentorship",
      description:
        "Provides personalized guidance through doubt-solving, progress tracking, and performance analysis, helping every student identify strengths and improve weaker areas.",
    },
  ],
  whyItMatters: {
    title: "Why this matters for Critical Reasoning preparation",
    paragraphs: [
      "Critical Reasoning plays a crucial role in determining success in CLAT and other law entrance examinations. Anand Sir helps students strengthen their analytical thinking and logical decision-making skills through systematic preparation and continuous practice.",
      "His combination of legal education, academic leadership, and more than a decade of mentoring experience allows students to prepare with confidence. Through structured learning, personalized guidance, and exam-oriented strategies, he equips aspirants with the skills needed to perform consistently in highly competitive law entrance examinations.",
    ],
  },
  faqs: [
    {
      question: "Who is Anand Sir?",
      answer:
        "Anand Sir is the Director & Academic Mentor at Law Prep Tutorial Delhi NCR. He specializes in teaching Critical Reasoning and has over 10 years of experience mentoring students preparing for CLAT and other prestigious law entrance examinations.",
    },
    {
      question: "What are his qualifications?",
      answer:
        "Anand Sir holds a B.A. LL.B. degree from National Law University (NLU), Bhopal. His legal education provides a strong academic foundation that enables him to teach Critical Reasoning with a practical, analytical, and exam-oriented approach.",
    },
    {
      question: "Which subjects does he teach?",
      answer:
        "Anand Sir teaches Critical Reasoning, covering logical arguments, assumptions, conclusions, inference-based reasoning, analytical problem-solving, and decision-making techniques required for CLAT and other law entrance examinations.",
    },
    {
      question: "How many years of teaching experience does he have?",
      answer:
        "Anand Sir has more than 10 years of teaching and mentoring experience in CLAT preparation.",
    },
    {
      question: "Why should students learn from Anand Sir?",
      answer:
        "Students benefit from Anand Sir's combination of legal education, academic leadership, and over a decade of mentoring experience. His concept-based teaching style, structured learning methods, and personalized mentoring help aspirants develop logical thinking, improve accuracy, and build the confidence required to succeed in CLAT and other law entrance examinations.",
    },
  ],
};

export const eikluvyaSirProfile: FacultyProfileData = {
  heroTitle: "Eikluvya Sir | Director & Academic Mentor",
  heroSummary:
    "Eikluvya Sir is the Director & Academic Mentor at Law Prep Tutorial Delhi NCR, specializing in Legal Reasoning for CLAT and other law entrance examinations. A graduate of B.A. LL.B. from National Law University (NLU), Bhopal, he brings over 8 years of teaching and mentoring experience in preparing students for competitive law entrance tests. His classes emphasize conceptual understanding, legal aptitude, and application-based reasoning, enabling students to confidently tackle complex legal passages. Alongside teaching, he plays a significant role in academic planning, curriculum development, and student mentorship across the institute.",
  quickFacts: [
    { label: "Name", value: "Eikluvya Sir" },
    {
      label: "Role",
      value: "Director & Academic Mentor, Law Prep Tutorial Delhi NCR",
    },
    {
      label: "Education",
      value: "B.A. LL.B., National Law University (NLU), Bhopal",
    },
    {
      label: "Teaches",
      value: "Legal Reasoning",
      note: "Specializes in legal aptitude, principle-based reasoning, and passage analysis for CLAT.",
    },
    {
      label: "Experience",
      value: "8+ Years",
      note: "More than eight years of mentoring students for CLAT and other law entrance examinations.",
    },
  ],
  background: {
    title: "Educational & Professional Background",
    paragraphs: [
      "Eikluvya Sir completed his B.A. LL.B. from National Law University (NLU), Bhopal, where he developed a comprehensive understanding of legal principles, constitutional concepts, and analytical reasoning. His academic training enables him to simplify complex legal concepts into structured learning modules that are easy for CLAT aspirants to understand and apply.",
      "As the Director & Academic Mentor at Law Prep Tutorial Delhi NCR, Eikluvya Sir plays a dual role as an educator and academic leader. In addition to teaching Legal Reasoning, he contributes to curriculum planning, academic strategy, faculty coordination, and student mentoring.",
      "With over 8 years of teaching and mentoring experience, Eikluvya Sir has helped numerous students strengthen their legal aptitude and analytical thinking skills. His classroom sessions focus on developing confidence, improving logical interpretation, and building the ability to solve legal reasoning questions accurately under examination conditions.",
    ],
  },
  backgroundEyebrow: "Director & Academic Mentor",
  backgroundHeading:
    "Meet Eikluvya Sir, Director & Academic Mentor at Law Prep Tutorial Delhi NCR",
  backgroundDescription:
    "Eikluvya Sir combines legal education with years of academic mentoring to provide students with a strong foundation in Legal Reasoning. His practical teaching style, student-focused mentoring, and strategic approach help aspirants develop the analytical skills required to excel in competitive law entrance examinations.",
  backgroundPillars: [
    {
      title: "Educational & Professional Strength",
      text: "A graduate of National Law University (NLU), Bhopal, Eikluvya Sir possesses a solid legal education that enables him to explain legal principles with clarity and relevance.",
      icon: "landmark",
    },
    {
      title: "Role at Law Prep Tutorial",
      text: "As the Director & Academic Mentor, he oversees academic initiatives, mentors students, contributes to curriculum planning, and teaches Legal Reasoning through structured classroom sessions.",
      icon: "scale",
    },
    {
      title: "Achievements & Experience",
      text: "With 8+ years of experience in CLAT mentoring, Eikluvya Sir has guided students through classroom instruction, regular assessments, doubt-solving sessions, and personalized mentoring.",
      icon: "shield-check",
    },
  ],
  teaching: {
    title: "Legal Reasoning through principles, passages, and application.",
    paragraphs: [
      "Eikluvya Sir teaches Legal Reasoning, covering legal principles, factual application, constitutional concepts, legal aptitude, and passage-based analysis. His sessions are designed to help students understand how legal principles are applied in practical scenarios rather than relying solely on memorization.",
      "His teaching methodology combines concept-building, previous-year question discussions, sectional practice, classroom interaction, and regular assessments. Students are encouraged to think analytically, evaluate legal situations critically, and solve CLAT-style Legal Reasoning questions with accuracy and confidence.",
    ],
  },
  teachingPoints: [
    {
      title: "Strong Conceptual Foundation",
      description:
        "Focuses on helping students understand the logic behind legal principles before applying them to examination questions.",
    },
    {
      title: "Practical & Exam-Oriented Learning",
      description:
        "Uses CLAT-style passages, previous-year questions, mock exercises, and structured practice sessions to prepare students for actual examination conditions.",
    },
    {
      title: "Personalized Academic Mentorship",
      description:
        "Provides continuous guidance through doubt-solving sessions, performance reviews, and individual mentoring to ensure every student progresses consistently.",
    },
  ],
  whyItMatters: {
    title: "Why this matters for Legal Reasoning preparation",
    paragraphs: [
      "Legal Reasoning is one of the most significant sections of CLAT, demanding both conceptual understanding and analytical application. Eikluvya Sir equips students with these essential skills through systematic teaching, structured practice, and continuous academic support.",
      "His combination of legal education, academic leadership, and more than 8 years of mentoring experience enables students to develop confidence, improve logical analysis, and approach legal reasoning questions with precision.",
    ],
  },
  faqs: [
    {
      question: "Who is Eikluvya Sir?",
      answer:
        "Eikluvya Sir is the Director & Academic Mentor at Law Prep Tutorial Delhi NCR. He specializes in teaching Legal Reasoning and has over 8 years of experience mentoring students preparing for CLAT and other law entrance examinations.",
    },
    {
      question: "What are his qualifications?",
      answer:
        "Eikluvya Sir holds a B.A. LL.B. degree from National Law University (NLU), Bhopal.",
    },
    {
      question: "Which subjects does he teach?",
      answer:
        "Eikluvya Sir teaches Legal Reasoning, covering legal principles, legal aptitude, constitutional concepts, factual application, passage-based reasoning, and analytical techniques required for CLAT and other competitive law entrance examinations.",
    },
    {
      question: "How many years of teaching experience does he have?",
      answer:
        "Eikluvya Sir has more than 8 years of teaching and mentoring experience in CLAT preparation.",
    },
    {
      question: "Why should students learn from Eikluvya Sir?",
      answer:
        "Students benefit from Eikluvya Sir's blend of legal expertise, academic leadership, and years of mentoring experience. His emphasis on conceptual clarity, structured preparation, practical application of legal principles, and personalized guidance helps aspirants build strong analytical skills and confidence.",
    },
  ],
};

export const priyamMaamProfile: FacultyProfileData = {
  heroTitle: "Priyam Ma'am | Director & Academic Mentor",
  heroSummary:
    "Priyam Ma'am is the Director & Academic Mentor at Law Prep Tutorial Delhi NCR, specializing in General Knowledge and Current Affairs for CLAT and other law entrance examinations. She holds a B.Tech in Computer Science and brings over 8 years of teaching and mentoring experience in guiding aspirants through dynamic current affairs and static GK preparation. Her structured teaching methodology, combined with regular current affairs analysis and revision strategies, enables students to stay updated while developing a strong conceptual understanding of topics relevant to law entrance examinations.",
  quickFacts: [
    { label: "Name", value: "Priyam Ma'am" },
    {
      label: "Role",
      value: "Director & Academic Mentor, Law Prep Tutorial Delhi NCR",
    },
    {
      label: "Education",
      value: "B.Tech in Computer Science",
    },
    {
      label: "Teaches",
      value: "General Knowledge & Current Affairs",
      note: "Specializes in current affairs analysis, static GK, and CLAT-focused revision strategies.",
    },
    {
      label: "Experience",
      value: "8+ Years",
      note: "More than eight years of mentoring students for CLAT and other law entrance examinations.",
    },
  ],
  background: {
    title: "Educational & Professional Background",
    paragraphs: [
      "Priyam Ma'am holds a Bachelor of Technology (B.Tech) in Computer Science, equipping her with strong analytical, research, and information management skills. Her academic background enables her to organize complex information into structured learning modules, making General Knowledge and Current Affairs accessible for students preparing for law entrance examinations.",
      
      "As the Director & Academic Mentor at Law Prep Tutorial Delhi NCR, Priyam Ma'am plays an important role in academic leadership while teaching General Knowledge and Current Affairs. She contributes to curriculum planning, content development, academic strategy, and student mentoring.",

      "With over 8 years of teaching and mentoring experience, Priyam Ma'am has guided numerous CLAT aspirants in mastering current affairs and static GK. Her emphasis on regular newspaper analysis, monthly revisions, quizzes, and exam-oriented preparation helps students build confidence.",
    ],
  },
  backgroundEyebrow: "Director & Academic Mentor",
  backgroundHeading:
    "Meet Priyam Ma'am, Director & Academic Mentor at Law Prep Tutorial Delhi NCR",
  backgroundDescription:
    "Priyam Ma'am combines analytical thinking with years of teaching experience to make General Knowledge and Current Affairs engaging, structured, and exam-oriented. Her mentoring approach helps students stay informed, improve retention, and confidently tackle the GK section in competitive law entrance examinations.",
  backgroundPillars: [
    {
      title: "Educational & Professional Strength",
      text: "With a B.Tech in Computer Science, Priyam Ma'am brings a structured and analytical approach to teaching. Her ability to simplify diverse topics helps students understand and retain current affairs and static GK concepts.",
      icon: "landmark",
    },
    {
      title: "Role at Law Prep Tutorial",
      text: "As the Director & Academic Mentor, she oversees academic initiatives, mentors students, contributes to curriculum planning, and teaches General Knowledge and Current Affairs.",
      icon: "scale",
    },
    {
      title: "Achievements & Experience",
      text: "With 8+ years of mentoring experience, Priyam Ma'am has helped students develop a disciplined approach to current affairs preparation through regular updates, quizzes, revision sessions, and academic guidance.",
      icon: "shield-check",
    },
  ],
  teaching: {
    title: "GK and Current Affairs with context, structure, and revision.",
    paragraphs: [
      "Priyam Ma'am teaches General Knowledge and Current Affairs, covering national and international events, government policies, economics, international relations, awards, science and technology, environment, history, polity, geography, and other topics relevant to CLAT and law entrance examinations.",
      "Her teaching methodology combines daily current affairs discussions, monthly compilations, thematic revisions, interactive quizzes, and mock test analysis. By connecting current events with their legal, political, and social implications, she helps students improve long-term retention and examination performance.",
    ],
  },
  teachingPoints: [
    {
      title: "Comprehensive Current Affairs Coverage",
      description:
        "Ensures students remain consistently updated through structured discussions, monthly revisions, and curated study material aligned with the latest examination trends.",
    },
    {
      title: "Analytical Learning Approach",
      description:
        "Encourages students to understand the context and significance behind important events instead of relying solely on factual memorization.",
    },
    {
      title: "Consistent Revision & Mentorship",
      description:
        "Supports students with regular quizzes, doubt-solving sessions, performance reviews, and revision strategies that strengthen retention and examination confidence.",
    },
  ],
  whyItMatters: {
    title: "Why this matters for GK and Current Affairs preparation",
    paragraphs: [
      "General Knowledge and Current Affairs are constantly evolving sections of CLAT that require consistent preparation and regular revision. Priyam Ma'am helps students develop disciplined study habits while ensuring they remain updated with significant national and international developments.",
      "Her 8+ years of teaching experience, combined with her role in academic leadership, enables students to approach the GK section strategically. Through structured learning, continuous assessment, and personalized mentoring, she equips aspirants with the knowledge and confidence needed to perform well.",
    ],
  },
  faqs: [
    {
      question: "Who is Priyam Ma'am?",
      answer:
        "Priyam Ma'am is the Director & Academic Mentor at Law Prep Tutorial Delhi NCR. She specializes in General Knowledge and Current Affairs and has over 8 years of experience mentoring students preparing for CLAT and other law entrance examinations.",
    },
    {
      question: "What are her qualifications?",
      answer:
        "Priyam Ma'am holds a Bachelor of Technology (B.Tech) in Computer Science.",
    },
    {
      question: "Which subjects does she teach?",
      answer:
        "Priyam Ma'am teaches General Knowledge and Current Affairs, covering static GK, national and international events, government policies, economics, science and technology, environment, international relations, awards, and other topics relevant to CLAT and law entrance examinations.",
    },
    {
      question: "How many years of teaching experience does she have?",
      answer:
        "Priyam Ma'am has more than 8 years of teaching and mentoring experience in CLAT preparation.",
    },
    {
      question: "Why should students learn from Priyam Ma'am?",
      answer:
        "Students benefit from Priyam Ma'am's combination of analytical expertise, academic leadership, and extensive mentoring experience. Her structured teaching style, current affairs analysis, revision strategies, and student-focused guidance help aspirants stay updated and perform confidently.",
    },
  ],
};

export const vikrantSirProfile: FacultyProfileData = {
  heroTitle: "Vikrant Sir | Faculty & Academic Mentor",
  heroSummary:
    "Vikrant Sir is a Faculty & Academic Mentor at Law Prep Tutorial Delhi NCR, specializing in Critical Reasoning and English Reading Comprehension for CLAT and other law entrance examinations. His teaching helps students develop analytical reasoning, reading comprehension, and language skills through concept-led practice.",
  quickFacts: [
    { label: "Name", value: "Vikrant Sir" },
    {
      label: "Role",
      value: "Faculty & Academic Mentor, Law Prep Tutorial Delhi NCR",
    },
    {
      label: "Education",
      value: "Pending verification",
      note: "Educational qualification details were blank in the source document and should be confirmed before final publish.",
    },
    {
      label: "Teaches",
      value: "Critical Reasoning & English (Reading Comprehension)",
      note: "Focuses on logical reasoning, analytical thinking, vocabulary development, and reading comprehension strategies.",
    },
    {
      label: "Experience",
      value: "Pending verification",
      note: "Teaching experience details were blank in the source document.",
    },
  ],
  background: {
    title: "Educational & Professional Background",
    paragraphs: [
      "Vikrant Sir teaches Critical Reasoning and English Reading Comprehension with a focus on analytical thinking, reading speed, comprehension accuracy, and logical decision-making.",
      "At Law Prep Tutorial Delhi NCR, he conducts interactive classroom sessions, resolves academic doubts, evaluates student performance, and mentors students throughout their preparation journey.",
      "His classroom methodology emphasizes conceptual understanding, consistent practice, and strategic preparation so students can approach reasoning and comprehension questions with confidence.",
    ],
  },
  backgroundEyebrow: "Faculty & Academic Mentor",
  backgroundHeading:
    "Meet Vikrant Sir, Faculty & Academic Mentor at Law Prep Tutorial Delhi NCR",
  backgroundDescription:
    "Vikrant Sir combines logical reasoning with effective language instruction to help students improve analytical thinking, reading efficiency, and examination confidence.",
  backgroundPillars: [
    {
      title: "Educational & Professional Strength",
      text: "His academic background should be confirmed before final publish; his listed expertise focuses on reasoning and reading-comprehension instruction.",
      icon: "landmark",
    },
    {
      title: "Role at Law Prep Tutorial",
      text: "He teaches Critical Reasoning and English, conducts classroom lectures, mentors students, resolves doubts, and supports structured CLAT preparation.",
      icon: "scale",
    },
    {
      title: "Achievements & Experience",
      text: "He has mentored CLAT aspirants through concept-based teaching, practice sessions, mock discussions, and individualized academic support.",
      icon: "shield-check",
    },
  ],
  teaching: {
    title: "Critical Reasoning and English taught together for exam accuracy.",
    paragraphs: [
      "Vikrant Sir covers logical arguments, assumptions, conclusions, inference-based reasoning, vocabulary, grammar fundamentals, passage analysis, and comprehension strategies.",
      "His methodology uses conceptual explanations, previous-year questions, sectional practice, vocabulary work, reading improvement techniques, and regular assessments.",
    ],
  },
  teachingPoints: [
    {
      title: "Analytical Reasoning Development",
      description:
        "Helps students build logical thinking through structured reasoning concepts and practical problem-solving techniques.",
    },
    {
      title: "Reading Comprehension Excellence",
      description:
        "Improves reading speed, comprehension accuracy, vocabulary, and passage interpretation through regular practice.",
    },
    {
      title: "Personalized Academic Mentorship",
      description:
        "Supports students through doubt-solving, performance analysis, and individualized feedback.",
    },
  ],
  whyItMatters: {
    title: "Why this matters for reasoning and English preparation",
    paragraphs: [
      "Critical Reasoning and English together contribute significantly to CLAT performance. Vikrant Sir helps students strengthen analytical ability while improving reading and comprehension skills.",
      "His structured teaching methodology encourages students to understand concepts rather than memorize techniques, helping them build confidence and problem-solving ability.",
    ],
  },
  faqs: [
    {
      question: "Who is Vikrant Sir?",
      answer:
        "Vikrant Sir is a Faculty & Academic Mentor at Law Prep Tutorial Delhi NCR specializing in Critical Reasoning and English Reading Comprehension.",
    },
    {
      question: "What are his qualifications?",
      answer:
        "His educational qualifications are pending verification and should be updated once confirmed.",
    },
    {
      question: "Which subjects does he teach?",
      answer:
        "He teaches Critical Reasoning and English Reading Comprehension, including logical reasoning, analytical thinking, vocabulary, grammar fundamentals, and passage analysis.",
    },
    {
      question: "How many years of teaching experience does he have?",
      answer:
        "His teaching experience is pending verification. The source document notes his active mentoring role at LPT Delhi NCR.",
    },
    {
      question: "Why should students learn from Vikrant Sir?",
      answer:
        "Students benefit from his integrated approach to reasoning and English, combining conceptual clarity, structured practice, and exam-oriented strategies.",
    },
  ],
};

export const shashankSirProfile: FacultyProfileData = {
  heroTitle: "Shashank Sir | Faculty & Academic Mentor",
  heroSummary:
    "Shashank Sir is a Faculty & Academic Mentor at Law Prep Tutorial Delhi NCR, specializing in General Knowledge and Current Affairs for CLAT and other law entrance examinations. His teaching combines regular current-affairs discussion, static GK revision, and strategic mentoring.",
  quickFacts: [
    { label: "Name", value: "Shashank Sir" },
    {
      label: "Role",
      value: "Faculty & Academic Mentor, Law Prep Tutorial Delhi NCR",
    },
    {
      label: "Education",
      value: "BA LL.B.",
      note: "The source document appeared to swap education and experience fields; confirm before final publish.",
    },
    {
      label: "Teaches",
      value: "General Knowledge & Current Affairs",
      note: "Specializes in current affairs analysis, static GK, and CLAT-focused preparation.",
    },
    {
      label: "Experience",
      value: "6+ Years",
      note: "Experience value appears in the source document but should be verified before final publish.",
    },
  ],
  background: {
    title: "Educational & Professional Background",
    paragraphs: [
      "Shashank Sir brings a structured approach to General Knowledge and Current Affairs, helping students understand important events, concepts, and developments in an organized way.",
      "At Law Prep Tutorial Delhi NCR, he teaches GK and Current Affairs, prepares current-affairs modules, conducts classroom sessions, resolves doubts, and mentors students through their preparation.",
      "His teaching connects current events with their legal, political, economic, and social significance so students build understanding rather than relying only on memorization.",
    ],
  },
  backgroundEyebrow: "Faculty & Academic Mentor",
  backgroundHeading:
    "Meet Shashank Sir, Faculty & Academic Mentor at Law Prep Tutorial Delhi NCR",
  backgroundDescription:
    "Shashank Sir helps students remain informed, improve retention, and approach CLAT's dynamic GK section with confidence through regular updates, conceptual discussions, and revision planning.",
  backgroundPillars: [
    {
      title: "Educational & Professional Strength",
      text: "His academic background and research-oriented approach help him simplify national and international developments into structured lessons.",
      icon: "landmark",
    },
    {
      title: "Role at Law Prep Tutorial",
      text: "He teaches GK and Current Affairs, prepares academic content, mentors CLAT aspirants, conducts revision sessions, and supports structured classroom learning.",
      icon: "scale",
    },
    {
      title: "Achievements & Experience",
      text: "He has mentored students through disciplined current-affairs preparation, conceptual learning, regular assessment, and revision strategy.",
      icon: "shield-check",
    },
  ],
  teaching: {
    title: "Current Affairs taught with context, retention, and revision.",
    paragraphs: [
      "Shashank Sir covers national and international developments, constitutional updates, government policies, economics, international relations, science and technology, environment, history, geography, awards, and related CLAT topics.",
      "His methodology combines daily current-affairs discussions, monthly revision sessions, quizzes, previous-year question analysis, and mock-test evaluation.",
    ],
  },
  teachingPoints: [
    {
      title: "Comprehensive Current Affairs Coverage",
      description:
        "Provides systematic coverage of national and international events aligned with the latest CLAT pattern.",
    },
    {
      title: "Concept-Based Learning",
      description:
        "Encourages students to understand the background, significance, and implications of current events.",
    },
    {
      title: "Continuous Revision & Mentorship",
      description:
        "Supports students through quizzes, revision programs, performance reviews, and academic guidance.",
    },
  ],
  whyItMatters: {
    title: "Why this matters for GK and Current Affairs",
    paragraphs: [
      "General Knowledge and Current Affairs require consistent preparation throughout the year. Shashank Sir helps students develop disciplined study habits and remain updated with relevant developments.",
      "By emphasizing context alongside factual knowledge, he helps aspirants improve retention and examination confidence.",
    ],
  },
  faqs: [
    {
      question: "Who is Shashank Sir?",
      answer:
        "Shashank Sir is a Faculty & Academic Mentor at Law Prep Tutorial Delhi NCR specializing in General Knowledge and Current Affairs.",
    },
    {
      question: "What are his qualifications?",
      answer:
        "The source document indicates BA LL.B., but the field should be verified before final publication.",
    },
    {
      question: "Which subjects does he teach?",
      answer:
        "He teaches General Knowledge and Current Affairs, including static GK, national and international events, government policies, economics, environment, and other CLAT-relevant topics.",
    },
    {
      question: "How many years of teaching experience does he have?",
      answer:
        "The source document indicates 6+ years of experience, pending final verification.",
    },
    {
      question: "Why should students learn from Shashank Sir?",
      answer:
        "Students benefit from his structured approach to current affairs, conceptual context building, consistent revision, and exam-oriented mentoring.",
    },
  ],
};

export const krishnaSirProfile: FacultyProfileData = {
  heroTitle: "Krishna Sir | Faculty & Academic Mentor",
  heroSummary:
    "Krishna Sir is a Faculty & Academic Mentor at Law Prep Tutorial Delhi NCR, specializing in Logical Reasoning for CLAT and other law entrance examinations. He helps students build analytical thinking, logical problem-solving, and decision-making skills through structured practice.",
  quickFacts: [
    { label: "Name", value: "Krishna Sir" },
    {
      label: "Role",
      value: "Faculty & Academic Mentor, Law Prep Tutorial Delhi NCR",
    },
    {
      label: "Education",
      value: "Pending verification",
      note: "Educational qualification details were blank in the source document.",
    },
    {
      label: "Teaches",
      value: "Logical Reasoning",
      note: "Specializes in analytical reasoning, logical problem-solving, and examination strategies for CLAT.",
    },
    {
      label: "Experience",
      value: "7+ Years",
      note: "Experience value appears in the source document but should be verified before final publish.",
    },
  ],
  background: {
    title: "Educational & Professional Background",
    paragraphs: [
      "Krishna Sir teaches Logical Reasoning with a focus on analytical thinking, structured problem-solving, and conceptual clarity.",
      "At Law Prep Tutorial Delhi NCR, he conducts classroom sessions, designs practice strategies, resolves doubts, evaluates performance, and guides students through disciplined preparation.",
      "His classroom approach encourages students to think critically, identify logical patterns, and solve problems efficiently under examination conditions.",
    ],
  },
  backgroundEyebrow: "Faculty & Academic Mentor",
  backgroundHeading:
    "Meet Krishna Sir, Faculty & Academic Mentor at Law Prep Tutorial Delhi NCR",
  backgroundDescription:
    "Krishna Sir helps students strengthen Logical Reasoning through concept-based learning, interactive classroom discussion, structured examination practice, and student-focused mentoring.",
  backgroundPillars: [
    {
      title: "Educational & Professional Strength",
      text: "His subject expertise helps simplify challenging logical reasoning concepts into structured learning methods.",
      icon: "landmark",
    },
    {
      title: "Role at Law Prep Tutorial",
      text: "He teaches Logical Reasoning, mentors CLAT aspirants, conducts classroom sessions, develops practice strategies, and supports performance evaluation.",
      icon: "scale",
    },
    {
      title: "Achievements & Experience",
      text: "He has mentored students by emphasizing conceptual learning, analytical thinking, and structured examination preparation.",
      icon: "shield-check",
    },
  ],
  teaching: {
    title: "Logical Reasoning taught through patterns, structure, and practice.",
    paragraphs: [
      "Krishna Sir covers analytical reasoning, logical sequences, critical thinking, syllogisms, arrangements, coding-decoding, puzzles, statement-based reasoning, and decision-making.",
      "His methodology integrates concept-building, interactive classroom discussion, sectional practice, previous-year questions, timed exercises, and regular assessment.",
    ],
  },
  teachingPoints: [
    {
      title: "Strong Conceptual Foundation",
      description:
        "Builds a clear understanding of logical concepts before advanced examination-level practice.",
    },
    {
      title: "Analytical Problem-Solving",
      description:
        "Helps students identify logical patterns, evaluate alternatives, and solve reasoning questions efficiently.",
    },
    {
      title: "Continuous Student Mentorship",
      description:
        "Provides regular guidance, doubt-solving sessions, and performance reviews for steady progress.",
    },
  ],
  whyItMatters: {
    title: "Why this matters for Logical Reasoning",
    paragraphs: [
      "Logical Reasoning can be a scoring section when approached with conceptual clarity and the right strategy. Krishna Sir helps students develop systematic thinking and efficient problem-solving.",
      "Through structured instruction, practice, and mentoring, he equips aspirants with the logical aptitude needed for CLAT and other competitive law entrance examinations.",
    ],
  },
  faqs: [
    {
      question: "Who is Krishna Sir?",
      answer:
        "Krishna Sir is a Faculty & Academic Mentor at Law Prep Tutorial Delhi NCR specializing in Logical Reasoning.",
    },
    {
      question: "What are his qualifications?",
      answer:
        "His educational qualifications are pending verification and should be updated once confirmed.",
    },
    {
      question: "Which subjects does he teach?",
      answer:
        "He teaches Logical Reasoning, including analytical reasoning, critical thinking, logical sequences, puzzles, syllogisms, arrangements, coding-decoding, and decision-making.",
    },
    {
      question: "How many years of teaching experience does he have?",
      answer:
        "The source document indicates 7+ years of experience, pending final verification.",
    },
    {
      question: "Why should students learn from Krishna Sir?",
      answer:
        "Students benefit from his concept-driven approach, structured problem-solving methods, and continuous academic mentoring.",
    },
  ],
};

export const sachinSirProfile: FacultyProfileData = {
  heroTitle: "Sachin Sir | Faculty & Academic Mentor",
  heroSummary:
    "Sachin Sir is a Faculty & Academic Mentor at Law Prep Tutorial Delhi NCR, specializing in Legal Reasoning for CLAT and other law entrance examinations. His teaching emphasizes conceptual clarity, practical application, and regular practice so students can approach Legal Reasoning questions with confidence.",
  quickFacts: [
    { label: "Name", value: "Sachin Sir" },
    {
      label: "Role",
      value: "Faculty & Academic Mentor, Law Prep Tutorial Delhi NCR",
    },
    {
      label: "Education",
      value: "B.Sc. & M.Sc.",
      note: "Qualification appears in the source document but should be confirmed before final publish.",
    },
    {
      label: "Teaches",
      value: "Legal Reasoning",
      note: "Focuses on legal principles, application-based reasoning, and analytical problem-solving for CLAT.",
    },
    {
      label: "Experience",
      value: "10+ Years",
      note: "Experience value appears in the source document but should be verified before final publish.",
    },
  ],
  background: {
    title: "Educational & Professional Background",
    paragraphs: [
      "Sachin Sir teaches Legal Reasoning with a focus on legal concepts, analytical reasoning, and principle-based problem-solving.",
      "At Law Prep Tutorial Delhi NCR, he conducts classroom lectures, resolves academic doubts, evaluates student performance, and helps aspirants develop effective examination strategies.",
      "His classes focus on legal aptitude, analytical thinking, and the confidence required to solve passage-based Legal Reasoning questions accurately under exam conditions.",
    ],
  },
  backgroundEyebrow: "Faculty & Academic Mentor",
  backgroundHeading:
    "Meet Sachin Sir, Faculty & Academic Mentor at Law Prep Tutorial Delhi NCR",
  backgroundDescription:
    "Sachin Sir helps students build a strong Legal Reasoning foundation through structured teaching, concept-based learning, personalized mentoring, and examination-focused practice.",
  backgroundPillars: [
    {
      title: "Educational & Professional Strength",
      text: "His academic background and subject expertise help him explain legal principles in a structured, practical manner for law entrance preparation.",
      icon: "landmark",
    },
    {
      title: "Role at Law Prep Tutorial",
      text: "He teaches Legal Reasoning, conducts interactive classroom sessions, mentors students, resolves doubts, and guides CLAT-focused preparation.",
      icon: "scale",
    },
    {
      title: "Achievements & Experience",
      text: "He has mentored CLAT aspirants through concept-building, analytical reasoning, examination strategy, and continuous academic support.",
      icon: "shield-check",
    },
  ],
  teaching: {
    title: "Legal Reasoning with concept-first classroom practice.",
    paragraphs: [
      "Sachin Sir covers legal principles, legal aptitude, constitutional concepts, factual application, analytical reasoning, and passage-based Legal Reasoning questions.",
      "His methodology combines conceptual discussion, previous-year question analysis, regular practice, mock evaluation, and personalized mentoring.",
    ],
  },
  teachingPoints: [
    {
      title: "Concept-Based Legal Learning",
      description:
        "Builds legal understanding before moving students into complex application-based questions.",
    },
    {
      title: "Exam-Oriented Practice",
      description:
        "Uses CLAT-style passages, previous-year papers, mock exercises, and structured practice sessions.",
    },
    {
      title: "Individual Academic Mentorship",
      description:
        "Provides doubt-solving, performance analysis, and personalized guidance for confident progress.",
    },
  ],
  whyItMatters: {
    title: "Why this matters for Legal Reasoning scores",
    paragraphs: [
      "Legal Reasoning is a high-weightage CLAT section that requires students to apply legal concepts logically and efficiently.",
      "Sachin Sir's concept-driven teaching, mentoring, and exam-focused practice help students improve accuracy, legal aptitude, and confidence.",
    ],
  },
  faqs: [
    {
      question: "Who is Sachin Sir?",
      answer:
        "Sachin Sir is a Faculty & Academic Mentor at Law Prep Tutorial Delhi NCR specializing in Legal Reasoning.",
    },
    {
      question: "What are his qualifications?",
      answer:
        "The source document lists B.Sc. & M.Sc.; this should be verified before final publication.",
    },
    {
      question: "Which subjects does he teach?",
      answer:
        "He teaches Legal Reasoning, covering legal principles, legal aptitude, constitutional concepts, factual application, analytical reasoning, and passage-based questions.",
    },
    {
      question: "How many years of teaching experience does he have?",
      answer:
        "The source document indicates 10+ years of experience, pending final verification.",
    },
    {
      question: "Why should students learn from Sachin Sir?",
      answer:
        "Students benefit from his concept-first approach, personalized mentoring, and focus on analytical Legal Reasoning practice.",
    },
  ],
};

export const atulSirProfile: FacultyProfileData = {
  heroTitle: "Atul Sir | Faculty & Academic Mentor",
  heroSummary:
    "Atul Sir is a Faculty & Academic Mentor at Law Prep Tutorial Delhi NCR, specializing in Quantitative Techniques for CLAT and other law entrance examinations. With 5+ years of teaching and mentoring experience, he helps students build confidence in mathematics through conceptual clarity, smart calculation methods, speed, and accuracy.",
  quickFacts: [
    { label: "Name", value: "Atul Sir" },
    {
      label: "Role",
      value: "Faculty & Academic Mentor, Law Prep Tutorial Delhi NCR",
    },
    {
      label: "Education",
      value: "B.Sc. Maths (Hons.), DU",
      note: "Qualification appears in the source document but should be confirmed before final publish.",
    },
    {
      label: "Teaches",
      value: "Quantitative Techniques",
      note: "Specializes in quantitative aptitude, data interpretation, arithmetic concepts, and shortcut techniques for CLAT.",
    },
    {
      label: "Experience",
      value: "5+ Years",
      note: "More than five years of mentoring students for CLAT and other law entrance examinations.",
    },
  ],
  background: {
    title: "Educational & Professional Background",
    paragraphs: [
      "Atul Sir has a B.Sc. Maths (Hons.) background from DU, supporting his work in quantitative analysis and logical problem-solving.",
      "At Law Prep Tutorial Delhi NCR, he teaches Quantitative Techniques, prepares practice exercises, evaluates student performance, and guides students toward stronger numerical aptitude.",
      "With 5+ years of experience, he has helped students improve calculation speed, accuracy, and confidence while solving mathematics-based CLAT questions.",
    ],
  },
  backgroundEyebrow: "Faculty & Academic Mentor",
  backgroundHeading:
    "Meet Atul Sir, Faculty & Academic Mentor at Law Prep Tutorial Delhi NCR",
  backgroundDescription:
    "Atul Sir makes Quantitative Techniques approachable by breaking down complex mathematical concepts into simple, practical methods that improve speed and accuracy.",
  backgroundPillars: [
    {
      title: "Educational & Professional Strength",
      text: "His mathematics background and analytical approach help him simplify arithmetic, quantitative aptitude, and data interpretation for CLAT.",
      icon: "landmark",
    },
    {
      title: "Role at Law Prep Tutorial",
      text: "He teaches Quantitative Techniques, conducts classroom sessions, designs practice exercises, mentors students, and supports exam strategy.",
      icon: "scale",
    },
    {
      title: "Achievements & Experience",
      text: "With 5+ years of mentoring experience, he has helped students improve quantitative aptitude and reduce fear of mathematics.",
      icon: "shield-check",
    },
  ],
  teaching: {
    title: "Quantitative Techniques taught for speed, accuracy, and confidence.",
    paragraphs: [
      "Atul Sir covers arithmetic, percentages, profit and loss, ratio and proportion, averages, time and work, time-speed-distance, simple and compound interest, data interpretation, graphs, tables, and numerical reasoning.",
      "His methodology combines conceptual explanations, step-by-step problem solving, regular practice, previous-year question analysis, mock tests, and performance evaluation.",
    ],
  },
  teachingPoints: [
    {
      title: "Conceptual Mathematics",
      description:
        "Builds a strong foundation through simple examples before advanced examination-level questions.",
    },
    {
      title: "Speed & Accuracy Enhancement",
      description:
        "Trains students to solve numerical problems efficiently through structured methods and calculation shortcuts.",
    },
    {
      title: "Personalized Student Mentorship",
      description:
        "Supports students through doubt-solving, performance reviews, and individual guidance.",
    },
  ],
  whyItMatters: {
    title: "Why this matters for Quantitative Techniques",
    paragraphs: [
      "Quantitative Techniques carries fewer questions in CLAT, but it can become a deciding scoring opportunity when students build clarity and confidence.",
      "Atul Sir's structured teaching and mentoring help students solve math questions accurately under exam pressure.",
    ],
  },
  faqs: [
    {
      question: "Who is Atul Sir?",
      answer:
        "Atul Sir is a Faculty & Academic Mentor at Law Prep Tutorial Delhi NCR specializing in Quantitative Techniques.",
    },
    {
      question: "What are his qualifications?",
      answer:
        "The source document lists B.Sc. Maths (Hons.), DU; this should be verified before final publication.",
    },
    {
      question: "Which subjects does he teach?",
      answer:
        "He teaches Quantitative Techniques, including arithmetic, data interpretation, percentages, averages, profit and loss, time and work, graphs, tables, and CLAT quantitative aptitude topics.",
    },
    {
      question: "How many years of teaching experience does he have?",
      answer:
        "He has more than 5 years of teaching and mentoring experience according to the source document.",
    },
    {
      question: "Why should students learn from Atul Sir?",
      answer:
        "Students benefit from his concept-based approach, smart calculation methods, regular practice, and personalized mentoring.",
    },
  ],
};

export const namrataMaamProfile: FacultyProfileData = {
  heroTitle: "Namrata Ma'am | Faculty & Academic Mentor",
  heroSummary:
    "Namrata Ma'am is a Faculty & Academic Mentor at Law Prep Tutorial Delhi NCR, specializing in English Language and Reading Comprehension for CLAT and other law entrance examinations. Her teaching helps students strengthen language proficiency, vocabulary, reading speed, and analytical comprehension.",
  quickFacts: [
    { label: "Name", value: "Namrata Ma'am" },
    {
      label: "Role",
      value: "Faculty & Academic Mentor, Law Prep Tutorial Delhi NCR",
    },
    {
      label: "Education",
      value: "Pending verification",
      note: "Educational qualification details were blank in the source document.",
    },
    {
      label: "Teaches",
      value: "English Language & Reading Comprehension",
      note: "Specializes in reading comprehension, grammar, vocabulary, verbal ability, and exam-oriented English preparation.",
    },
    {
      label: "Experience",
      value: "10+ Years",
      note: "Experience value appears in the source document but should be verified before final publish.",
    },
  ],
  background: {
    title: "Educational & Professional Background",
    paragraphs: [
      "Namrata Ma'am teaches English Language and Reading Comprehension with a focus on language proficiency, analytical reading, vocabulary, and verbal reasoning.",
      "At Law Prep Tutorial Delhi NCR, she conducts interactive sessions, resolves doubts, evaluates student performance, and guides aspirants through systematic preparation.",
      "Her methodology emphasizes regular reading, conceptual understanding, vocabulary development, and confidence in passage-based questions.",
    ],
  },
  backgroundEyebrow: "Faculty & Academic Mentor",
  backgroundHeading:
    "Meet Namrata Ma'am, Faculty & Academic Mentor at Law Prep Tutorial Delhi NCR",
  backgroundDescription:
    "Namrata Ma'am helps students strengthen English language skills through concept-based learning, reading practice, interactive classroom discussion, and personalized mentoring.",
  backgroundPillars: [
    {
      title: "Educational & Professional Strength",
      text: "Her language instruction expertise helps students simplify grammar, vocabulary, and reading comprehension into practical exam-ready techniques.",
      icon: "landmark",
    },
    {
      title: "Role at Law Prep Tutorial",
      text: "She teaches English Language and Reading Comprehension, mentors students, conducts classroom sessions, resolves doubts, and supports structured preparation.",
      icon: "scale",
    },
    {
      title: "Achievements & Experience",
      text: "She has mentored students through reading habits, vocabulary development, grammar concepts, and exam strategy.",
      icon: "shield-check",
    },
  ],
  teaching: {
    title: "English and Reading Comprehension taught for clarity and accuracy.",
    paragraphs: [
      "Namrata Ma'am covers grammar fundamentals, vocabulary development, sentence correction, para jumbles, inference-based questions, passage analysis, tone identification, contextual understanding, and verbal reasoning.",
      "Her methodology combines concept-building, reading exercises, vocabulary enrichment, previous-year question discussion, sectional practice, mock evaluation, and continuous feedback.",
    ],
  },
  teachingPoints: [
    {
      title: "Reading Comprehension Mastery",
      description:
        "Helps students improve reading speed, comprehension accuracy, and passage analysis through structured reading strategies.",
    },
    {
      title: "Language & Vocabulary Development",
      description:
        "Strengthens grammar fundamentals, contextual vocabulary, and language proficiency for exam performance.",
    },
    {
      title: "Personalized Academic Mentorship",
      description:
        "Provides doubt-solving, performance reviews, and individualized feedback for steady progress.",
    },
  ],
  whyItMatters: {
    title: "Why this matters for English Language preparation",
    paragraphs: [
      "CLAT English assesses comprehension, interpretation, vocabulary, and analytical reading skills rather than simple grammar rules.",
      "Namrata Ma'am helps students become confident readers through systematic instruction, structured practice, and continuous mentoring.",
    ],
  },
  faqs: [
    {
      question: "Who is Namrata Ma'am?",
      answer:
        "Namrata Ma'am is a Faculty & Academic Mentor at Law Prep Tutorial Delhi NCR specializing in English Language and Reading Comprehension.",
    },
    {
      question: "What are her qualifications?",
      answer:
        "Her educational qualifications are pending verification and should be updated once confirmed.",
    },
    {
      question: "Which subjects does she teach?",
      answer:
        "She teaches English Language and Reading Comprehension, including grammar, vocabulary, verbal ability, passage analysis, inference-based questions, and reading strategies.",
    },
    {
      question: "How many years of teaching experience does she have?",
      answer:
        "The source document indicates 10+ years of experience, pending final verification.",
    },
    {
      question: "Why should students learn from Namrata Ma'am?",
      answer:
        "Students benefit from her approach to reading comprehension, vocabulary enhancement, grammar fundamentals, personalized mentoring, and exam-focused practice.",
    },
  ],
};

export const amanSirProfile: FacultyProfileData = {
  heroTitle: "Aman Sir | Faculty & Academic Mentor",
  heroSummary:
    "Aman Sir is a Faculty & Academic Mentor at Law Prep Tutorial Delhi NCR, specializing in Logical Reasoning for CLAT and other law entrance examinations. He helps students strengthen analytical thinking, critical reasoning, and logical problem-solving through structured, concept-driven teaching.",
  quickFacts: [
    { label: "Name", value: "Aman Sir" },
    {
      label: "Role",
      value: "Faculty & Academic Mentor, Law Prep Tutorial Delhi NCR",
    },
    {
      label: "Education",
      value: "Pending verification",
      note: "Educational qualification details were blank in the source document.",
    },
    {
      label: "Teaches",
      value: "Logical Reasoning",
      note: "Specializes in analytical reasoning, critical thinking, puzzles, and examination strategies for CLAT.",
    },
    {
      label: "Experience",
      value: "4+ Years",
      note: "Experience value appears in the source document but should be verified before final publish.",
    },
  ],
  background: {
    title: "Educational & Professional Background",
    paragraphs: [
      "Aman Sir teaches Logical Reasoning with a focus on analytical reasoning, structured problem-solving, and logical thinking.",
      "At Law Prep Tutorial Delhi NCR, he conducts classroom sessions, designs practice modules, resolves doubts, evaluates performance, and guides aspirants through disciplined preparation.",
      "His teaching encourages students to identify logical patterns, analyze information systematically, and solve reasoning problems efficiently under exam conditions.",
    ],
  },
  backgroundEyebrow: "Faculty & Academic Mentor",
  backgroundHeading:
    "Meet Aman Sir, Faculty & Academic Mentor at Law Prep Tutorial Delhi NCR",
  backgroundDescription:
    "Aman Sir helps students develop strong logical reasoning skills through concept-based learning, interactive sessions, continuous mentoring, and examination-oriented practice.",
  backgroundPillars: [
    {
      title: "Educational & Professional Strength",
      text: "His Logical Reasoning expertise helps simplify analytical concepts into structured learning techniques for CLAT aspirants.",
      icon: "landmark",
    },
    {
      title: "Role at Law Prep Tutorial",
      text: "He teaches Logical Reasoning, mentors CLAT aspirants, conducts lectures, prepares practice sessions, resolves doubts, and evaluates performance.",
      icon: "scale",
    },
    {
      title: "Achievements & Experience",
      text: "He has mentored CLAT aspirants through logical reasoning practice, classroom teaching, and individualized academic guidance.",
      icon: "shield-check",
    },
  ],
  teaching: {
    title: "Logical Reasoning through concepts, timed practice, and feedback.",
    paragraphs: [
      "Aman Sir covers analytical reasoning, critical reasoning, syllogisms, arrangements, puzzles, coding-decoding, logical sequences, statement-based reasoning, assumptions, conclusions, and decision-making techniques.",
      "His methodology integrates conceptual explanations, interactive discussion, previous-year question analysis, sectional practice, timed exercises, mock evaluation, and personalized mentoring.",
    ],
  },
  teachingPoints: [
    {
      title: "Concept-Based Reasoning",
      description:
        "Builds conceptual understanding by simplifying analytical ideas into practical problem-solving methods.",
    },
    {
      title: "Examination Strategy",
      description:
        "Prepares students through CLAT-style exercises, previous-year papers, timed practice, and structured solving methods.",
    },
    {
      title: "Individual Academic Guidance",
      description:
        "Provides doubt-solving, personalized feedback, and performance analysis for confidence and improvement.",
    },
  ],
  whyItMatters: {
    title: "Why this matters for Logical Reasoning",
    paragraphs: [
      "Logical Reasoning requires analytical thinking, structured problem-solving, and effective time management.",
      "Aman Sir's concept-driven teaching, mentoring, and exam-oriented preparation help students improve logical aptitude and confidence.",
    ],
  },
  faqs: [
    {
      question: "Who is Aman Sir?",
      answer:
        "Aman Sir is a Faculty & Academic Mentor at Law Prep Tutorial Delhi NCR specializing in Logical Reasoning.",
    },
    {
      question: "What are his qualifications?",
      answer:
        "His educational qualifications are pending verification and should be updated once confirmed.",
    },
    {
      question: "Which subjects does he teach?",
      answer:
        "He teaches Logical Reasoning, including analytical reasoning, critical thinking, puzzles, syllogisms, logical sequences, coding-decoding, statement-based reasoning, and decision-making.",
    },
    {
      question: "How many years of teaching experience does he have?",
      answer:
        "The source document indicates 4+ years of experience, pending final verification.",
    },
    {
      question: "Why should students learn from Aman Sir?",
      answer:
        "Students benefit from his structured approach to Logical Reasoning, concept clarity, timed practice, and personalized mentoring.",
    },
  ],
};

export const ankitSirProfile: FacultyProfileData = {
  heroTitle: "Ankit Sir | Faculty & Academic Mentor",
  heroSummary:
    "Ankit Sir is a Faculty & Academic Mentor at Law Prep Tutorial Delhi NCR, specializing in Critical Reasoning for CLAT and other law entrance examinations. Holding a Bachelor of Engineering degree, he brings 13+ years of teaching and mentoring experience in analytical thinking, logical reasoning, and problem-solving.",
  quickFacts: [
    { label: "Name", value: "Ankit Sir" },
    {
      label: "Role",
      value: "Faculty & Academic Mentor, Law Prep Tutorial Delhi NCR",
    },
    { label: "Education", value: "Bachelor of Engineering (B.E.)" },
    {
      label: "Teaches",
      value: "Critical Reasoning",
      note: "Specializes in analytical reasoning, critical thinking, logical arguments, and exam-oriented reasoning strategies for CLAT.",
    },
    {
      label: "Experience",
      value: "13+ Years",
      note: "More than thirteen years of mentoring students for CLAT and other competitive law entrance examinations.",
    },
  ],
  background: {
    title: "Educational & Professional Background",
    paragraphs: [
      "Ankit Sir holds a Bachelor of Engineering, giving him a strong analytical, logical, and problem-solving foundation.",
      "At Law Prep Tutorial Delhi NCR, he teaches Critical Reasoning, develops reasoning practice modules, evaluates student performance, and provides personalized guidance.",
      "With 13+ years of teaching and mentoring experience, he has guided CLAT aspirants in logical reasoning, critical thinking, decision-making, and examination strategy.",
    ],
  },
  backgroundEyebrow: "Faculty & Academic Mentor",
  backgroundHeading:
    "Meet Ankit Sir, Faculty & Academic Mentor at Law Prep Tutorial Delhi NCR",
  backgroundDescription:
    "With over thirteen years of mentoring experience and a strong engineering-based analytical foundation, Ankit Sir helps students master Critical Reasoning through structured learning and practical problem-solving.",
  backgroundPillars: [
    {
      title: "Educational & Professional Strength",
      text: "His Bachelor of Engineering background supports a systematic and analytical approach to Critical Reasoning.",
      icon: "landmark",
    },
    {
      title: "Role at Law Prep Tutorial",
      text: "He teaches Critical Reasoning, mentors CLAT aspirants, prepares reasoning practice sessions, resolves doubts, and guides examination preparation.",
      icon: "scale",
    },
    {
      title: "Achievements & Experience",
      text: "With 13+ years of experience, he has helped aspirants strengthen reasoning ability through concept-based teaching, assessments, and personalized guidance.",
      icon: "shield-check",
    },
  ],
  teaching: {
    title: "Critical Reasoning taught from first principles to exam strategy.",
    paragraphs: [
      "Ankit Sir covers logical arguments, assumptions, conclusions, inference-based reasoning, statement analysis, strengthening and weakening arguments, analytical thinking, decision-making, and related CLAT reasoning concepts.",
      "His methodology integrates conceptual discussion, previous-year question analysis, sectional practice, classroom interaction, mock tests, and continuous performance evaluation.",
    ],
  },
  teachingPoints: [
    {
      title: "Strong Conceptual Foundation",
      description:
        "Builds logical reasoning from first principles so students understand the reason behind every answer.",
    },
    {
      title: "Examination-Oriented Problem Solving",
      description:
        "Uses CLAT-pattern exercises, previous-year papers, timed practice, and strategic approaches for speed and accuracy.",
    },
    {
      title: "Personalized Student Mentorship",
      description:
        "Provides continuous guidance, doubt-solving, performance reviews, and individualized feedback.",
    },
  ],
  whyItMatters: {
    title: "Why this matters for Critical Reasoning",
    paragraphs: [
      "Critical Reasoning requires students to think analytically, evaluate arguments objectively, and make sound logical decisions.",
      "With 13+ years of experience, Ankit Sir combines analytical expertise with mentoring to help students perform confidently in competitive law entrance examinations.",
    ],
  },
  faqs: [
    {
      question: "Who is Ankit Sir?",
      answer:
        "Ankit Sir is a Faculty & Academic Mentor at Law Prep Tutorial Delhi NCR specializing in Critical Reasoning.",
    },
    {
      question: "What are his qualifications?",
      answer:
        "He holds a Bachelor of Engineering (B.E.), which supports his analytical and problem-solving approach to Critical Reasoning.",
    },
    {
      question: "Which subjects does he teach?",
      answer:
        "He teaches Critical Reasoning, including logical arguments, assumptions, conclusions, inference-based reasoning, statement analysis, critical thinking, decision-making, and analytical reasoning.",
    },
    {
      question: "How many years of teaching experience does he have?",
      answer:
        "He has more than 13 years of teaching and mentoring experience in CLAT and law entrance preparation.",
    },
    {
      question: "Why should students learn from Ankit Sir?",
      answer:
        "Students benefit from his 13+ years of mentoring experience, engineering-backed analytical approach, concept clarity, and exam-oriented reasoning strategy.",
    },
  ],
};

const facultyProfilesBySlug: Record<string, FacultyProfileData> = {
  "anand-sharma": anandSharmaProfile,
  "eikluvya-sir": eikluvyaSirProfile,
  "priyam-maam": priyamMaamProfile,
  "vikrant-sir": vikrantSirProfile,
  "shashank-sir": shashankSirProfile,
  "krishna-sir": krishnaSirProfile,
  "sachin-sir": sachinSirProfile,
  "atul-sir": atulSirProfile,
  "namrata-maam": namrataMaamProfile,
  "aman-sir": amanSirProfile,
  "ankit-sir": ankitSirProfile,
};

export function getFacultyMemberBySlug(slug: string): FacultyMember | undefined {
  return facultyMembers.find((member) => member.slug === slug);
}

export function getFacultyProfileBySlug(
  slug: string
): FacultyProfileData | undefined {
  return facultyProfilesBySlug[slug];
}

// Filters for the roster, matched against each mentor's role line.
export const FACULTY_SUBJECTS = [
  { key: "Legal", match: /legal/i },
  { key: "Reasoning", match: /critical|logical/i },
  { key: "English", match: /english/i },
  { key: "GK", match: /gk|general knowledge|current affairs/i },
  { key: "Quant", match: /quant/i },
] as const;

export function facultySubjects(member: FacultyMember) {
  return FACULTY_SUBJECTS.filter((s) => s.match.test(member.role)).map((s) => s.key);
}

/** Years from the profile's Experience fact ("10+ Years"), or null while it's pending verification. */
export function facultyExperience(slug: string) {
  const value = getFacultyProfileBySlug(slug)?.quickFacts.find((f) => f.label === "Experience")?.value ?? "";
  const years = parseInt(value, 10);
  return Number.isNaN(years) ? null : years;
}

/** Credential lines still awaiting verification aren't shown publicly. */
export function publicCredential(member: FacultyMember) {
  return /pending/i.test(member.credential) ? null : member.credential;
}
