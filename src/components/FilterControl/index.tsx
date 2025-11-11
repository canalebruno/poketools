"use client";

import Fab from "@mui/material/Fab";
import FilterAltTwoToneIcon from "@mui/icons-material/FilterAltTwoTone";
import { useWindowSize } from "../../hooks/useWindowSize";
import { useEffect, useState } from "react";
import { usePokedex } from "../../hooks/usePokedex";
import styles from "./styles.module.scss";
import SortingSelect from "../Inputs/SortingSelect";
import FilterViewToggleButtons from "../FilterViewToggleButtons";
import Drawer from "../Drawer";

// REFATORAR AQUI FAB

interface FilterControlProps {
  sortingDefault:
    | "paldean"
    | "national"
    | "hisuian"
    | "galarian"
    | "galarian-ioa"
    | "galarian-ct"
    | "paldean-tm"
    | "paldean-bb";
}

export default function FilterControl({ sortingDefault }: FilterControlProps) {
  const { windowWidth } = useWindowSize();
  const [isOpne, setIsOpen] = useState(false);
  console.log(sortingDefault);

  function toggleDrawer(open: boolean) {
    setIsOpen(open);
  }

  const { resetControls, pokedexShown, firstLoad, setFirstLoad } = usePokedex();

  useEffect(() => {
    if (firstLoad) {
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
          <FilterViewToggleButtons />
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
        <Drawer open={isOpne} onClose={() => toggleDrawer(false)}>
          <div className={styles.container}>
            <div className={`${styles.filterControl} ${styles.verticalFilter}`}>
              <SortingSelect />
              <FilterViewToggleButtons vertical />
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
