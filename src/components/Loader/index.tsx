import styles from "./styles.module.scss";

export default function Loader() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.loader}></div>
    </div>
  );
}
