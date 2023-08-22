import styles from "../styles.module.scss";
import { ReactNode, useState, useEffect } from "react";

interface InputContainerProps {
  label: string;
  children: ReactNode;
  valueOn: string;
}

export default function InputContainer({
  label,
  children,
  valueOn,
}: InputContainerProps) {
  const [onFocus, setOnFocus] = useState(valueOn !== "");

  return (
    <div
      className={styles.container}
      onFocus={() => setOnFocus(true)}
      onBlur={() => {
        if (valueOn === "") {
          setOnFocus(false);
        }
      }}
    >
      {children}
      <fieldset style={{ height: onFocus ? "calc(100% + 0.45rem)" : "100%" }}>
        {onFocus && <legend>{label}</legend>}
      </fieldset>
    </div>
  );
}
