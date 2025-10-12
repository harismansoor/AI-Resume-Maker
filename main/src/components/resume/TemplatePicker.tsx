type TemplateName = "Minimal" | "Elegant" | "Corporate";

const OPTIONS: TemplateName[] = ["Minimal", "Elegant", "Corporate"];

export function TemplatePicker({
  value,
  onChange,
}: {
  value: TemplateName | string;
  onChange: (next: TemplateName) => void;
}) {
  return (
    <select
      className="w-full rounded-xl bg-neutral-900 px-3 py-2 ring-1 ring-neutral-800 focus:ring-neutral-600"
      value={value}
      onChange={(e) => onChange(e.target.value as TemplateName)}
    >
      {OPTIONS.map((name) => (
        <option key={name} value={name}>
          {name}
        </option>
      ))}
    </select>
  );
}
