import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useWindowSize } from "../../hooks/useWindowSize";
import styles from "./styles.module.scss";
import * as React from "react";
import Drawer from "@mui/material/Drawer";
import FilterAltTwoToneIcon from "@mui/icons-material/FilterAltTwoTone";
import Fab from "@mui/material/Fab";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import FilterControl from "../FilterControl";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

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
        {windowWidth >= 1024 && (
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
            <Link
              href="/shinytracker"
              className={
                router.pathname === "/shinytracker" ? styles.active : ""
              }
            >
              <span>Shiny Tracker (Beta)</span>
            </Link>
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
          </>
        )}
        {windowWidth < 1024 && (
          <>
            <IconButton
              aria-label="menu"
              onClick={(e) => toggleDrawer(true)}
              sx={{ m: "1rem 0" }}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="right"
              open={isOpne}
              onClose={(e) => toggleDrawer(false)}
              sx={{
                "& .MuiPaper-root": { padding: "2rem 1rem" },
              }}
            >
              <List>
                <ListItem>
                  <Link
                    href="/"
                    className={router.pathname === "/" ? styles.active : ""}
                  >
                    <span>Home</span>
                  </Link>
                </ListItem>
                <ListItem>
                  <Link
                    href="/svboxes"
                    className={
                      router.pathname === "/svboxes" ? styles.active : ""
                    }
                  >
                    <span>
                      {windowWidth > 1024
                        ? "Scarlet and Violet Boxes"
                        : "SV Boxes"}
                    </span>
                  </Link>
                </ListItem>
                <ListItem>
                  <Link
                    href="/nuzlocke"
                    className={
                      router.pathname === "/nuzlocke" ? styles.active : ""
                    }
                  >
                    <span>SV Nuzlocke Generator</span>
                  </Link>
                </ListItem>
                <ListItem>
                  <Link
                    href="/homeboxes"
                    className={
                      router.pathname === "/homeboxes" ? styles.active : ""
                    }
                  >
                    <span>Home Boxes</span>
                  </Link>
                </ListItem>
                <ListItem>
                  <Link
                    href="/shinytracker"
                    className={
                      router.pathname === "/shinytracker" ? styles.active : ""
                    }
                  >
                    <span>Shiny Tracker (Beta)</span>
                  </Link>
                </ListItem>
                <ListItem>
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
                </ListItem>
              </List>
            </Drawer>
          </>
        )}
      </nav>
    </div>
  );
}
