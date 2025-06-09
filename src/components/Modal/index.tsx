import { ReactNode } from "react";
import styles from "./styles.module.scss";

interface ModalProps {
  children: ReactNode;
  open: boolean;
  onClose: () => void;
  fixedHeight?: boolean;
}

export default function Modal({
  children,
  open,
  onClose,
  fixedHeight = false,
}: ModalProps) {
  return open ? (
    <div className={styles.modalWrapper}>
      <div className={styles.background} onClick={onClose} />
      <div
        className={`${styles.container} ${fixedHeight && styles.fixedHeight}`}
      >
        {children}
      </div>
    </div>
  ) : (
    <></>
  );
}
