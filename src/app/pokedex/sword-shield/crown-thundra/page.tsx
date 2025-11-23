import styles from "../../../styles/Home.module.scss";
import StaticPokedexPage from "@/components/StaticPokedexPage";

export default async function Page() {
  const res = await fetch("http://localhost:3000/api/pokedex/galarCt");
  const pokedex = await res.json();

  return (
    <div className={styles.container}>
      <h1>Sword & Shield - Crown Thundra Dex</h1>
      <StaticPokedexPage sortingDefault="national" pokedex={pokedex.data} />
    </div>
  );
}
