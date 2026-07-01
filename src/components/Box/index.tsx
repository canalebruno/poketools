"use client";

import { useEffect, useState } from "react";
import { usePokedex } from "../../hooks/usePokedex";
import styles from "./styles.module.scss";
import { Pokemon, PokemonCustomBox } from "../../utils/types";
import Square from "../Square";
import BoxLoading from "../BoxLoading";
import TopNumber from "./TopNumber";

interface BoxProps {
  imageSource: "svicons" | "home";
  pokemonListShown?: Pokemon[] | PokemonCustomBox[];
  isCheckable?: boolean;
}

interface Box {
  box: number;
  pokemon: Pokemon[] | PokemonCustomBox[];
}

export default function Box({
  imageSource,
  pokemonListShown,
  isCheckable = false,
}: BoxProps) {
  const [boxQuantity, setBoxQuantity] = useState(0);
  const [pokeBox, setPokeBox] = useState<Box[]>([] as Box[]);

  const {
    orderList,
    pokedexShown,
    breakByGen,
    customBoxes,
    setPokedexShown,
    setBackupPokedex,
  } = usePokedex();

  // useEffect(() => {
  //   if (pokemonListShown && pokemonListShown.length > 0) {
  //     loadPokedex(pokemonListShown);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [pokemonListShown, pokedexShown]);

  useEffect(() => {
    if (
      pokemonListShown &&
      pokemonListShown.length > 0 &&
      pokedexShown.length < 1
    ) {
      setPokedexShown(pokemonListShown);
      setBackupPokedex(pokemonListShown);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pokemonListShown, pokedexShown]);

  useEffect(() => {
    if (pokedexShown && pokedexShown.length > 0) {
      setBoxQuantity(Math.ceil(pokedexShown.length / 30));
    }

    if (boxQuantity > 0) {
      setPokeBox(handleBoxQuantity());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pokedexShown, boxQuantity, orderList, breakByGen, customBoxes]);

  useEffect(() => {
    if (
      pokemonListShown &&
      pokemonListShown.length > 0 &&
      pokedexShown.length > 0
    ) {
      // 1. Perform the mapping directly on the current array snapshot
      const updatedList = pokedexShown.map((currentPkmn) => {
        // Loop safely over the typed union array item signatures
        const updatedPkmn = pokemonListShown.find((p) => {
          const pCustomBoxId = "customBoxId" in p ? p.customBoxId : undefined;
          return (
            (pCustomBoxId && pCustomBoxId === currentPkmn.customBoxId) ||
            p.id === currentPkmn.id
          );
        });

        // Safely access properties using type narrowing guardrails
        const isChecked =
          updatedPkmn && "isChecked" in updatedPkmn
            ? updatedPkmn.isChecked
            : currentPkmn.isChecked;

        return updatedPkmn ? { ...currentPkmn, isChecked } : currentPkmn;
      });

      // 2. Pass the final processed array directly to your setter
      setPokedexShown(updatedList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pokemonListShown]);

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
          (a, b) => Math.max(a, b.dex.generation),
          -Infinity,
        );

        let boxNumber = 1;

        // Generation Iteration
        for (let g = 1; g <= latestGen; g++) {
          const generationDex = pokedexShown.filter((pkmn) => {
            return pkmn.dex.generation === g;
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
                  return pkmn.dex.generation === 8.5;
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
    <>
      {pokedexShown && pokeBox.length > 0 ? (
        pokeBox.map((box) => {
          return (
            <div key={box.box} className={styles.boxContainer}>
              <div className={styles.boxHeader}>
                <TopNumber pokemon={box.pokemon[0]} />
                <span>Box {box.box}</span>
                <TopNumber pokemon={box.pokemon[box.pokemon.length - 1]} />
              </div>
              <div className={styles.boxGrid}>
                {box.pokemon.map((pkmn) => {
                  const stableKey =
                    "customBoxId" in pkmn ? pkmn.customBoxId : pkmn.id;
                  return (
                    <Square
                      isCheckable={isCheckable}
                      imageSource={imageSource}
                      pokemon={pkmn}
                      key={stableKey}
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
        })
      ) : (
        <BoxLoading />
      )}
    </>
  );
}
