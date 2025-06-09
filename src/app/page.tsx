import styles from "./styles/Home.module.scss";
import Link from "next/link";
import Image from "next/image";
import UpdatesFeed from "../components/UpdatesFeed";
import GrassIcon from "@mui/icons-material/Grass";

export default function Home() {
  return (
    <div className={styles.container}>
      <h1>Pokémon Tools</h1>
      <section className={styles.buttonsSection}>
        <Link href="/svboxes">
          <Image
            unoptimized
            src="appicons/pokemon-sv.jpg"
            width={10}
            height={10}
            alt="Pokémon Scarlet and Violet"
          />
          <div>
            <span className={styles.title}>Scarlet & Violet</span>
            <br />
            <span className={styles.subtitle}>Boxes</span>
          </div>
        </Link>
        <Link href="/teal-mask-boxes">
          <Image
            unoptimized
            src="appicons/pokemon-teal-mask.png"
            width={10}
            height={10}
            alt="Pokémon Scarlet and Violet"
          />
          <div>
            <span className={styles.title}>Teal Mask</span>
            <br />
            <span className={styles.subtitle}>Boxes</span>
          </div>
        </Link>
        <Link href="/blueberry-academy-boxes">
          {/* <Image
            unoptimized
            src="appicons/pokemon-teal-mask.png"
            width={10}
            height={10}
            alt="Pokémon Scarlet and Violet"
          /> */}
          <div>
            <span className={styles.title}>BB Academy</span>
            <br />
            <span className={styles.subtitle}>Boxes</span>
          </div>
        </Link>
        <Link href="/homeboxes">
          <Image
            unoptimized
            src="appicons/pokemon-home.png"
            width={10}
            height={10}
            alt="Pokémon Scarlet and Violet"
          />
          <div>
            <span className={styles.title}>Home</span>
            <br />
            <span className={styles.subtitle}>Boxes</span>
          </div>
        </Link>
        <Link href="/nuzlocke">
          <GrassIcon />
          <div>
            <span className={styles.title}>Nuzlocke</span>
            <br />
            <span className={styles.subtitle}>SV Random Hunt Generator</span>
          </div>
        </Link>
        <Link href="/tracker">
          <Image
            unoptimized
            src="appicons/pokebox.png"
            width={10}
            height={10}
            alt="Box Builder (Beta)"
          />
          <div>
            <span className={styles.title}>Builder</span>
            <br />
            <span className={styles.subtitle}>Boxes (Beta)</span>
          </div>
        </Link>
      </section>
      <section>
        <h2>Last Updates</h2>
        <UpdatesFeed />
      </section>
    </div>
  );
}
