import { useEffect, useState } from "react";
import Modal from "../..";
import Button from "../../../Button";
import InputContainer from "../../../Inputs/InputContainer";
import AddPokemonButton from "../../../SelectAddRemovePokemon/AddButton";
import styles from "../../styles.module.scss";
import List from "../List";
import { usePokedex } from "../../../../hooks/usePokedex";
import { handleName } from "../../../../utils/NameFormatting";

interface BoxBuilderAddPokemonModalProps {
  isOpen: boolean;
  onClose: (b: boolean) => void;
}

export default function BoxBuilderAddPokemonModal({
  isOpen,
  onClose,
}: BoxBuilderAddPokemonModalProps) {
  const { pokedexShown, fullPokedex } = usePokedex();

  const [term, setTerm] = useState("");
  const [filteredDex, setFilteredDex] = useState(pokedexShown);
  const [isShiny, setIsShiny] = useState(false);

  useEffect(() => {
    if (term === "") {
      setFilteredDex(fullPokedex);
    } else {
      const newFilter = fullPokedex.filter((pokemon) => {
        return handleName(pokemon, true, "National", true)
          .toLowerCase()
          .includes(term.toLowerCase());
      });

      setFilteredDex(newFilter);
    }
  }, [term, fullPokedex]);

  return (
    <Modal open={isOpen} onClose={() => onClose(false)}>
      <div className={styles.header}>
        <h3>Add Pokémon</h3>
        <Button
          onClick={() => onClose(false)}
          variant="outlined"
          label="Close"
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          minHeight: "20vh",
        }}
      >
        <InputContainer fullWidth label="Pokémon" valueOn={term}>
          <input
            type="text"
            placeholder="Pokémon"
            value={term}
            onChange={(e) => {
              setTerm(e.target.value);
            }}
          />
        </InputContainer>
        <InputContainer label="Add Shiny" valueOn={"s"}>
          <input
            type="checkbox"
            checked={isShiny}
            onChange={() => setIsShiny(!isShiny)}
          />
        </InputContainer>
        <List isShiny={isShiny} listShown={filteredDex} />
      </div>
    </Modal>
  );
}
