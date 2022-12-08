import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { usePokedex } from "../../hooks/usePokedex";
import styles from "./styles.module.scss";

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
  uniqueCode: string;
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

  const { orderList, pokedex } = usePokedex();

  const router = useRouter();

  useEffect(() => {
    setBoxQuantity(Math.ceil(pokedex.length / 30));

    if (boxQuantity > 0) {
      setPokeBox(handleBoxQuantity());
    }
  }, [pokedex, boxQuantity, orderList]);

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

  return (
    <div>
      <div className={styles.container}>
        {pokeBox.map((box) => {
          return (
            <div key={box.box} className={styles.boxContainer}>
              <div className={styles.boxHeader}>Box {box.box}</div>
              <div className={styles.boxGrid}>
                {box.pokemon.map((pkmn) => {
                  return (
                    <div key={pkmn.id} className={styles.card}>
                      <Image
                        width={80}
                        height={80}
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
