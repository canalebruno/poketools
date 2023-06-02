import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useWindowSize } from "../../hooks/useWindowSize";
import styles from "./styles.module.scss";
import * as React from "react";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import useMediaQuery from "@mui/material/useMediaQuery";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

export default function Nav() {
  const [isOpne, setIsOpen] = useState(false);
  const [isSuspendedMenuOpne, setIsSuspendedMenuOpen] = useState(false);
  const router = useRouter();
  const { windowWidth } = useWindowSize();
  const isDesktop = useMediaQuery("(min-width: 720px)");

  function toggleDrawer(open: boolean) {
    setIsOpen(open);
  }

  function getTopAxis() {
    const menuPosition =
      document.getElementById("boxOrganizerMenu")?.offsetHeight;

    return menuPosition ? menuPosition : 0;
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2>Pokémon Tools</h2>
        {isDesktop && (
          <nav>
            <div
              className={styles.menuItem}
              id="boxOrganizerMenu"
              onMouseEnter={() => setIsSuspendedMenuOpen(true)}
              onMouseLeave={() => setIsSuspendedMenuOpen(false)}
              style={isSuspendedMenuOpne ? { color: "white" } : undefined}
            >
              <span>Box Organizer</span>
              <ArrowDropDownIcon />
            </div>
            {isSuspendedMenuOpne && (
              <div
                className={styles.suspendedMenu}
                style={{ top: getTopAxis() }}
                onMouseEnter={() => setIsSuspendedMenuOpen(true)}
                onMouseLeave={() => setIsSuspendedMenuOpen(false)}
              >
                <Link className={styles.menuItem} href="/svboxes">
                  <span>Scarlet and Violet</span>
                </Link>
                <Link className={styles.menuItem} href="/homeboxes">
                  <span>Home</span>
                </Link>
                <Link className={styles.menuItem} href="/shinytracker">
                  <span>Builder (Beta)</span>
                </Link>
              </div>
            )}
            <div className={styles.menuItem}>
              <Link
                href="/nuzlocke"
                className={router.pathname === "/nuzlocke" ? styles.active : ""}
              >
                <span>SV Nuzlocke Generator</span>
              </Link>
            </div>
          </nav>
          /* <Link
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
            </a> */
        )}
        {!isDesktop && (
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
      </div>
    </div>
  );
}
