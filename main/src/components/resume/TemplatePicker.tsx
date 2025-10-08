type Opt = { id: string; name: string };
const options: Opt[] = [
  { id: "minimal", name: "Minimal" },
  { id: "elegant", name: "Elegant" },
];

export function TemplatePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm">Template</label>
      <select
        className="w-full rounded border bg-transparent px-3 py-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name}
          </option>
        ))}
      </select>
    </div>
  );
}
