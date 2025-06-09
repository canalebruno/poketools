import { usePokedex } from "../../hooks/usePokedex";
import InputContainer from "../Inputs/InputContainer";
import SettingsIcon from "@mui/icons-material/Settings";
import styles from "./styles.module.scss";
import HuntOptions from "./HuntOptions";
import { useEffect, useState } from "react";
import { GameSelection } from "../../utils/types";

export default function HuntGameSelect() {
  const { handleSelectGame, huntGameSelection } = usePokedex();
  const [isOpen, setIsOpen] = useState(false);

  const validOptions = ["sv", "swsh"];

  return (
    <>
      <HuntOptions isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <InputContainer valueOn={""} label="Game Hunt">
        <select
          value={huntGameSelection?.baseGame}
          onChange={(event) => {
            const option = event.target.value;

            if (option === "") {
              handleSelectGame(null);
            } else {
              const game: GameSelection = {
                baseGame: event.target.value,
                exclusives: null,
              };
              handleSelectGame(game);
            }
          }}
        >
          <option value="">Not Hunting</option>
          <option value="sv">Scarlet & Violet</option>
          <option value="pla">Legends: Arceus</option>
          <option value="swsh">Sword & Shield</option>
        </select>
        {huntGameSelection &&
          validOptions.includes(huntGameSelection.baseGame) && (
            <button
              onClick={() => setIsOpen(true)}
              className={styles.iconButton}
            >
              <SettingsIcon />
            </button>
          )}
      </InputContainer>
    </>
  );
}
