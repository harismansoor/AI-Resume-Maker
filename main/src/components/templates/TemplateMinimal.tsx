import type { ResumeData } from "@/types/resume";

/** tiny safe-read helpers */
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

type ExpItem = {
  title?: string;
  company?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  bullets?: string[];
};
type EduItem = {
  degree?: string;
  school?: string;
  year?: string;
  details?: string[];
};
type ProjectItem = {
  title?: string;
  bullets?: string[];
};

function asExpList(v: unknown): ExpItem[] {
  if (!Array.isArray(v)) return [];
  return v
    .map(asRecord)
    .filter(Boolean)
    .map((o) => ({
      title: asString(o!.title),
      company: asString(o!.company),
      location: asString(o!.location),
      startDate: asString(o!.startDate),
      endDate: asString(o!.endDate),
      bullets: asStringArray(o!.bullets),
    }));
}
function asEduList(v: unknown): EduItem[] {
  if (!Array.isArray(v)) return [];
  return v
    .map(asRecord)
    .filter(Boolean)
    .map((o) => ({
      degree: asString(o!.degree),
      school: asString(o!.school),
      year: asString(o!.year),
      details: asStringArray(o!.details),
    }));
}
function asProjectList(v: unknown): ProjectItem[] {
  if (!Array.isArray(v)) return [];
  return v
    .map(asRecord)
    .filter(Boolean)
    .map((o) => ({
      title: asString(o!.title),
      bullets: asStringArray(o!.bullets),
    }));
}

export default function TemplateMinimal({ data }: { data: ResumeData }) {
  const name =
    asString((data as unknown as { name?: unknown }).name) ?? "Your Name";
  const role = asString((data as unknown as { role?: unknown }).role);

  const contactRec =
    asRecord((data as unknown as { contact?: unknown }).contact) ?? {};
  const email = asString(contactRec.email);
  const phone = asString(contactRec.phone);
  const location = asString(contactRec.location);

  const summary = asString((data as unknown as { summary?: unknown }).summary);
  const skills = asStringArray(
    (data as unknown as { skills?: unknown }).skills
  );
  const experience = asExpList(
    (data as unknown as { experience?: unknown }).experience
  );
  const education = asEduList(
    (data as unknown as { education?: unknown }).education
  );
  const projects = asProjectList(
    (data as unknown as { projects?: unknown }).projects
  );
  const achievements = asStringArray(
    (data as unknown as { achievements?: unknown }).achievements
  );
  const certifications = asStringArray(
    (data as unknown as { certifications?: unknown }).certifications
  );
  const languages = asStringArray(
    (data as unknown as { languages?: unknown }).languages
  );

  return (
    <div
      id="resume"
      className="mx-auto max-w-[760px] bg-white text-black p-6 leading-relaxed"
    >
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-3xl font-bold">{name}</h1>
        {role && <div className="text-sm opacity-80">{role}</div>}
        <div className="mt-1 text-xs opacity-70">
          {[email, phone, location].filter(Boolean).join(" • ")}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <section className="mt-4">
          <h2 className="text-base font-semibold border-b pb-1">
            Professional Summary
          </h2>
          <p className="mt-2 text-sm">{summary}</p>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mt-4">
          <h2 className="text-base font-semibold border-b pb-1">Key Skills</h2>
          <p className="mt-2 text-sm">{skills.join(", ")}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mt-4">
          <h2 className="text-base font-semibold border-b pb-1">
            Work Experience
          </h2>
          <div className="mt-2 space-y-3">
            {experience.map((r, i) => (
              <div key={i}>
                <div className="text-sm font-semibold">
                  {r.title} {r.company ? `— ${r.company}` : ""}
                </div>
                <div className="text-xs opacity-70">
                  {[r.location, `${r.startDate ?? ""}—${r.endDate ?? ""}`]
                    .filter(Boolean)
                    .join(" • ")}
                </div>
                {r.bullets && r.bullets.length > 0 && (
                  <ul className="mt-1 list-disc pl-5 text-sm space-y-1">
                    {r.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mt-4">
          <h2 className="text-base font-semibold border-b pb-1">Education</h2>
          <div className="mt-2 space-y-2">
            {education.map((e, i) => (
              <div key={i} className="text-sm">
                <div className="font-medium">
                  {e.degree} {e.school ? `— ${e.school}` : ""}
                </div>
                {e.year && <div className="text-xs opacity-70">{e.year}</div>}
                {e.details && e.details.length > 0 && (
                  <ul className="mt-1 list-disc pl-5 space-y-1">
                    {e.details.map((d, j) => (
                      <li key={j}>{d}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mt-4">
          <h2 className="text-base font-semibold border-b pb-1">Projects</h2>
          <div className="mt-2 space-y-3">
            {projects.map((p, i) => (
              <div key={i}>
                <div className="text-sm font-semibold">{p.title}</div>
                {p.bullets && p.bullets.length > 0 && (
                  <ul className="mt-1 list-disc pl-5 text-sm space-y-1">
                    {p.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <section className="mt-4">
          <h2 className="text-base font-semibold border-b pb-1">
            Achievements
          </h2>
          <ul className="mt-2 list-disc pl-5 text-sm space-y-1">
            {achievements.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section className="mt-4">
          <h2 className="text-base font-semibold border-b pb-1">
            Certifications
          </h2>
          <ul className="mt-2 list-disc pl-5 text-sm space-y-1">
            {certifications.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <section className="mt-4">
          <h2 className="text-base font-semibold border-b pb-1">Languages</h2>
          <p className="mt-2 text-sm">{languages.join(", ")}</p>
        </section>
      )}
    </div>
  );
}
