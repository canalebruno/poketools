import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useWindowSize } from "../../hooks/useWindowSize";
import styles from "./styles.module.scss";

export default function Nav() {
  const router = useRouter();
  const { windowWidth } = useWindowSize();

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <Link href="/" className={router.pathname === "/" ? styles.active : ""}>
          {windowWidth > 720 ? "Scarlet and Violet Boxes" : "SV Boxes"}
        </Link>
        <Link
          href="/homeboxes"
          className={router.pathname === "/homeboxes" ? styles.active : ""}
        >
          Home Boxes
        </Link>
      </nav>
    </div>
  );
}
