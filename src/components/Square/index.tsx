import { useState } from "react";
import { Pokemon, PokemonCustomBox } from "../../utils/types";
import { handleName } from "../../utils/NameFormatting";
import { usePathname } from "next/navigation";
import styles from "./styles.module.scss";
import Image from "next/image";
import { usePokedex } from "../../hooks/usePokedex";
import { useWindowSize } from "../../hooks/useWindowSize";
import Tooltip from "../Tooltip";
import { useController } from "@/hooks/useController";

interface SquareProps {
  pokemon: Pokemon | PokemonCustomBox;
  imageSource: "svicons" | "home";
  isCheckable?: boolean;
}

export default function Square({
  pokemon,
  imageSource,
  isCheckable = false,
}: SquareProps) {
  const { highlightPokemon, handleCheck } = usePokedex();
  const pathname = usePathname();
  const { loggedUser } = useController();

  const { windowWidth } = useWindowSize();

  const mobile = windowWidth <= 1024;

  return (
    <Tooltip
      isCheckable={isCheckable}
      title={handleName(
        pokemon,
        !mobile &&
          !isCheckable &&
          (pathname !== "/svboxes" ||
            (pathname === "/svboxes" && pokemon.dex.paldeaDex! < 500)),

        pathname,
        true
      )}
    >
      <div
        onClick={
          isCheckable && "isChecked" in pokemon
            ? () => handleCheck(pokemon.customBoxId, loggedUser.email)
            : undefined
        }
        id={pokemon.id}
        className={`${styles.card} ${
          highlightPokemon === pokemon.id && styles.cardActive
        } ${"isChecked" in pokemon && pokemon.isChecked && styles.checked} `}
      >
        {pokemon.images && (
          <Image
            unoptimized
            width={25}
            height={25}
            src={`/${imageSource}/${
              imageSource === "svicons"
                ? pokemon.images.icon
                : !("customBoxId" in pokemon) ||
                  ("isShiny" in pokemon && !pokemon.isShiny)
                ? pokemon.images.homeRender
                : pokemon.images.homeShinyRender
            }`}
            alt={`#${
              pathname === "/svboxes"
                ? pokemon.dex.paldeaDex
                : pokemon.dex.nationalDex
            } - ${pokemon.name}`}
          />
        )}
      </div>
    </Tooltip>
  );
}
