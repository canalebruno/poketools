import { useEffect, useState } from "react";
import Modal from "../..";
import Button from "../../../Button";
import InputContainer from "../../../Inputs/InputContainer";
import styles from "../styles.module.scss";
import { usePokedex } from "../../../../hooks/usePokedex";
import { handleName } from "../../../../utils/NameFormatting";
import Image from "next/image";
import { PokemonCustomBox } from "@/utils/types";

interface BoxBuilderRemovePokemonModalProps {
  isOpen: boolean;
  onClose: (b: boolean) => void;
}

export default function BoxBuilderRemovePokemonModal({
  isOpen,
  onClose,
}: BoxBuilderRemovePokemonModalProps) {
  const {
    pokedexShown,
    pageBox,
    handleRemovePokemon,
    handleBulkRemovePokemon,
  } = usePokedex();

  const [term, setTerm] = useState("");
  const [filteredDex, setFilteredDex] = useState([] as PokemonCustomBox[]);
  const [bulkRemoveModalOpen, setBulkRemoveModalOpen] = useState(false);

  useEffect(() => {
    if (term === "") {
      setFilteredDex(pokedexShown as PokemonCustomBox[]);
    } else {
      const newFilter = pokedexShown.filter((pokemon) => {
        return handleName(pokemon, true, "National", true)
          .toLowerCase()
          .includes(term.toLowerCase());
      });

      setFilteredDex(newFilter as PokemonCustomBox[]);
    }
  }, [term, pageBox, pokedexShown]);

  return (
    <>
      <Modal fixedHeight open={isOpen} onClose={() => onClose(false)}>
        <div className={styles.header}>
          <h3>Remove Pokémon</h3>
          <Button
            disabled={
              pageBox.pokemon && pageBox.pokemon.length > 0 ? false : true
            }
            label="Bulk Remove"
            onClick={() => {
              setBulkRemoveModalOpen(true);
              onClose(false);
            }}
          />
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
              filteredDex.length > 0 &&
              filteredDex.map((pokemon) => {
                return (
                  pokemon.images && (
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
                  )
                );
              })}
          </div>
        </div>
      </Modal>
      <Modal
        open={bulkRemoveModalOpen}
        onClose={() => setBulkRemoveModalOpen(false)}
      >
        <h3>Bulk remove</h3>
        <div className={styles.buttonGroup} style={{ margin: "0 auto" }}>
          <Button
            label="Remove all Checked"
            disabled={
              pageBox.pokemon?.findIndex((pkmn) => {
                return pkmn.isChecked;
              }) < 0
            }
            onClick={() => {
              if (
                confirm("Are you sure you want to remove all CHECKED Pokémon?")
              ) {
                handleBulkRemovePokemon(true);
              }
              setBulkRemoveModalOpen(false);
            }}
          />
          <Button
            label="Remove all Unchecked"
            disabled={
              pageBox.pokemon?.findIndex((pkmn) => {
                return !pkmn.isChecked;
              }) < 0
            }
            onClick={() => {
              if (
                confirm(
                  "Are you sure you want to remove all UNCHECKED Pokémon?"
                )
              ) {
                handleBulkRemovePokemon(false);
              }
              setBulkRemoveModalOpen(false);
            }}
          />
        </div>
        <Button
          label="Cancel"
          onClick={() => setBulkRemoveModalOpen(false)}
          variant="outlined"
        />
      </Modal>
    </>
  );
}
