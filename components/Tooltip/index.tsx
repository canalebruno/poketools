import { ReactNode, useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { useWindowSize } from "../../hooks/useWindowSize";

interface TooltipProps {
  children: ReactNode;
  title: string;
}

export default function Tooltip({ children, title }: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { windowWidth } = useWindowSize();

  const mobile = windowWidth <= 1024;

  return (
    <div
      className={styles.wrapper}
      onMouseEnter={mobile ? undefined : () => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onClick={mobile ? () => setIsOpen(true) : undefined}
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
