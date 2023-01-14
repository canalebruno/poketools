import styles from "../styles/Nuzlocke.module.scss";

import LocationCard from "../components/LocationCard";
import NuzlockeFilterControl from "../components/NuzlockeFilterControl";
import Button from "@mui/material/Button";
import { useNuzlocke } from "../hooks/useNuzlocke";

export default function HomeBoxes() {
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
                name={item.name}
                pokemon={item.pokemon && item.pokemon}
              />
            );
          })}
      </div>
    </div>
  );
}
