import Box from "../components/Box";
import styles from "../styles/Home.module.css";
import { usePokedex } from "../hooks/usePokedex";
import FilterControl from "../components/FilterControl";
import { useEffect } from "react";

export default function HomeBoxes() {
  const { setNewPokedex, pagePokedex, sortByNationalDex } = usePokedex();

  useEffect(() => {
    setNewPokedex(pagePokedex());
    sortByNationalDex();
  }, []);

  return (
    <div className={styles.container}>
      <FilterControl sortingDefault="n" />
      <Box imageSource="home" />
    </div>
  );
}
