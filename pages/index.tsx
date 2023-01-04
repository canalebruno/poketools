import styles from "../styles/Home.module.scss";
import Link from "next/link";
import Image from "next/image";
import UpdatesFeed from "../components/UpdatesFeed";

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
        <UpdatesFeed />
      </section>
    </div>
  );
}
