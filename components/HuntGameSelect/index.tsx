import { usePokedex } from "../../hooks/usePokedex";
import InputContainer from "../Inputs/InputContainer";

export default function HuntGameSelect() {
  const { handleSelectGame, huntGameSelection } = usePokedex();

  return (
    <InputContainer valueOn={""} label="Game Hunt">
      <select
        value={huntGameSelection}
        onChange={(event) => {
          handleSelectGame(event.target.value);
        }}
      >
        <option value="">Not Hunting</option>
        <option value="s">Scarlet</option>
        <option value="v">Violet</option>
        <option value="pla">Legends: Arceus</option>
        <option value="sw">Sword</option>
        <option value="sh">Shield</option>
        <option value="ioa">Isle of Armor</option>
        <option value="ct">Crown Tundra</option>
      </select>
    </InputContainer>
  );
}
