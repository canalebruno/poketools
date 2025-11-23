import styles from "../../../styles/Home.module.scss";
import StaticPokedexPage from "@/components/StaticPokedexPage";

export default async function Page() {
  const res = await fetch("http://localhost:3000/api/pokedex/paldeaBB");
  const pokedex = await res.json();

  return (
    <div className={styles.container}>
      <h1>Scarlet and Violet - Blueberry Academy Dex</h1>
      <StaticPokedexPage sortingDefault="paldean-bb" pokedex={pokedex.data} />
    </div>
  );
}
