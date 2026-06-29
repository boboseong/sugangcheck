import { HelpCircle } from "lucide-react";

type HelpPanelProps = {
  title: string;
  items: readonly string[];
};

export function HelpPanel({ title, items }: HelpPanelProps) {
  return (
    <aside className="help-panel">
      <div className="help-panel__title">
        <HelpCircle size={17} />
        <h2>{title}</h2>
      </div>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </aside>
  );
}
