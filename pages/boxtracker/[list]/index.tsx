import { useRouter } from "next/router";
import styles from "../../../styles/Home.module.scss";

export default function CustomBoxTracker() {
  const router = useRouter();
  const { list } = router.query;

  return <div className={styles.container}>Teste {list}</div>;
}
