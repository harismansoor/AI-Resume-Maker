import Container from "@/components/ui/container";

const steps = [
  {
    title: "Pick a template",
    desc: "Minimal, Elegant, or Corporate — switch anytime.",
  },
  {
    title: "Import or start fresh",
    desc: "PDF/DOCX import or AI-guided creation.",
  },
  {
    title: "Tailor & preview",
    desc: "Edit sections with instant, pixel-perfect preview.",
  },
  {
    title: "Export & apply",
    desc: "Download .docx and keep multiple role-specific versions.",
  },
];

export default function Steps() {
  return (
    <section id="how-it-works">
      <Container className="py-16 md:py-24">
        <h2 className="text-center text-3xl font-semibold tracking-tight">
          Your path to hired
        </h2>
        <div className="mx-auto mt-8 grid max-w-4xl gap-4 sm:grid-cols-2">
          {steps.map((s, i) => (
            <div key={i} className="rounded-2xl border p-5 shadow-sm">
              <div className="mb-2 text-xs font-mono text-slate-500">
                STEP {i + 1}
              </div>
              <h3 className="font-medium">{s.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
