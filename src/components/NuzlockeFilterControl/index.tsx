import styles from "./styles.module.scss";
import { useNuzlocke } from "../../hooks/useNuzlocke";
import ButtonsGroup from "../ButtonsGroup";
import ToggleButton from "../ButtonsGroup/ToggleButton";
import InputContainer from "../Inputs/InputContainer";

// interface FilterControlProps {
//   vertical?: boolean;
// }

export default function NuzlockeFilterControl() {
  const {
    gameExclusive,
    setGameExclusive,
    customOptions,
    setCustomOptions,
    typeSelected,
    setTypeSelected,
  } = useNuzlocke();

  const handleChange = (newValue: string) => {
    setTypeSelected(newValue);
  };

  return (
    <div className={styles.container}>
      <ButtonsGroup>
        <ToggleButton
          label="Scarlet Exclusives"
          hideEyeIcon={true}
          controller={gameExclusive === "scarlet"}
          onClick={() => setGameExclusive("scarlet")}
        />
        <ToggleButton
          label="Violet Exclusives"
          hideEyeIcon={true}
          controller={gameExclusive === "violet"}
          onClick={() => setGameExclusive("violet")}
        />
        <ToggleButton
          label="Trade Exclusives"
          hideEyeIcon={true}
          controller={gameExclusive === "tradable"}
          onClick={() => setGameExclusive("tradable")}
        />
      </ButtonsGroup>
      <ButtonsGroup>
        <ToggleButton
          label="Only First Stage"
          hideEyeIcon={true}
          controller={customOptions.includes("basic")}
          onClick={() => {
            if (customOptions.includes("basic")) {
              const newOptions = customOptions.filter((option) => {
                return option !== "basic";
              });

              setCustomOptions(newOptions);
            } else {
              setCustomOptions([...customOptions, "basic"]);
            }
          }}
        />
        <ToggleButton
          label="Repeat Species"
          hideEyeIcon={true}
          controller={customOptions.includes("repeat")}
          onClick={() => {
            if (customOptions.includes("repeat")) {
              const newOptions = customOptions.filter((option) => {
                return option !== "repeat";
              });

              setCustomOptions(newOptions);
            } else {
              setCustomOptions([...customOptions, "repeat"]);
            }
          }}
        />
        <ToggleButton
          label="Only New Gen"
          hideEyeIcon={true}
          controller={customOptions.includes("newGen")}
          onClick={() => {
            if (customOptions.includes("newGen")) {
              const newOptions = customOptions.filter((option) => {
                return option !== "newGen";
              });

              setCustomOptions(newOptions);
            } else {
              setCustomOptions([...customOptions, "newGen"]);
            }
          }}
        />
      </ButtonsGroup>
      <InputContainer label="Type" valueOn={typeSelected}>
        <select
          value={typeSelected}
          onChange={(event) => handleChange(event.target.value)}
        >
          <option value={"all"}>All</option>
          <option value={"random"}>Random</option>
          <option value={"bug"}>Bug</option>
          <option value={"dark"}>Dark</option>
          <option value={"dragon"}>Dragon</option>
          <option value={"electric"}>Electric</option>
          <option value={"fairy"}>Fairy</option>
          <option value={"fighting"}>Fighting</option>
          <option value={"fire"}>Fire</option>
          <option value={"flying"}>Flying</option>
          <option value={"ghost"}>Ghost</option>
          <option value={"grass"}>Grass</option>
          <option value={"ground"}>Ground</option>
          <option value={"ice"}>Ice</option>
          <option value={"normal"}>Normal</option>
          <option value={"poison"}>Poison</option>
          <option value={"psychic"}>Psychic</option>
          <option value={"rock"}>Rock</option>
          <option value={"steel"}>Steel</option>
          <option value={"water"}>Water</option>
        </select>
      </InputContainer>
    </div>
  );
}
