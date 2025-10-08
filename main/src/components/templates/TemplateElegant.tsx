import type { ResumeData } from "@/types/resume";

export default function TemplateElegant({ data }: { data: ResumeData }) {
  return (
    <div
      id="resume"
      className="mx-auto max-w-[760px] bg-white text-[#1c1c1c] p-7 leading-relaxed"
    >
      <div className="border-b-2 border-[#222] pb-3">
        <h1 className="text-3xl font-extrabold tracking-tight">{data.name}</h1>
        <div className="mt-0.5 text-sm tracking-wide text-[#444]">
          {data.role}
        </div>
        <div className="mt-1 text-xs text-[#666]">
          {[data.contact.email, data.contact.phone, data.contact.location]
            .filter(Boolean)
            .join(" • ")}
        </div>
      </div>

      <Section title="Summary">{data.summary}</Section>

      {data.skills?.length ? (
        <Section title="Skills">
          <div className="flex flex-wrap gap-1.5">
            {data.skills.map((s, i) => (
              <span key={i} className="rounded-full border px-2 py-0.5 text-xs">
                {s}
              </span>
            ))}
          </div>
        </Section>
      ) : null}

      {data.experience?.length ? (
        <Section title="Experience">
          <div className="space-y-4">
            {data.experience.map((r, i) => (
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
                {r.bullets?.length ? (
                  <ul className="mt-1.5 ml-5 list-disc space-y-1 text-sm">
                    {r.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {data.education?.length ? (
        <Section title="Education">
          <div className="space-y-2">
            {data.education.map((e, i) => (
              <div key={i} className="text-sm">
                <div className="font-medium">
                  {e.degree} {e.school ? `— ${e.school}` : ""}
                </div>
                <div className="text-xs text-[#666]">{e.year}</div>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {data.projects?.length ? (
        <Section title="Projects">
          <div className="space-y-3">
            {data.projects.map((p, i) => (
              <div key={i}>
                <div className="text-sm font-semibold">{p.title}</div>
                {p.bullets?.length ? (
                  <ul className="mt-1.5 ml-5 list-disc space-y-1 text-sm">
                    {p.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        </Section>
      ) : null}
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
