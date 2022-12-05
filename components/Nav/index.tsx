import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";

export default function Nav() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <Link href="/" className={router.pathname === "/" ? styles.active : ""}>
          Scarlet and Violet Boxes
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
