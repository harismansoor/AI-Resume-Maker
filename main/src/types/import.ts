export type ImportedData = {
  name?: string;
  role?: string;
  contact?: {
    email?: string;
    phone?: string;
    location?: string;
    links?: string[];
  };
  summary?: string;
  skills?: string[];               // e.g. ["React","TS","Next.js"]
  experience?: Array<{
    title?: string;
    company?: string;
    location?: string;
    dates?: string;
    bullets?: string[];            // achievements/responsibilities
  }>;
  education?: Array<{ degree?: string; school?: string; year?: string }>;
  projects?: Array<{ title?: string; company?: string; bullets?: string[] }>;
  achievements?: string[];
  certifications?: string[];
  languages?: string[];
};
