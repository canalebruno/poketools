import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useWindowSize } from "../../hooks/useWindowSize";
import styles from "./styles.module.scss";
import * as React from "react";
import Drawer from "@mui/material/Drawer";
import FilterAltTwoToneIcon from "@mui/icons-material/FilterAltTwoTone";
import Fab from "@mui/material/Fab";
import FilterControl from "../FilterControl";

export default function Nav() {
  const [isOpne, setIsOpen] = useState(false);
  const router = useRouter();
  const { windowWidth } = useWindowSize();

  function toggleDrawer(open: boolean) {
    setIsOpen(open);
  }

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <h2>Pokémon Tools</h2>
        {windowWidth >= 720 && (
          <>
            <Link
              href="/"
              className={router.pathname === "/" ? styles.active : ""}
            >
              <span>Home</span>
            </Link>
            <Link
              href="/svboxes"
              className={router.pathname === "/svboxes" ? styles.active : ""}
            >
              <span>
                {windowWidth > 720 ? "Scarlet and Violet Boxes" : "SV Boxes"}
              </span>
            </Link>
            <Link
              href="/nuzlocke"
              className={router.pathname === "/nuzlocke" ? styles.active : ""}
            >
              <span>SV Nuzlocke Generator</span>
            </Link>
            <Link
              href="/homeboxes"
              className={router.pathname === "/homeboxes" ? styles.active : ""}
            >
              <span>Home Boxes</span>
            </Link>
          </>
        )}
        {windowWidth < 720 && router.pathname !== "/" && (
          <>
            <Fab onClick={(e) => toggleDrawer(true)} sx={{ m: "1rem 0" }}>
              <FilterAltTwoToneIcon />
            </Fab>
            <Drawer
              anchor="right"
              open={isOpne}
              onClose={(e) => toggleDrawer(false)}
              sx={{
                "& .MuiPaper-root": { padding: "2rem 1rem" },
              }}
            >
              <FilterControl
                vertical
                sortingDefault={router.pathname === "/svboxes" ? "p" : "n"}
              />
            </Drawer>
          </>
        )}
      </nav>
    </div>
  );
}
