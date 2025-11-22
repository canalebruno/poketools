import styles from "../../../styles/Home.module.scss";
import StaticPokedexPage from "@/components/StaticPokedexPage";

export default async function Page() {
  const res = await fetch("http://localhost:3000/api/pokedex/paldea");
  const pokedex = await res.json();

  return (
    <div className={styles.container}>
      <h1>Scarlet and Violet - Paldea Dex</h1>
      <StaticPokedexPage sortingDefault="paldean" pokedex={pokedex.data} />
    </div>
  );
}
