export type ResumeSectionId =
  | "summary"
  | "skills"
  | "experience"
  | "education"
  | "projects"
  | "achievements"
  | "certifications"
  | "languages";

export type ResumeItem = {
  title?: string;
  company?: string;
  location?: string;
  startDate?: string; // "2022" or "Jan 2022"
  endDate?: string;   // "Present" or "2024"
  bullets?: string[];
};

export type EducationItem = {
  degree?: string;
  school?: string;
  year?: string;
  details?: string[];
};

export type ResumeData = {
  name: string;
  role: string;
  contact: {
    email?: string;
    phone?: string;
    location?: string;
    links?: string[]; // optional portfolio/GitHub/LinkedIn
  };
  summary?: string;
  skills?: string[]; // ["React", "TypeScript", ...]
  experience?: ResumeItem[];
  education?: EducationItem[];
  projects?: ResumeItem[];
  achievements?: string[];
  certifications?: string[];
  languages?: string[]; // ["English — Fluent", ...]
};
