import type { ResumeData } from "@/types/resume";

export default function TemplateMinimal({ data }: { data: ResumeData }) {
  return (
    <div
      id="resume"
      className="mx-auto max-w-[760px] bg-white text-black p-6 leading-relaxed"
    >
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-3xl font-bold">{data.name}</h1>
        <div className="text-sm opacity-80">{data.role}</div>
        <div className="mt-1 text-xs opacity-70">
          {[data.contact.email, data.contact.phone, data.contact.location]
            .filter(Boolean)
            .join(" • ")}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <section className="mt-4">
          <h2 className="text-base font-semibold border-b pb-1">
            Professional Summary
          </h2>
          <p className="mt-2 text-sm">{data.summary}</p>
        </section>
      )}

      {/* Skills */}
      {data.skills?.length ? (
        <section className="mt-4">
          <h2 className="text-base font-semibold border-b pb-1">Key Skills</h2>
          <p className="mt-2 text-sm">{data.skills.join(", ")}</p>
        </section>
      ) : null}

      {/* Experience */}
      {data.experience?.length ? (
        <section className="mt-4">
          <h2 className="text-base font-semibold border-b pb-1">
            Work Experience
          </h2>
          <div className="mt-2 space-y-3">
            {data.experience.map((r, i) => (
              <div key={i}>
                <div className="text-sm font-semibold">
                  {r.title} {r.company ? `— ${r.company}` : ""}
                </div>
                <div className="text-xs opacity-70">
                  {[r.location, `${r.startDate ?? ""}—${r.endDate ?? ""}`]
                    .filter(Boolean)
                    .join(" • ")}
                </div>
                {r.bullets?.length ? (
                  <ul className="mt-1 list-disc pl-5 text-sm space-y-1">
                    {r.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Education */}
      {data.education?.length ? (
        <section className="mt-4">
          <h2 className="text-base font-semibold border-b pb-1">Education</h2>
          <div className="mt-2 space-y-2">
            {data.education.map((e, i) => (
              <div key={i} className="text-sm">
                <div className="font-medium">
                  {e.degree} {e.school ? `— ${e.school}` : ""}
                </div>
                <div className="text-xs opacity-70">{e.year}</div>
                {e.details?.length ? (
                  <ul className="mt-1 list-disc pl-5 space-y-1">
                    {e.details.map((d, j) => (
                      <li key={j}>{d}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Optional sections */}
      {data.projects?.length ? (
        <section className="mt-4">
          <h2 className="text-base font-semibold border-b pb-1">Projects</h2>
          <div className="mt-2 space-y-3">
            {data.projects.map((p, i) => (
              <div key={i}>
                <div className="text-sm font-semibold">{p.title}</div>
                {p.bullets?.length ? (
                  <ul className="mt-1 list-disc pl-5 text-sm space-y-1">
                    {p.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {data.achievements?.length ? (
        <section className="mt-4">
          <h2 className="text-base font-semibold border-b pb-1">
            Achievements
          </h2>
          <ul className="mt-2 list-disc pl-5 text-sm space-y-1">
            {data.achievements.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {data.certifications?.length ? (
        <section className="mt-4">
          <h2 className="text-base font-semibold border-b pb-1">
            Certifications
          </h2>
          <ul className="mt-2 list-disc pl-5 text-sm space-y-1">
            {data.certifications.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {data.languages?.length ? (
        <section className="mt-4">
          <h2 className="text-base font-semibold border-b pb-1">Languages</h2>
          <p className="mt-2 text-sm">{data.languages.join(", ")}</p>
        </section>
      ) : null}
    </div>
  );
}
