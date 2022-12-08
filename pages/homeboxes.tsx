import Box from "../components/Box";
import styles from "../styles/Home.module.css";
import { usePokedex } from "../hooks/usePokedex";
import FilterControl from "../components/FilterControl";
import { useEffect } from "react";

export default function HomeBoxes() {
  const { firstLoadPokedex, pagePokedex, sortByNationalDex, updatePokedex } =
    usePokedex();

  useEffect(() => {
    firstLoadPokedex(pagePokedex());
    sortByNationalDex();
  }, []);

  return (
    <div className={styles.container}>
      <FilterControl sortingDefault="n" />
      <Box imageSource="home" />
    </div>
  );
}
