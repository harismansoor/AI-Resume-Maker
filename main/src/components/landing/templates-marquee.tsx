"use client";
import { useEffect, useRef } from "react";
import Container from "@/components/ui/container";

export default function TemplatesMarquee() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let x = 0;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const tick = () => {
      x = (x + 0.3) % el.scrollWidth;
      el.style.transform = `translateX(-${x}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <section id="templates" className="border-y border-slate-200/70">
      <Container className="py-12">
        <h3 className="text-center text-lg font-medium text-slate-700">
          Preview templates
        </h3>
        <div className="relative mt-4 overflow-hidden">
          <div ref={ref} className="flex min-w-max gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="h-28 w-56 shrink-0 rounded-xl border bg-gradient-to-br from-slate-50 to-white shadow-sm"
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
