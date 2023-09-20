import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { useState } from "react";
import styles from "./styles.module.scss";
import { usePokedex } from "../../hooks/usePokedex";
import { useRouter } from "next/router";
import Link from "next/link";
import Modal from "../Modal";
import Button from "../Button";
import BoxBuilderAddPokemonModal from "../Modal/BoxBuilder/Add";
import BoxBuilderRemovePokemonModal from "../Modal/BoxBuilder/Remove";

export default function ShinyTrackerControl() {
  const [addPokemonModalOpen, setAddPokemonModalOpen] = useState(false);
  const [removePokemonModalOpen, setRemovePokemonModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const router = useRouter();

  const pageSlug = router.asPath.replace("/boxtracker/", "");

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
      <BoxBuilderAddPokemonModal
        isOpen={addPokemonModalOpen}
        onClose={() => setAddPokemonModalOpen(false)}
      />
      <BoxBuilderRemovePokemonModal
        isOpen={removePokemonModalOpen}
        onClose={() => setRemovePokemonModalOpen(false)}
      />
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
            disabled={
              pageBox.pokemon && pageBox.pokemon.length > 0 ? false : true
            }
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
