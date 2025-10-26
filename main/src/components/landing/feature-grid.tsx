import {
  Brain,
  FileText,
  ScanText,
  Sparkles,
  Layers,
  Clock,
} from "lucide-react";
import Container from "@/components/ui/container";

const items = [
  {
    icon: Brain,
    title: "Structured AI",
    desc: "True JSON schema for clean, ATS-safe output.",
  },
  {
    icon: ScanText,
    title: "Smart Import",
    desc: "DOCX/PDF → normalized sections with bullet clarity.",
  },
  {
    icon: FileText,
    title: "Live Templates",
    desc: "Instant design preview. Zero flicker.",
  },
  {
    icon: Layers,
    title: "Versioning",
    desc: "Branch resumes per role, keep history.",
  },
  {
    icon: Sparkles,
    title: "Role Tailoring",
    desc: "Adjust tone and focus to each job post.",
  },
  {
    icon: Clock,
    title: "Autosave",
    desc: "Never lose changes. Drafts persist.",
  },
];

export default function FeatureGrid() {
  return (
    <section id="features">
      <Container className="py-16 md:py-24">
        <h2 className="text-center text-3xl font-semibold tracking-tight">
          Built for quality. Optimized for speed.
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-slate-600">
          Everything you need to go from blank page to polished resume — fast.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border p-5 shadow-sm transition hover:shadow-md"
            >
              <Icon className="mb-3 h-5 w-5 text-slate-800" />
              <h3 className="font-medium">{title}</h3>
              <p className="mt-1 text-sm text-slate-600">{desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
