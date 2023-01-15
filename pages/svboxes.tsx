import styles from "../styles/Home.module.scss";

import Box from "../components/Box";
import { usePokedex } from "../hooks/usePokedex";
import FilterControl from "../components/FilterControl";
import { useEffect } from "react";
import { useWindowSize } from "../hooks/useWindowSize";
import SearchBox from "../components/SearchBox";

export default function Home() {
  const { firstLoadPokedex, pagePokedex, sortByPaldeanDex } = usePokedex();

  const { windowWidth } = useWindowSize();

  useEffect(() => {
    firstLoadPokedex(pagePokedex());
    sortByPaldeanDex();
  }, []);

  return (
    <div className={styles.container}>
      <FilterControl sortingDefault="p" />
      <SearchBox />
      <Box imageSource="svicons" />
    </div>
  );
}
