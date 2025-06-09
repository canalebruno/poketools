"use client";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import useMediaQuery from "@mui/material/useMediaQuery";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import Drawer from "../Drawer";
import { auth, signOut } from "@/auth";
import { useSession } from "next-auth/react";
import Login from "../Login";

// REFATORAR AQUI LIST, LIST ITEM, ICON BUTTON

export default function Nav() {
  const [isOpne, setIsOpen] = useState(false);
  const [isSuspendedMenuOpne, setIsSuspendedMenuOpen] = useState(false);
  const pathname = usePathname();
  const isDesktop = useMediaQuery("(min-width: 720px)");

  function toggleDrawer(open: boolean) {
    setIsOpen(open);
  }

  function getTopAxis() {
    const menuPosition =
      document.getElementById("boxOrganizerMenu")?.offsetHeight;

    return menuPosition ? menuPosition : 0;
  }

  const menuNavItems = [
    {
      id: 1,
      title: "Scarlet and Violet",
      slug: "/svboxes",
    },
    {
      id: 2,
      title: "Teal Mask",
      slug: "/teal-mask-boxes",
    },
    {
      id: 3,
      title: "BB Academy",
      slug: "/blueberry-academy-boxes",
    },
    {
      id: 4,
      title: "Home",
      slug: "/homeboxes",
    },
    {
      id: 5,
      title: "Builder (Beta)",
      slug: "/tracker",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Link href="/">
          <h2>Pokémon Tools</h2>
        </Link>
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
                {menuNavItems.map((item) => {
                  return (
                    <Link
                      key={item.id}
                      className={styles.menuItem}
                      href={item.slug}
                    >
                      <span>{item.title}</span>
                    </Link>
                  );
                })}
              </div>
            )}
            <div className={styles.menuItem}>
              <Link
                href="/nuzlocke"
                className={pathname === "/nuzlocke" ? styles.active : ""}
              >
                <span>SV Nuzlocke Generator</span>
              </Link>
            </div>
            <div className={styles.menuItem}>
              <Login />
            </div>
          </nav>
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
            <Drawer open={isOpne} onClose={() => toggleDrawer(false)}>
              <List className={styles.list}>
                <div className={styles.listGroup}>
                  <ListItem className={styles.listItem}>
                    <strong>Box Organizer</strong>
                  </ListItem>
                  {menuNavItems.map((item) => {
                    return (
                      <ListItem key={item.id} className={styles.listItem}>
                        <Link href={item.slug}>
                          <span>{item.title}</span>
                        </Link>
                      </ListItem>
                    );
                  })}
                </div>
                <div className={styles.listGroup}>
                  <ListItem className={styles.listItem}>
                    <Link href="/nuzlocke">
                      <span>SV Nuzlocke Generator</span>
                    </Link>
                  </ListItem>
                </div>
              </List>
            </Drawer>
          </>
        )}
      </div>
    </div>
  );
}
