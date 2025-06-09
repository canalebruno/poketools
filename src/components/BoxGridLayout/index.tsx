import { ReactNode } from "react";
import styles from "./styles.module.scss";

interface BoxGridLayoutProps {
  children: ReactNode;
}

export default function BoxGridLayout({ children }: BoxGridLayoutProps) {
  return <div className={styles.container}>{children}</div>;
}
