import Container from "@/components/ui/container";

export default function Logos() {
  return (
    <section className="border-y border-slate-200/70 bg-slate-50/60">
      <Container className="flex flex-wrap items-center justify-center gap-8 py-6 text-xs text-slate-500">
        <span>Trusted by job-seekers from</span>
        <span className="font-semibold text-slate-600">FAANG</span>
        <span className="font-semibold text-slate-600">Big-4</span>
        <span className="font-semibold text-slate-600">Fortune 500</span>
        <span className="font-semibold text-slate-600">Y-Combinator</span>
      </Container>
    </section>
  );
}
