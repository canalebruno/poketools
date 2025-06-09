import { useEffect, useState } from "react";
import Modal from "../..";
import Button from "../../../Button";
import InputContainer from "../../../Inputs/InputContainer";
import styles from "../styles.module.scss";
import { usePokedex } from "../../../../hooks/usePokedex";
import { handleName } from "../../../../utils/NameFormatting";
import Image from "next/image";
import { useController } from "@/hooks/useController";

interface BoxBuilderAddPokemonModalProps {
  isOpen: boolean;
  onClose: (b: boolean) => void;
}

export default function BoxBuilderAddPokemonModal({
  isOpen,
  onClose,
}: BoxBuilderAddPokemonModalProps) {
  const { pokedexShown, fullPokedex, handleAddPokemon } = usePokedex();
  const { loggedUser } = useController();

  const [term, setTerm] = useState("");
  const [filteredDex, setFilteredDex] = useState(pokedexShown);
  const [isShiny, setIsShiny] = useState(false);

  useEffect(() => {
    if (term === "") {
      if (isShiny) {
        setFilteredDex(
          fullPokedex.filter((pkmn) => {
            return pkmn.images.homeShinyRender !== "";
          })
        );
      } else {
        setFilteredDex(fullPokedex);
      }
    } else {
      let newFilter = fullPokedex.filter((pokemon) => {
        return handleName(pokemon, true, "National", true)
          .toLowerCase()
          .includes(term.toLowerCase());
      });

      if (isShiny) {
        newFilter = newFilter.filter((pkmn) => {
          return pkmn.images.homeShinyRender !== "";
        });
      }

      setFilteredDex(newFilter);
    }
  }, [term, fullPokedex, isShiny]);

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
      <div className={styles.container}>
        <div className={styles.inputGroup}>
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
          <InputContainer label="Shiny" valueOn={"s"}>
            <input
              type="checkbox"
              checked={isShiny}
              onChange={() => setIsShiny(!isShiny)}
            />
          </InputContainer>
        </div>
        <div className={styles.listContainer}>
          {filteredDex &&
            filteredDex.map((pokemon) => {
              return (
                <button
                  key={pokemon.id}
                  className={styles.listCard}
                  onClick={() => {
                    handleAddPokemon(pokemon.id, isShiny, loggedUser.email);
                  }}
                  id={pokemon.id}
                >
                  <Image
                    unoptimized
                    width={100}
                    height={100}
                    src={`/home/${
                      isShiny
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
