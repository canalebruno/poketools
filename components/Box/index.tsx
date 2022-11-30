import pokedexJson from "../../json/pokedex.json";
import paldeaDexJson from "../../json/paldeaDex.json";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";

interface Pokemon {
  id: string;
  nationalDex: number;
  paldeaDex: number;
  generalForm: string;
  uniqueForm: string;
  uniqueCode: string;
  name: string;
  generation: number;
  type1: string;
  type2: string;
  icon: string;
  genderDifference: boolean;
  homeAvailable: boolean;
  shinyAvailable: boolean;
}

interface Box {
  box: number;
  pokemon: Pokemon[];
}

export default function Box() {
  const [pokedex, setPokedex] = useState<Pokemon[]>([] as Pokemon[]);
  const [boxQuantity, setBoxQuantity] = useState(0);
  const [pokeBox, setPokeBox] = useState<Box[]>([] as Box[]);

  useEffect(() => {
    setPokedex(
      paldeaDexJson.sort((a, b) => {
        return a.paldeaDex - b.paldeaDex;
      })
    );

    setBoxQuantity(Math.ceil(pokedex.length / 30));

    if (boxQuantity > 0) {
      setPokeBox(handleBoxQuantity());
    }
  }, [pokedex, boxQuantity]);

  function handleBoxQuantity() {
    const newPokeBox = [];

    if (boxQuantity > 0) {
      for (let i = 1; i <= boxQuantity; i++) {
        newPokeBox.push({
          box: i,
          pokemon: pokedex.slice(30 * i - 30, 30 * i),
        });
      }
    }

    return newPokeBox;
  }

  useEffect(() => {}, [boxQuantity]);

  return (
    <div className={styles.container}>
      {pokeBox.map((box) => {
        return (
          <div key={box.box} className={styles.boxContainer}>
            <div className={styles.boxHeader}>Box {box.box}</div>
            <div className={styles.boxGrid}>
              {box.pokemon.map((pkmn) => {
                return (
                  <div key={pkmn.id} className={styles.card}>
                    <img src={`svicons/${pkmn.icon}`} alt={pkmn.name} />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
