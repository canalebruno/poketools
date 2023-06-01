import Link from "next/link";
import styles from "./styles.module.scss";

export default function Footer() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <nav>
          <Link href="/">Home</Link>
          <Link href="https://github.com/canalebruno/poketools" target="_blank">
            Github
          </Link>
          <Link href="/contact">Contact</Link>
          <a
            href="https://ko-fi.com/P5P7K5F3E"
            rel="noreferrer"
            target="_blank"
          >
            <img
              height="36px"
              style={{ border: 0, height: "36px" }}
              src="https://storage.ko-fi.com/cdn/kofi3.png?v=3"
              alt="Buy Me a Coffee at ko-fi.com"
            />
          </a>
        </nav>
        <p className={styles.rights}>
          2023 © Bruno Canale. All rights reserved by their respective owners.
          <br />
          This website is not officially affiliated with Pokémon and is intended
          to fall under Fair Use doctrine, similar to any other informational
          site such as a wiki.
          <br />
          Pokémon and its trademarks are ©1995-2023 Nintendo, Creatures, and
          GAMEFREAK.
          <br />
          All images and names owned and trademarked by Nintendo, The Pokémon
          Company, and GAMEFREAK are property of their respective owners.
        </p>
      </div>
    </div>
  );
}
