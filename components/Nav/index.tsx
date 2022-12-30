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
import { makeStyles } from "@mui/material";

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
        <Link href="/" className={router.pathname === "/" ? styles.active : ""}>
          {windowWidth > 720 ? "Scarlet and Violet Boxes" : "SV Boxes"}
        </Link>
        <Link
          href="/homeboxes"
          className={router.pathname === "/homeboxes" ? styles.active : ""}
        >
          Home Boxes
        </Link>
        {windowWidth < 720 && (
          <>
            <Fab onClick={(e) => toggleDrawer(true)}>
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
                sortingDefault={router.pathname === "/" ? "p" : "n"}
              />
            </Drawer>
          </>
        )}
      </nav>
    </div>
  );
}
