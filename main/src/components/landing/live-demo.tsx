"use client";

import { useMemo, useState } from "react";
import Container from "@/components/ui/container";
import TemplateMinimal from "@/components/templates/TemplateMinimal";
import TemplateElegant from "@/components/templates/TemplateElegant";
import TemplateCorporate from "@/components/templates/TemplateCorporate";
import type { ResumeData } from "@/types/resume";

const registry = {
  Minimal: TemplateMinimal,
  Elegant: TemplateElegant,
  Corporate: TemplateCorporate,
};
type Key = keyof typeof registry;

/**
 * IMPORTANT:
 * - Removed `role` (your ResumeItem type doesn’t include it).
 * - We only pass `data` to templates since your template props don’t include `sections`.
 */
const seed: ResumeData = {
  name: "Avery Harper",
  role: "Product Manager",
  contact: { email: "avery@example.com", location: "London, UK" },
  summary:
    "Product leader with 6+ years shipping user-centric features at scale.",
  skills: ["A/B Testing", "SQL", "Roadmapping"],
  experience: [
    {
      company: "Nimbus",
      // If your type has a different key (e.g., `position` or `title`), uncomment one of these:
      // position: 'Sr. PM',
      // title: 'Sr. PM',
      startDate: "2022",
      endDate: "Present",
      bullets: ["Led checkout revamp (+7% conv.)"],
    },
  ],
};

export default function LiveDemo() {
  const [name, setName] = useState(seed.name ?? "");
  const [template, setTemplate] = useState<Key>("Minimal");
  const Template = useMemo(() => registry[template], [template]);
  const demo = useMemo<ResumeData>(() => ({ ...seed, name }), [name]);

  return (
    <section id="demo" className="bg-slate-50/60">
      <Container className="py-16 md:py-24">
        <div className="grid items-start gap-6 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Try it — no sign-up
            </h2>
            <p className="mt-2 text-slate-600">
              Edit your name and switch templates. Full editing, AI suggestions,
              and export unlock after sign-in.
            </p>

            <div className="mt-5 space-y-3 rounded-2xl border bg-white p-4">
              <div>
                <label className="text-xs font-medium text-slate-700">
                  Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700">
                  Template
                </label>
                <div className="mt-1 flex gap-2">
                  {(["Minimal", "Elegant", "Corporate"] as Key[]).map((k) => (
                    <button
                      key={k}
                      onClick={() => setTemplate(k)}
                      className={`rounded-md border px-2 py-1 text-xs ${
                        template === k ? "border-black bg-black text-white" : ""
                      }`}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>

              <a
                href="/login"
                className="inline-block rounded-lg bg-black px-3 py-2 text-sm font-medium text-white"
              >
                Continue — Sign up for free
              </a>
              <p className="text-xs text-slate-500">
                5 free credits after signup.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-3 shadow-sm">
            {/* Your templates only accept { data } */}
            <Template data={demo} />
          </div>
        </div>
      </Container>
    </section>
  );
}
