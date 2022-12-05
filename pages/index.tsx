import styles from "../styles/Home.module.css";

import Box from "../components/Box";
import { usePokedex } from "../hooks/usePokedex";
import FilterControl from "../components/FilterControl";
import { useEffect } from "react";

export default function Home() {
  const { setNewPokedex, pagePokedex, sortByPaldeanDex } = usePokedex();

  useEffect(() => {
    setNewPokedex(pagePokedex());
    sortByPaldeanDex();
  }, []);

  return (
    <div className={styles.container}>
      <FilterControl sortingDefault="p" />
      <Box imageSource="svicons" />
    </div>
  );
}
