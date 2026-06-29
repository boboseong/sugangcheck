import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ReactNode;
  variant?: ButtonVariant;
};

export function Button({
  children,
  className = "",
  icon,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  const variantClass = variant === "secondary" ? "button--secondary" : "";

  return (
    <button
      className={["button", variantClass, className].filter(Boolean).join(" ")}
      type={type}
      {...props}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}
