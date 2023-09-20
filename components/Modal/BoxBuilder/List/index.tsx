import Image from "next/image";
import { Pokemon } from "../../../../utils/types";
import styles from "./styles.module.scss";
import { handleName } from "../../../../utils/NameFormatting";
import { usePokedex } from "../../../../hooks/usePokedex";

interface ListProps {
  listShown: Pokemon[];
  isShiny: boolean;
}

export default function List({ listShown, isShiny }: ListProps) {
  const { handleAddPokemon } = usePokedex();

  return (
    <div className={styles.listContainer}>
      {listShown &&
        listShown.map((pokemon) => {
          return (
            <button
              key={pokemon.id}
              className={styles.listCard}
              onClick={() => {
                handleAddPokemon(pokemon.id, isShiny);
              }}
              id={pokemon.id}
            >
              <Image
                unoptimized
                width={100}
                height={100}
                src={`/home/${
                  isShiny ? pokemon.homeShinyPic : pokemon.homePic
                }`}
                alt={handleName(pokemon, false, "National", true)}
              />
              <span>{handleName(pokemon, true, "National", true)}</span>
            </button>
          );
        })}
    </div>
  );
}
