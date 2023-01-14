import { useState } from "react";
import styles from "./styles.module.scss";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

interface FilterControlProps {
  vertical?: boolean;
}

export default function NuzlockeFilterControl({
  vertical = false,
}: FilterControlProps) {
  const [gameExclusive, setGameExclusive] = useState(["tradable"]);
  const [customOptions, setCustomOptions] = useState(["repeat"]);
  const [typeSelected, setTypeSelected] = useState("all");

  function handleExclusivityValues(
    event: React.MouseEvent<HTMLElement>,
    newValues: string[]
  ) {
    setGameExclusive(newValues);
  }

  function handleCustomValues(
    event: React.MouseEvent<HTMLElement>,
    newValues: string[]
  ) {
    setCustomOptions(newValues);
  }

  const handleChange = (event: SelectChangeEvent) => {
    setTypeSelected(event.target.value as string);
  };

  return (
    <div className={styles.container}>
      <ToggleButtonGroup
        orientation={vertical ? "vertical" : "horizontal"}
        exclusive
        value={gameExclusive}
        onChange={handleExclusivityValues}
        aria-label="game exclusive"
      >
        <ToggleButton value="scarlet" aria-label="scarlet">
          Scarlet Exclusives
        </ToggleButton>
        <ToggleButton value="violet" aria-label="violet">
          Violet Exclusives
        </ToggleButton>
        <ToggleButton value="tradable" aria-label="tradable">
          Trade Exclusives
        </ToggleButton>
      </ToggleButtonGroup>
      <ToggleButtonGroup
        orientation={vertical ? "vertical" : "horizontal"}
        value={customOptions}
        onChange={handleCustomValues}
        aria-label="game exclusive"
      >
        <ToggleButton value="basic" aria-label="only first stage pokémon">
          Only First Stage
        </ToggleButton>
        <ToggleButton value="repeat" aria-label="repeat pokémon species">
          Repeat Species
        </ToggleButton>
        <ToggleButton value="newGen" aria-label="only new generation pokémon">
          Only New Gen
        </ToggleButton>
      </ToggleButtonGroup>
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel id="type-select-label">Type</InputLabel>
        <Select
          labelId="type-select-label"
          id="type-select"
          value={typeSelected}
          label="Type"
          onChange={handleChange}
        >
          <MenuItem value={"all"}>All</MenuItem>
          <MenuItem value={"random"}>Random</MenuItem>
          <MenuItem value={"bug"}>Bug</MenuItem>
          <MenuItem value={"dark"}>Dark</MenuItem>
          <MenuItem value={"dragon"}>Dragon</MenuItem>
          <MenuItem value={"electric"}>Electric</MenuItem>
          <MenuItem value={"fairy"}>Fairy</MenuItem>
          <MenuItem value={"fighting"}>Fighting</MenuItem>
          <MenuItem value={"fire"}>Fire</MenuItem>
          <MenuItem value={"flying"}>Flying</MenuItem>
          <MenuItem value={"ghost"}>Ghost</MenuItem>
          <MenuItem value={"grass"}>Grass</MenuItem>
          <MenuItem value={"ground"}>Ground</MenuItem>
          <MenuItem value={"ice"}>Ice</MenuItem>
          <MenuItem value={"normal"}>Normal</MenuItem>
          <MenuItem value={"poison"}>Poison</MenuItem>
          <MenuItem value={"psychic"}>Psychic</MenuItem>
          <MenuItem value={"rock"}>Rock</MenuItem>
          <MenuItem value={"steel"}>Steel</MenuItem>
          <MenuItem value={"water"}>Water</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
