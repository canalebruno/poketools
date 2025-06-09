import { ReactNode } from "react";
import { usePokedex } from "../../hooks/usePokedex";
import ToggleButton from "./ToggleButton";
import styles from "./styles.module.scss";

interface ButtonsGroupProps {
  vertical?: boolean;
  children: ReactNode;
}

export default function ButtonsGroup({
  vertical = false,
  children,
}: ButtonsGroupProps) {
  return (
    <div className={`${styles.wrapper} ${vertical && styles.vertical}`}>
      {children}
    </div>
  );
}
