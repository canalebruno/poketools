import { useEffect, useState } from "react";
import { usePokedex } from "../../hooks/usePokedex";
import styles from "./styles.module.scss";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import VisibilityTwoToneIcon from "@mui/icons-material/VisibilityTwoTone";
import VisibilityOffTwoToneIcon from "@mui/icons-material/VisibilityOffTwoTone";
import { useWindowSize } from "../../hooks/useWindowSize";
import Drawer from "@mui/material/Drawer";
import FilterAltTwoToneIcon from "@mui/icons-material/FilterAltTwoTone";
import Fab from "@mui/material/Fab";

interface FilterControlProps {
  sortingDefault: "p" | "n";
}

export default function FilterControl({ sortingDefault }: FilterControlProps) {
  const [pagePath, setPagePath] = useState("");
  const { windowWidth } = useWindowSize();
  const [isOpne, setIsOpen] = useState(false);

  function toggleDrawer(open: boolean) {
    setIsOpen(open);
  }

  const {
    viewGenderDifference,
    viewOnlyOneForm,
    handleSorting,
    orderList,
    resetControls,
    pokedexShown,
    breakByGen,
    filterValues,
    handleFilterValues,
    firstLoad,
    setFirstLoad,
  } = usePokedex();

  useEffect(() => {
    if (firstLoad) {
      handleSorting(sortingDefault);
      setPagePath(window.location.pathname);
      resetControls();
      setFirstLoad(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstLoad]);

  function handleSelectChange(event: SelectChangeEvent) {
    const orderListValues = [
      "p",
      "n",
      "hisuian",
      "galarian",
      "galarian-ioa",
      "galarian-ct",
    ];

    const selectionOrder = event.target.value;

    if (!orderListValues.includes(selectionOrder)) {
      return;
    } else {
      handleSorting(
        selectionOrder as
          | "p"
          | "n"
          | "hisuian"
          | "galarian"
          | "galarian-ioa"
          | "galarian-ct"
      );
    }
  }

  if (windowWidth >= 720) {
    return (
      <div className={styles.container}>
        <div className={`${styles.filterControl}`}>
          <FormControl>
            <InputLabel id="sort-by-select-label">Sort by</InputLabel>
            <Select
              labelId="sort-by-select-label"
              id="sort-by-select"
              value={orderList}
              label="Sort by"
              onChange={handleSelectChange}
            >
              <MenuItem value={"n"}>National Dex</MenuItem>
              {pagePath === "/svboxes" && (
                <MenuItem value={"p"}>Paldean Dex</MenuItem>
              )}
              <MenuItem value={"hisuian"}>Hisuian Dex</MenuItem>
              <MenuItem value={"galarian"}>Galarian Dex</MenuItem>
              <MenuItem value={"ioa"}>Isle of Armour Dex</MenuItem>
              <MenuItem value={"ct"}>Crown Tundra Dex</MenuItem>
            </Select>
          </FormControl>
          <ToggleButtonGroup
            value={filterValues}
            onChange={handleFilterValues}
            aria-label="text formatting"
          >
            <ToggleButton value="gender" aria-label="gender">
              {viewGenderDifference ? (
                <VisibilityTwoToneIcon />
              ) : (
                <VisibilityOffTwoToneIcon />
              )}
              Gender Difference
            </ToggleButton>
            <ToggleButton value="oneForm" aria-label="oneForm">
              {viewOnlyOneForm ? (
                <VisibilityTwoToneIcon />
              ) : (
                <VisibilityOffTwoToneIcon />
              )}
              Only 1 Form
            </ToggleButton>
            <ToggleButton value="gen" aria-label="gen">
              {breakByGen ? (
                <VisibilityTwoToneIcon />
              ) : (
                <VisibilityOffTwoToneIcon />
              )}
              Break by Gen
            </ToggleButton>
          </ToggleButtonGroup>
          {pokedexShown && <span>Showing: {pokedexShown.length} Pokemon</span>}
        </div>
      </div>
    );
  } else {
    return (
      <>
        <Fab
          onClick={(e) => toggleDrawer(true)}
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
          onClose={(e) => toggleDrawer(false)}
          sx={{
            "& .MuiPaper-root": { padding: "2rem 1rem" },
          }}
        >
          <div className={styles.container}>
            <div className={`${styles.filterControl} ${styles.verticalFilter}`}>
              <FormControl>
                <InputLabel id="demo-simple-select-label">Sort by</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={orderList}
                  label="Sort by"
                  onChange={handleSelectChange}
                >
                  <MenuItem value={"n"}>National Dex</MenuItem>
                  {pagePath === "/svboxes" && (
                    <MenuItem value={"p"}>Paldean Dex</MenuItem>
                  )}
                </Select>
              </FormControl>
              <ToggleButtonGroup
                orientation={"vertical"}
                value={filterValues}
                onChange={handleFilterValues}
                aria-label="text formatting"
              >
                <ToggleButton value="gender" aria-label="gender">
                  {viewGenderDifference ? (
                    <VisibilityTwoToneIcon />
                  ) : (
                    <VisibilityOffTwoToneIcon />
                  )}
                  Gender Difference
                </ToggleButton>
                <ToggleButton value="oneForm" aria-label="oneForm">
                  {viewOnlyOneForm ? (
                    <VisibilityTwoToneIcon />
                  ) : (
                    <VisibilityOffTwoToneIcon />
                  )}
                  Only 1 Form
                </ToggleButton>
                <ToggleButton value="gen" aria-label="gen">
                  {breakByGen ? (
                    <VisibilityTwoToneIcon />
                  ) : (
                    <VisibilityOffTwoToneIcon />
                  )}
                  Break by Gen
                </ToggleButton>
              </ToggleButtonGroup>
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
