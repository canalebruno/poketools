import SquareLoading from "../SquareLoading";
import styles from "./styles.module.scss";

export default function BoxLoading() {
  return (
    <>
      {[...Array(2)].map((e, i) => {
        return (
          <div key={i} className={styles.boxContainer}>
            <div className={styles.boxHeader}>
              <span>Loading</span>
            </div>
            <div className={styles.boxGrid}>
              {[...Array(30)].map((e, i) => {
                return <SquareLoading key={i} />;
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}
