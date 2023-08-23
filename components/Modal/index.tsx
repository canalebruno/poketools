import { ReactNode } from "react";
import styles from "./styles.module.scss";

interface ModalProps {
  children: ReactNode;
  open: boolean;
  onClose: () => void;
}

export default function Modal({ children, open, onClose }: ModalProps) {
  return open ? (
    <div className={styles.modalWrapper}>
      <div className={styles.background} onClick={onClose} />
      <div className={styles.container}>{children}</div>
    </div>
  ) : (
    <></>
  );
}
