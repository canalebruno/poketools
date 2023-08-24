import { ReactNode, useState, useEffect } from "react";
import styles from "./styles.module.scss";

interface DrawerProps {
  children: ReactNode;
  open: boolean;
  onClose: () => void;
}

export default function Drawer({ children, open, onClose }: DrawerProps) {
  const [displayNone, setDisplayNone] = useState(true);

  useEffect(() => {
    if (open) {
      setDisplayNone(false);
    } else {
      setTimeout(() => setDisplayNone(true), 150);
    }
  }, [open]);

  return (
    <div
      style={{ display: displayNone ? "none" : "flex" }}
      className={`${styles.drawerWrapper} ${!open && styles.off}`}
    >
      <div className={styles.background} onClick={onClose} />
      <div className={styles.container}>{children}</div>
    </div>
  );
}
