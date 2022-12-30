import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { usePokedex } from "../../hooks/usePokedex";
import styles from "./styles.module.scss";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Tooltip } from "@mui/material";
import { handleName, handleNumber } from "../../utils/NameFormatting";

interface BoxProps {
  imageSource: "svicons" | "home";
}

interface Pokemon {
  id: string;
  nationalDex: number;
  name: string;
  generalForm: string;
  uniqueForm: string;
  paldeaDex: null | number;
  formOrder: string;
  generation: number;
  type1: string;
  type2: string;
  genderDifference: boolean;
  homeAvailable: boolean;
  shinyAvailable: boolean;
  icon: string;
  homePic: string;
  homeShinyPic: string;
}

interface Box {
  box: number;
  pokemon: Pokemon[];
}

export default function Box({ imageSource }: BoxProps) {
  const [boxQuantity, setBoxQuantity] = useState(0);
  const [pokeBox, setPokeBox] = useState<Box[]>([] as Box[]);

  const { orderList, pokedex, breakByGen, highlightPokemon } = usePokedex();

  const router = useRouter();

  useEffect(() => {
    setBoxQuantity(Math.ceil(pokedex.length / 30));

    if (boxQuantity > 0) {
      setPokeBox(handleBoxQuantity());
    }
  }, [pokedex, boxQuantity, orderList, breakByGen]);

  function handleBoxQuantity() {
    const newPokeBox = [];

    if (boxQuantity > 0) {
      if (!breakByGen) {
        for (let i = 1; i <= boxQuantity; i++) {
          newPokeBox.push({
            box: i,
            pokemon: pokedex.slice(30 * i - 30, 30 * i),
          });
        }
      } else {
        const latestGen = pokedex.reduce(
          (a, b) => Math.max(a, b.generation),
          -Infinity
        );

        let boxNumber = 1;

        // Generation Iteration
        for (let g = 1; g <= latestGen; g++) {
          const generationDex = pokedex.filter((pkmn) => {
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
              const boxPokemon = pokedex
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
                {router.pathname === "/" ? (
                  <span>{`#${handleNumber(
                    box.pokemon[0]?.paldeaDex!,
                    3
                  )}`}</span>
                ) : (
                  <span>{`#${handleNumber(
                    box.pokemon[0]?.nationalDex,
                    3
                  )}`}</span>
                )}
                <span>Box {box.box}</span>
                {router.pathname === "/" ? (
                  <span>{`#${handleNumber(
                    box.pokemon[box.pokemon.length - 1]?.paldeaDex!,
                    3
                  )}`}</span>
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
                    <Tooltip
                      title={handleName(
                        pkmn,
                        router.pathname !== "/" ||
                          (router.pathname === "/" && pkmn.paldeaDex! < 500),
                        router.pathname === "/" ? "Paldean" : "National",
                        true
                      )}
                      arrow
                    >
                      <div
                        key={pkmn.id}
                        id={pkmn.id}
                        className={`${styles.card} ${
                          highlightPokemon === pkmn.id && styles.cardActive
                        }`}
                      >
                        <Image
                          unoptimized
                          width={10}
                          height={10}
                          src={`/${imageSource}/${
                            imageSource === "svicons" ? pkmn.icon : pkmn.homePic
                          }`}
                          alt={`#${
                            router.pathname === "/"
                              ? pkmn.paldeaDex
                              : pkmn.nationalDex
                          } - ${pkmn.name}`}
                        />
                      </div>
                    </Tooltip>
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
