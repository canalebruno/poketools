import Box from "../components/Box";
import styles from "../styles/Home.module.scss";
import { usePokedex } from "../hooks/usePokedex";
import FilterControl from "../components/FilterControl";
import { useEffect } from "react";
import { useWindowSize } from "../hooks/useWindowSize";
import SearchBox from "../components/SearchBox";

export default function HomeBoxes() {
  const { firstLoadPokedex, pagePokedex, sortByNationalDex, setFirstLoad } =
    usePokedex();

  const { windowWidth } = useWindowSize();

  useEffect(() => {
    firstLoadPokedex(pagePokedex());
    sortByNationalDex();
  }, []);

  return (
    <div className={styles.container}>
      <FilterControl sortingDefault="n" />
      <SearchBox />
      <Box imageSource="home" />
    </div>
  );
}
