import styles from "../styles/Nuzlocke.module.scss";

import LocationCard from "../components/LocationCard";
import NuzlockeFilterControl from "../components/NuzlockeFilterControl";
import Button from "@mui/material/Button";
import { useNuzlocke } from "../hooks/useNuzlocke";

export default function Nuzlocke() {
  const { handleGenerateNuzlockeHunt, hunt } = useNuzlocke();

  return (
    <div className={styles.container}>
      <NuzlockeFilterControl />
      <Button
        sx={{ marginTop: "2rem", fontSize: "1.25rem" }}
        variant="contained"
        onClick={handleGenerateNuzlockeHunt}
      >
        Generate
      </Button>
      <div className={styles.cardsGrid}>
        {hunt &&
          hunt.map((item) => {
            return (
              <LocationCard
                key={item.id}
                name={item.name}
                pokemon={item.pokemon && item.pokemon}
              />
            );
          })}
      </div>
    </div>
  );
}
