import { useEffect, useState } from "react";
import Modal from "../..";
import Button from "../../../Button";
import InputContainer from "../../../Inputs/InputContainer";
import styles from "../styles.module.scss";
import { usePokedex } from "../../../../hooks/usePokedex";
import { handleName } from "../../../../utils/NameFormatting";
import Image from "next/image";

interface BoxBuilderRemovePokemonModalProps {
  isOpen: boolean;
  onClose: (b: boolean) => void;
}

export default function BoxBuilderRemovePokemonModal({
  isOpen,
  onClose,
}: BoxBuilderRemovePokemonModalProps) {
  const { pokedexShown, pageBox, handleRemovePokemon } = usePokedex();

  const [term, setTerm] = useState("");
  const [filteredDex, setFilteredDex] = useState(pokedexShown);

  useEffect(() => {
    if (term === "") {
      setFilteredDex(pageBox.pokemon);
    } else {
      const newFilter = pageBox.pokemon.filter((pokemon) => {
        return handleName(pokemon, true, "National", true)
          .toLowerCase()
          .includes(term.toLowerCase());
      });

      setFilteredDex(newFilter);
    }
  }, [term, pageBox]);

  return (
    <Modal open={isOpen} onClose={() => onClose(false)}>
      <div className={styles.header}>
        <h3>Remove Pokémon</h3>
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
        <div className={styles.listContainer}>
          {filteredDex &&
            filteredDex.map((pokemon) => {
              return (
                <button
                  key={pokemon.customBoxId}
                  className={styles.listCard}
                  onClick={() => {
                    handleRemovePokemon(pokemon.customBoxId as string);
                  }}
                  id={pokemon.id}
                >
                  <Image
                    unoptimized
                    width={100}
                    height={100}
                    src={`/home/${
                      pokemon.isShiny
                        ? pokemon.images.homeShinyRender
                        : pokemon.images.homeRender
                    }`}
                    alt={handleName(pokemon, false, "National", true)}
                  />
                  <span>{handleName(pokemon, true, "National", true)}</span>
                </button>
              );
            })}
        </div>
      </div>
    </Modal>
  );
}
