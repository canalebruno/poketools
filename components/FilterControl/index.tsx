import Drawer from "@mui/material/Drawer";
import FilterAltTwoToneIcon from "@mui/icons-material/FilterAltTwoTone";
import Fab from "@mui/material/Fab";
import { useWindowSize } from "../../hooks/useWindowSize";
import { useEffect, useState } from "react";
import { usePokedex } from "../../hooks/usePokedex";
import styles from "./styles.module.scss";
import SortingSelect from "../Inputs/SortingSelect";
import ButtonsGroup from "../ButtonsGroup";

interface FilterControlProps {
  sortingDefault:
    | "paldean"
    | "national"
    | "hisuian"
    | "galarian"
    | "galarian-ioa"
    | "galarian-ct";
}

export default function FilterControl({ sortingDefault }: FilterControlProps) {
  const { windowWidth } = useWindowSize();
  const [isOpne, setIsOpen] = useState(false);

  function toggleDrawer(open: boolean) {
    setIsOpen(open);
  }

  const {
    handleSorting,
    resetControls,
    pokedexShown,
    firstLoad,
    setFirstLoad,
  } = usePokedex();

  useEffect(() => {
    if (firstLoad) {
      handleSorting(sortingDefault);
      resetControls();
      setFirstLoad(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstLoad]);

  if (windowWidth >= 720) {
    return (
      <div className={styles.container}>
        <div className={`${styles.filterControl}`}>
          <SortingSelect />
          <ButtonsGroup />
          {pokedexShown && <span>Showing: {pokedexShown.length} Pokemon</span>}
        </div>
      </div>
    );
  } else {
    return (
      <>
        <Fab
          onClick={() => toggleDrawer(true)}
          sx={{
            position: "fixed",
            right: "1.5rem",
            bottom: "1.5rem",
          }}
        >
          <FilterAltTwoToneIcon />
        </Fab>
        <Drawer
          anchor="right"
          open={isOpne}
          onClose={() => toggleDrawer(false)}
          sx={{
            "& .MuiPaper-root": { padding: "2rem 1rem" },
          }}
        >
          <div className={styles.container}>
            <div className={`${styles.filterControl} ${styles.verticalFilter}`}>
              <SortingSelect />
              <ButtonsGroup vertical />
              {pokedexShown && (
                <span>Showing: {pokedexShown.length} Pokemon</span>
              )}
            </div>
          </div>
        </Drawer>
      </>
    );
  }
}
