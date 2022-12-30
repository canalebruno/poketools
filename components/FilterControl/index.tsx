import { useEffect, useState } from "react";
import { usePokedex } from "../../hooks/usePokedex";
import styles from "./styles.module.scss";
import SearchBox from "../SearchBox";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import VisibilityTwoToneIcon from "@mui/icons-material/VisibilityTwoTone";
import VisibilityOffTwoToneIcon from "@mui/icons-material/VisibilityOffTwoTone";

interface FilterControlProps {
  sortingDefault: "p" | "n";
  vertical?: boolean;
}

export default function FilterControl({
  sortingDefault,
  vertical = false,
}: FilterControlProps) {
  const [pagePath, setPagePath] = useState("");

  const {
    viewGenderDifference,
    viewOnlyOneForm,
    handleSorting,
    orderList,
    resetControls,
    pokedex,
    breakByGen,
    filterValues,
    handleFilterValues,
  } = usePokedex();

  useEffect(() => {
    handleSorting(sortingDefault);
    setPagePath(window.location.pathname);
    resetControls();
  }, []);

  function handleSelectChange(event: SelectChangeEvent) {
    handleSorting(event.target.value as string);
  }

  return (
    <div className={styles.container}>
      <div
        className={`${styles.filterControl} ${
          vertical && styles.verticalFilter
        }`}
      >
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
            {pagePath === "/" && <MenuItem value={"p"}>Paldean Dex</MenuItem>}
          </Select>
        </FormControl>
        <ToggleButtonGroup
          orientation={vertical ? "vertical" : "horizontal"}
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
        {pokedex && <span>Showing: {pokedex.length} Pokemon</span>}
      </div>
    </div>
  );
}
