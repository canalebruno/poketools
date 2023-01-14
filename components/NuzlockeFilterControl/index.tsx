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

interface FilterControlProps {
  vertical?: boolean;
}

export default function NuzlockeFilterControl({
  vertical = false,
}: FilterControlProps) {
  const [gameExclusive, setGameExclusive] = useState(["tradable"]);

  function handleExclusivityValues(
    event: React.MouseEvent<HTMLElement>,
    newValues: string[]
  ) {
    setGameExclusive(newValues);
  }

  return (
    <div className={styles.container}>
      <ul>
        <li>repeat</li>
        <li>basic</li>
        <li>type</li>
        <li>new gen</li>
      </ul>
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
    </div>
  );
}
