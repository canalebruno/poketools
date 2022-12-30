import styles from "../styles/Home.module.scss";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className={styles.container}>
      <h1>Pokémon Boxes Organizer</h1>
      <section className={styles.buttonsSection}>
        <Link href="/svboxes">
          <span>Scarlet and Violet Boxes</span>
          <Image
            unoptimized
            src="appicons/pokemon-sv.jpg"
            width={10}
            height={10}
            alt="Pokémon Scarlet and Violet"
          />
        </Link>
        <Link href="/homeboxes">
          <span>Home Boxes</span>
          <Image
            unoptimized
            src="appicons/pokemon-home.png"
            width={10}
            height={10}
            alt="Pokémon Scarlet and Violet"
          />
        </Link>
      </section>
      <section>
        <h2>Last Updates</h2>
        <div>
          <p>30.12.2022</p>
          <ul>
            <li>
              Added Break by Gen Feature to start a new box for each generation
            </li>
            <li>Added Search Feature</li>
            <li>
              Added available Pokémon in Scarlet and Violet that aren't in the
              Pokédex. <i>Speacially Scorbunny family that's just debuted</i>
            </li>
            <li>Updated filters design</li>
            <li>Added name labels when mouse over images</li>
            <li>Added first and last numbers for each box</li>
            <li>Created Homepage</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
