export type StatusTone = "empty" | "ready" | "warning" | "error";

type StatusBadgeProps = {
  children: string;
  tone?: StatusTone;
};

export function StatusBadge({ children, tone = "empty" }: StatusBadgeProps) {
  return <span className={`status-badge status-badge--${tone}`}>{children}</span>;
}
