import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { usePokedex } from "../../hooks/usePokedex";
import styles from "./styles.module.scss";
import { Tooltip } from "@mui/material";
import { handleName, handleNumber } from "../../utils/NameFormatting";
import { Pokemon } from "../../utils/types";
import { useShinyTracker } from "../../hooks/useShinyTracker";

interface BoxProps {
  imageSource: "svicons" | "home";
  shiny?: boolean;
}

interface Box {
  box: number;
  pokemon: Pokemon[];
}

export default function FullGrid({ imageSource, shiny = false }: BoxProps) {
  const { breakByGen, highlightPokemon } = usePokedex();
  const { activeList } = useShinyTracker();

  const router = useRouter();

  const firstOfGen = [
    "152_00",
    "252_00",
    "387_00",
    "494_00",
    "650_00",
    "722_00",
    "810_00",
    "899_00",
    "906_00",
  ];

  return (
    <div>
      <div className={styles.container}>
        {activeList.pokemon &&
          activeList.pokemon.map((pkmn) => {
            return (
              <>
                {breakByGen && firstOfGen.includes(pkmn.id) && (
                  <div className={styles.firstOfGen} />
                )}
                <Tooltip
                  key={pkmn.id}
                  title={handleName(
                    pkmn,
                    router.pathname !== "/svboxes" ||
                      (router.pathname === "/svboxes" && pkmn.paldeaDex! < 500),
                    router.pathname === "/svboxes" ? "Paldean" : "National",
                    true
                  )}
                  arrow
                >
                  <div
                    id={pkmn.id}
                    className={`${styles.card} ${
                      highlightPokemon === pkmn.id && styles.cardActive
                    }
                `}
                  >
                    <Image
                      unoptimized
                      width={25}
                      height={25}
                      src={`/${imageSource}/${
                        imageSource === "svicons"
                          ? pkmn.icon
                          : shiny
                          ? pkmn.homeShinyPic
                          : pkmn.homePic
                      }`}
                      alt={`#${
                        router.pathname === "/svboxes"
                          ? pkmn.paldeaDex
                          : pkmn.nationalDex
                      } - ${pkmn.name}`}
                    />
                  </div>
                </Tooltip>
              </>
            );
          })}
      </div>
    </div>
  );
}
