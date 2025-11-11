import { ReactNode } from "react";
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
