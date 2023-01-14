import Image from "next/image";
import { Pokemon } from "../../utils/Interfaces";
import { handleName } from "../../utils/NameFormatting";
import styles from "./styles.module.scss";
import GrassIcon from "@mui/icons-material/Grass";

interface LocationCardProps {
  name: string;
  pokemon: Pokemon | undefined;
}

export default function LocationCard({ name, pokemon }: LocationCardProps) {
  return (
    <div className={styles.container}>
      <div className={styles.title}>{name}</div>
      <div className={styles.pokemon}>
        {pokemon ? (
          <>
            <Image
              unoptimized
              src={`svicons/${pokemon.icon}`}
              alt={name}
              width={80}
              height={80}
            />
            <span>{handleName(pokemon, false, "Paldean", true)}</span>
          </>
        ) : (
          <>
            <GrassIcon />
            <span>Nothing to catch in this area</span>
          </>
        )}
      </div>
    </div>
  );
}
