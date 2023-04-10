import { Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { Pokemon } from "../../utils/types";
import { handleName } from "../../utils/NameFormatting";
import { useRouter } from "next/router";
import styles from "./styles.module.scss";
import Image from "next/image";
import { usePokedex } from "../../hooks/usePokedex";
import { useWindowSize } from "../../hooks/useWindowSize";

interface SquareProps {
  pokemon: Pokemon;
  imageSource: "svicons" | "home";
  shiny?: boolean;
}

export default function Square({
  pokemon,
  imageSource,
  shiny = false,
}: SquareProps) {
  const [openTooltip, setOpenTooltip] = useState(false);
  const { highlightPokemon } = usePokedex();
  const router = useRouter();
  const { windowWidth } = useWindowSize();

  const mobile = windowWidth <= 1024;

  return (
    <Tooltip
      open={mobile ? openTooltip : undefined}
      onClose={mobile ? () => setOpenTooltip(false) : undefined}
      title={handleName(
        pokemon,
        router.pathname !== "/svboxes" ||
          (router.pathname === "/svboxes" && pokemon.paldeaDex! < 500),
        router.pathname === "/svboxes" ? "Paldean" : "National",
        true
      )}
      arrow
    >
      <div
        onClick={mobile ? () => setOpenTooltip(true) : undefined}
        id={pokemon.id}
        className={`${styles.card} ${
          highlightPokemon === pokemon.id && styles.cardActive
        }`}
      >
        <Image
          unoptimized
          width={25}
          height={25}
          src={`/${imageSource}/${
            imageSource === "svicons"
              ? pokemon.icon
              : shiny
              ? pokemon.homeShinyPic
              : pokemon.homePic
          }`}
          alt={`#${
            router.pathname === "/svboxes"
              ? pokemon.paldeaDex
              : pokemon.nationalDex
          } - ${pokemon.name}`}
        />
      </div>
    </Tooltip>
  );
}
