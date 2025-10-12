import type { ResumeData } from "@/types/resume";

type ExperienceItem = {
  company?: string;
  role?: string;
  start?: string;
  end?: string;
  bullets?: string[];
};

type ProjectItem = {
  name?: string;
  link?: string;
  bullets?: string[];
};

type EducationItem = {
  school?: string;
  degree?: string;
  start?: string;
  end?: string;
  details?: string;
};

/* ---------- small type guards ---------- */
function asString(v: unknown): string | undefined {
  return typeof v === "string" ? v : undefined;
}
function asStringArray(v: unknown): string[] {
  return Array.isArray(v)
    ? v.filter((x): x is string => typeof x === "string")
    : [];
}
function asRecord(v: unknown): Record<string, unknown> | undefined {
  return v && typeof v === "object"
    ? (v as Record<string, unknown>)
    : undefined;
}
function asExperienceList(v: unknown): ExperienceItem[] {
  if (!Array.isArray(v)) return [];
  return v
    .map(asRecord)
    .filter(Boolean)
    .map((o) => ({
      company: asString(o!.company),
      role: asString(o!.role),
      start: asString(o!.start),
      end: asString(o!.end),
      bullets: asStringArray(o!.bullets),
    }));
}
function asProjectList(v: unknown): ProjectItem[] {
  if (!Array.isArray(v)) return [];
  return v
    .map(asRecord)
    .filter(Boolean)
    .map((o) => ({
      name: asString(o!.name),
      link: asString(o!.link),
      bullets: asStringArray(o!.bullets),
    }));
}
function asEducationList(v: unknown): EducationItem[] {
  if (!Array.isArray(v)) return [];
  return v
    .map(asRecord)
    .filter(Boolean)
    .map((o) => ({
      school: asString(o!.school),
      degree: asString(o!.degree),
      start: asString(o!.start),
      end: asString(o!.end),
      details: asString(o!.details),
    }));
}

/* ---------- Component ---------- */
export default function TemplateCorporate({ data }: { data: ResumeData }) {
  // name
  const name =
    asString((data as unknown as { name?: unknown }).name) ?? "Your Name";

  // optional fields that may or may not exist in your ResumeData schema
  const summary = asString((data as unknown as { summary?: unknown }).summary);

  // contact as a free-form record (email, phone, location, website, linkedin, github…)
  const contactRec =
    asRecord((data as unknown as { contact?: unknown }).contact) ??
    ({} as Record<string, unknown>);
  const email = asString(contactRec.email);
  const phone = asString(contactRec.phone);
  const location = asString(contactRec.location);
  const website = asString(contactRec.website);
  const linkedin = asString(contactRec.linkedin);
  const github = asString(contactRec.github);

  // collections
  const skills = asStringArray(
    (data as unknown as { skills?: unknown }).skills
  );
  const experience = asExperienceList(
    (data as unknown as { experience?: unknown }).experience
  );
  const projects = asProjectList(
    (data as unknown as { projects?: unknown }).projects
  );
  const education = asEducationList(
    (data as unknown as { education?: unknown }).education
  );

  return (
    <div className="px-8 py-10 text-sm leading-relaxed">
      <header className="mb-6 border-b border-neutral-300 pb-4">
        <h1 className="text-3xl font-semibold">{name}</h1>
        {/* If you later add a `title` field to ResumeData, render it here */}
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-500">
          {email && <span>{email}</span>}
          {phone && <span>{phone}</span>}
          {location && <span>{location}</span>}
          {website && <span>{website}</span>}
          {linkedin && <span>{linkedin}</span>}
          {github && <span>{github}</span>}
        </div>
      </header>

      {summary && (
        <section className="mb-4">
          <h2 className="mb-1 text-xs font-semibold uppercase tracking-wider">
            Summary
          </h2>
          <p>{summary}</p>
        </section>
      )}

      {skills.length > 0 && (
        <section className="mb-4">
          <h2 className="mb-1 text-xs font-semibold uppercase tracking-wider">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((s, i) => (
              <span key={i} className="rounded-full border px-2 py-0.5 text-xs">
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      {experience.length > 0 && (
        <section className="mb-4">
          <h2 className="mb-1 text-xs font-semibold uppercase tracking-wider">
            Experience
          </h2>
          <div className="space-y-3">
            {experience.map((e, i) => (
              <div key={i}>
                <div className="flex items-center justify-between">
                  <div className="font-medium">
                    {e.role ? `${e.role} — ` : ""}
                    {e.company}
                  </div>
                  <div className="text-xs text-neutral-500">
                    {(e.start ?? "").toString()}{" "}
                    {e.end ? `– ${e.end}` : "– Present"}
                  </div>
                </div>
                {e.bullets && e.bullets.length > 0 && (
                  <ul className="ml-6 list-disc text-sm">
                    {e.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section className="mb-4">
          <h2 className="mb-1 text-xs font-semibold uppercase tracking-wider">
            Projects
          </h2>
          <ul className="space-y-1">
            {projects.map((p, i) => (
              <li key={i}>
                <span className="font-medium">{p.name}</span>
                {p.link && (
                  <span className="text-neutral-500"> — {p.link}</span>
                )}
                {p.bullets && p.bullets.length > 0 && (
                  <ul className="ml-6 list-disc text-sm">
                    {p.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {education.length > 0 && (
        <section>
          <h2 className="mb-1 text-xs font-semibold uppercase tracking-wider">
            Education
          </h2>
          <ul className="space-y-1">
            {education.map((ed, i) => (
              <li key={i}>
                <div className="font-medium">{ed.school}</div>
                <div className="text-xs text-neutral-500">
                  {(ed.degree ?? "").toString()} {(ed.start ?? "").toString()}
                  {ed.end ? ` – ${ed.end}` : ""}
                </div>
                {ed.details && <p className="text-sm">{ed.details}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
