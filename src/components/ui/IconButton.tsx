import type { ButtonHTMLAttributes, ReactNode } from "react";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: ReactNode;
  label: string;
};

export function IconButton({ icon, label, type = "button", ...props }: IconButtonProps) {
  return (
    <button
      className="icon-button"
      title={label}
      aria-label={label}
      type={type}
      {...props}
    >
      {icon}
    </button>
  );
}
