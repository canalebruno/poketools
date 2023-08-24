import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { useState } from "react";
import styles from "./styles.module.scss";
import SelectAddRemovePokemon from "../SelectAddRemovePokemon";
import { usePokedex } from "../../hooks/usePokedex";
import { useEffect } from "react";
import { Pokemon } from "../../utils/types";
import { useRouter } from "next/router";
import AddPokemonButton from "../SelectAddRemovePokemon/AddButton";
import Link from "next/link";
import Modal from "../Modal";
import Button from "../Button";

export default function ShinyTrackerControl() {
  const [addPokemonModalOpen, setAddPokemonModalOpen] = useState(false);
  const [removePokemonModalOpen, setRemovePokemonModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addPokemonList, setAddPokemonList] = useState<Pokemon[]>();

  const router = useRouter();

  const pageSlug = router.asPath.replace("/boxtracker/", "");

  const fetchUserData = () => {
    fetch("/api/shinydex")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setAddPokemonList(data);
      });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const { handleDeleteList, pageBox } = usePokedex();

  return (
    <>
      <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <h3>Confirm delete</h3>
        <div className={styles.buttonGroup} style={{ margin: "0 auto" }}>
          <Button
            label="Cancel"
            onClick={() => setDeleteModalOpen(false)}
            variant="outlined"
          />
          <Button
            label="Yes, Delete List"
            onClick={() => {
              handleDeleteList(pageSlug);
              setDeleteModalOpen(false);
              router.push("/boxtracker");
            }}
          />
        </div>
      </Modal>
      <Modal
        open={addPokemonModalOpen}
        onClose={() => setAddPokemonModalOpen(false)}
      >
        <div className={styles.header}>
          <h3>Add Pokémon</h3>
          <Button
            onClick={() => setAddPokemonModalOpen(false)}
            variant="outlined"
            label="Close"
          />
        </div>
        <AddPokemonButton />
      </Modal>
      <Modal
        open={removePokemonModalOpen}
        onClose={() => setRemovePokemonModalOpen(false)}
      >
        <div className={styles.header}>
          <h3>Remove Pokémon</h3>
          <Button
            onClick={() => setRemovePokemonModalOpen(false)}
            variant="outlined"
            label="Close"
          />
        </div>
        <SelectAddRemovePokemon kind="remove" pokemonList={pageBox.pokemon} />
      </Modal>
      <div className={styles.container}>
        <Link href="/boxtracker">
          <KeyboardArrowLeftIcon />
        </Link>
        <div className={styles.buttonGroup}>
          <span>*Attention, the lists are saved locally on your browser</span>
        </div>
        <div className={styles.buttonGroup}>
          <Button
            label="Add Pokémon"
            onClick={() => setAddPokemonModalOpen(true)}
          />
          <Button
            label="Remove Pokémon"
            onClick={() => setRemovePokemonModalOpen(true)}
          />
          <Button
            label="Delete List"
            onClick={() => setDeleteModalOpen(true)}
          />
        </div>
      </div>
    </>
  );
}
