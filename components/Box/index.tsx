import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { usePokedex } from "../../hooks/usePokedex";
import styles from "./styles.module.scss";
import { Tooltip } from "@mui/material";
import { handleName, handleNumber } from "../../utils/NameFormatting";
import { Pokemon } from "../../utils/types";
import Square from "../Square";

interface BoxProps {
  imageSource: "svicons" | "home";
  shiny?: boolean;
  pokemonListShown: Pokemon[];
}

interface Box {
  box: number;
  pokemon: Pokemon[];
}

export default function Box({
  imageSource,
  shiny = false,
  pokemonListShown,
}: BoxProps) {
  const [boxQuantity, setBoxQuantity] = useState(0);
  const [pokeBox, setPokeBox] = useState<Box[]>([] as Box[]);
  const [openTooltip, setOpenTooltip] = useState(false);

  const {
    orderList,
    pokedexShown,
    breakByGen,
    highlightPokemon,
    loadPokedex,
    pageBox,
    customBoxes,
  } = usePokedex();

  const router = useRouter();

  useEffect(() => {
    loadPokedex(pokemonListShown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (pokedexShown && pokedexShown.length > 0) {
      setBoxQuantity(Math.ceil(pokedexShown.length / 30));
    }

    if (boxQuantity > 0) {
      setPokeBox(handleBoxQuantity());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pokedexShown, boxQuantity, orderList, breakByGen, customBoxes]);

  function handleBoxQuantity() {
    const newPokeBox = [];

    if (boxQuantity > 0) {
      if (!breakByGen) {
        for (let i = 1; i <= boxQuantity; i++) {
          newPokeBox.push({
            box: i,
            pokemon: pokedexShown.slice(30 * i - 30, 30 * i),
          });
        }
      } else {
        const latestGen = pokedexShown.reduce(
          (a, b) => Math.max(a, b.generation),
          -Infinity
        );

        let boxNumber = 1;

        // Generation Iteration
        for (let g = 1; g <= latestGen; g++) {
          const generationDex = pokedexShown.filter((pkmn) => {
            return pkmn.generation === g;
          });

          // Quantity iteration
          for (let j = 1; j < 10; j++) {
            const boxPokemon = generationDex.slice(30 * j - 30, 30 * j);

            if (boxPokemon.length > 0) {
              newPokeBox.push({
                box: boxNumber,
                pokemon: boxPokemon,
              });
              boxNumber++;
            } else {
              break;
            }
          }

          if (g === 8) {
            for (let j = 1; j < 10; j++) {
              const boxPokemon = pokedexShown
                .filter((pkmn) => {
                  return pkmn.generation === 8.5;
                })
                .slice(30 * j - 30, 30 * j);

              if (boxPokemon.length > 0) {
                newPokeBox.push({
                  box: boxNumber,
                  pokemon: boxPokemon,
                });
                boxNumber++;
              } else {
                break;
              }
            }
          }
        }
      }
    }

    return newPokeBox;
  }

  return (
    <div>
      <div className={styles.container}>
        {pokeBox.map((box) => {
          return (
            <div key={box.box} className={styles.boxContainer}>
              <div className={styles.boxHeader}>
                {router.pathname === "/svboxes" ? (
                  orderList === "p" && !breakByGen ? (
                    <span>{`#${handleNumber(
                      box.pokemon[0]?.paldeaDex!,
                      3
                    )}`}</span>
                  ) : (
                    <span />
                  )
                ) : (
                  <span>{`#${handleNumber(
                    box.pokemon[0]?.nationalDex,
                    3
                  )}`}</span>
                )}
                <span>Box {box.box}</span>
                {router.pathname === "/svboxes" ? (
                  orderList === "p" && !breakByGen ? (
                    <span>{`#${
                      box.pokemon[box.pokemon.length - 1]?.paldeaDex! <= 400
                        ? handleNumber(
                            box.pokemon[box.pokemon.length - 1]?.paldeaDex!,
                            3
                          )
                        : 400
                    }`}</span>
                  ) : (
                    <span />
                  )
                ) : (
                  <span>{`#${handleNumber(
                    box.pokemon[box.pokemon.length - 1]?.nationalDex,
                    3
                  )}`}</span>
                )}
              </div>
              <div className={styles.boxGrid}>
                {box.pokemon.map((pkmn) => {
                  return (
                    <Square
                      imageSource={imageSource}
                      shiny={shiny}
                      pokemon={pkmn}
                      key={
                        pkmn.customBoxId !== undefined
                          ? pkmn.customBoxId
                          : pkmn.id
                      }
                    />
                  );
                })}
                {box.pokemon.length < 30 &&
                  [...Array(30 - box.pokemon.length)].map((x, i) => (
                    <div className={styles.card} key={i} />
                  ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
