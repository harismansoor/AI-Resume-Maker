import type { ResumeData } from "@/types/resume";

/** safe-read helpers */
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
type EduItem = { degree?: string; school?: string; year?: string };
type ProjectItem = { title?: string; bullets?: string[] };

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

export default function TemplateElegant({ data }: { data: ResumeData }) {
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

  return (
    <div
      id="resume"
      className="mx-auto max-w-[760px] bg-white text-[#1c1c1c] p-7 leading-relaxed"
    >
      <div className="border-b-2 border-[#222] pb-3">
        <h1 className="text-3xl font-extrabold tracking-tight">{name}</h1>
        {role && (
          <div className="mt-0.5 text-sm tracking-wide text-[#444]">{role}</div>
        )}
        <div className="mt-1 text-xs text-[#666]">
          {[email, phone, location].filter(Boolean).join(" • ")}
        </div>
      </div>

      <Section title="Summary">{summary}</Section>

      {skills.length > 0 && (
        <Section title="Skills">
          <div className="flex flex-wrap gap-1.5">
            {skills.map((s, i) => (
              <span key={i} className="rounded-full border px-2 py-0.5 text-xs">
                {s}
              </span>
            ))}
          </div>
        </Section>
      )}

      {experience.length > 0 && (
        <Section title="Experience">
          <div className="space-y-4">
            {experience.map((r, i) => (
              <div key={i}>
                <div className="text-sm font-semibold">
                  {r.title}{" "}
                  {r.company ? (
                    <span className="opacity-80">— {r.company}</span>
                  ) : null}
                </div>
                <div className="text-xs text-[#666]">
                  {[r.location, `${r.startDate ?? ""}—${r.endDate ?? ""}`]
                    .filter(Boolean)
                    .join(" • ")}
                </div>
                {r.bullets && r.bullets.length > 0 && (
                  <ul className="mt-1.5 ml-5 list-disc space-y-1 text-sm">
                    {r.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {education.length > 0 && (
        <Section title="Education">
          <div className="space-y-2">
            {education.map((e, i) => (
              <div key={i} className="text-sm">
                <div className="font-medium">
                  {e.degree} {e.school ? `— ${e.school}` : ""}
                </div>
                {e.year && <div className="text-xs text-[#666]">{e.year}</div>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {projects.length > 0 && (
        <Section title="Projects">
          <div className="space-y-3">
            {projects.map((p, i) => (
              <div key={i}>
                <div className="text-sm font-semibold">{p.title}</div>
                {p.bullets && p.bullets.length > 0 && (
                  <ul className="mt-1.5 ml-5 list-disc space-y-1 text-sm">
                    {p.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  if (!children) return null;
  return (
    <section className="mt-5">
      <h2 className="text-[15px] font-bold uppercase tracking-widest text-[#222]">
        {title}
      </h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}
