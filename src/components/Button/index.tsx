import { ReactNode } from "react";
import styles from "./styles.module.scss";

interface ButtonProps {
  variant?: "contained" | "outlined";
  onClick: () => void;
  disabled?: boolean;
  label: string;
}

export default function Button({
  variant = "contained",
  onClick,
  disabled = false,
  label,
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`${styles.container} ${
        variant === "contained" && styles.contained
      } ${variant === "outlined" && styles.outlined}`}
    >
      {label.toUpperCase()}
    </button>
  );
}
