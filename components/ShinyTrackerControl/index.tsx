import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { useState } from "react";
// import { useShinyTracker } from "../../hooks/useShinyTracker";
import styles from "./styles.module.scss";
import SelectAddRemovePokemon from "../SelectAddRemovePokemon";
import { usePokedex } from "../../hooks/usePokedex";
import { useEffect } from "react";
import { Pokemon } from "../../utils/types";
import { useRouter } from "next/router";
import AddPokemonButton from "../SelectAddRemovePokemon/AddButton";

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

  const { customBoxes, handleDeleteList, pageBox } = usePokedex();

  function handleSelectList(event: SelectChangeEvent) {
    const selection = event.target.value;

    router.push(`/boxtracker/${selection}`);
  }

  const modalStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
  };

  return (
    <>
      <Modal
        style={modalStyle}
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
      >
        <div className={`${styles.modalContainer} ${styles.small}`}>
          <h3>Confirm delete</h3>
          <div className={styles.buttonGroup} style={{ margin: "0 auto" }}>
            <Button
              onClick={() => setDeleteModalOpen(false)}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleDeleteList(pageSlug);
                setDeleteModalOpen(false);
                router.push("/boxtracker");
              }}
              variant="contained"
            >
              Yes, Delete List
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        style={modalStyle}
        open={addPokemonModalOpen}
        onClose={() => setAddPokemonModalOpen(false)}
      >
        <div className={styles.modalContainer}>
          <div className={styles.header}>
            <h3>Add Pokémon</h3>
            <Button
              onClick={() => setAddPokemonModalOpen(false)}
              variant="outlined"
            >
              Close
            </Button>
          </div>
          <AddPokemonButton />
        </div>
      </Modal>
      <Modal
        style={modalStyle}
        open={removePokemonModalOpen}
        onClose={() => setRemovePokemonModalOpen(false)}
      >
        <div className={styles.modalContainer}>
          <div className={styles.header}>
            <h3>Remove Pokémon</h3>
            <Button
              onClick={() => setRemovePokemonModalOpen(false)}
              variant="outlined"
            >
              Close
            </Button>
          </div>
          <SelectAddRemovePokemon kind="remove" pokemonList={pageBox.pokemon} />
        </div>
      </Modal>
      <div className={styles.container}>
        <div className={styles.buttonGroup}>
          {/* <FormControl>
            <InputLabel id="list-select-label">List</InputLabel>
            <Select
              labelId="list-select-label"
              id="list-select"
              value={pageSlug ? pageSlug : ""}
              label="List"
              onChange={(event) => handleSelectList(event)}
              style={{ width: "250px" }}
            >
              {customBoxes.length &&
                customBoxes.length > 0 &&
                customBoxes.map((list) => {
                  return (
                    <MenuItem key={list.id} value={list.id}>
                      {list.name}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl> */}
          <span>*Attention, the lists are saved locally on your browser</span>
        </div>
        <div className={styles.buttonGroup}>
          <Button
            onClick={() => setAddPokemonModalOpen(true)}
            variant="contained"
          >
            Add Pokémon
          </Button>
          <Button
            onClick={() => setRemovePokemonModalOpen(true)}
            variant="contained"
          >
            Remove Pokémon
          </Button>
          <Button onClick={() => setDeleteModalOpen(true)} variant="contained">
            Delete List
          </Button>
        </div>
      </div>
    </>
  );
}
