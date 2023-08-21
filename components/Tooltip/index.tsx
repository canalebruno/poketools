import { ReactNode, useEffect, useState } from "react";
import styles from "./styles.module.scss";

interface TooltipProps {
  children: ReactNode;
  title: string;
}

export default function Tooltip({ children, title }: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={styles.wrapper}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {children}
      {isOpen && (
        <div className={styles.container}>
          <svg height="6" width="8">
            <polygon points="4,0 0,6 8,6" />
          </svg>
          <div className={styles.titleWrapper}>{title}</div>
        </div>
      )}
    </div>
  );
}
