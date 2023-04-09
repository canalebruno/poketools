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
import { useShinyTracker } from "../../hooks/useShinyTracker";
import SelectAddPokemon from "../SelectAddRemovePokemon";
import styles from "./styles.module.scss";
import SelectAddRemovePokemon from "../SelectAddRemovePokemon";
import { useWindowSize } from "../../hooks/useWindowSize";

export default function ShinyTrackerControl() {
  const [newListName, setNewListName] = useState("");
  const [newListModalOpen, setNewListModalOpen] = useState(false);
  const [addPokemonModalOpen, setAddPokemonModalOpen] = useState(false);
  const [removePokemonModalOpen, setRemovePokemonModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  // const [countIdList, setCountIdList] = useState(1);

  const { allLists, setAllLists, handleDeleteList, activeList, setActiveList } =
    useShinyTracker();

  function handleSelectList(event: SelectChangeEvent) {
    const selection = event.target.value;

    if (selection === "create") {
      handleNewListModalOpen();
    } else {
      const newShownList = allLists.find((list) => list.id === selection);
      if (newShownList) {
        setActiveList(newShownList);
      } else {
        const defaultList = allLists.find((list) => list.id === "default");
        setActiveList(defaultList!);
      }
    }
  }

  function handleCreateList() {
    const newList = {
      id: `CL${Date.now()}`,
      name: newListName,
      pokemon: [],
    };

    const updatedLists = [...allLists, newList];
    // setCountIdList(countIdList + 1);
    setAllLists(updatedLists);
    setActiveList(newList);
    setNewListModalOpen(false);
    setNewListName("");
  }

  function handleNewListModalClose() {
    setNewListModalOpen(false);
    setNewListName("");
  }

  const handleNewListModalOpen = () => setNewListModalOpen(true);

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
                handleDeleteList();
                setDeleteModalOpen(false);
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
        open={newListModalOpen}
        onClose={handleNewListModalClose}
      >
        <div className={`${styles.modalContainer} ${styles.small}`}>
          <h3>Create List</h3>
          <TextField
            value={newListName}
            onChange={(event) => setNewListName(event.target.value)}
            id="new-list-name"
            label="List Name"
            variant="standard"
          />
          <div className={styles.buttonGroup} style={{ margin: "0 auto" }}>
            <Button onClick={handleNewListModalClose} variant="outlined">
              Cancel
            </Button>
            <Button onClick={handleCreateList} variant="contained">
              Create
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
          <SelectAddRemovePokemon kind="add" />
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
          <SelectAddRemovePokemon kind="remove" />
        </div>
      </Modal>
      <div className={styles.container}>
        <div className={styles.buttonGroup}>
          <FormControl>
            <InputLabel id="list-select-label">List</InputLabel>
            <Select
              labelId="list-select-label"
              id="list-select"
              value={activeList.id ? activeList.id : "default"}
              label="List"
              onChange={(event) => handleSelectList(event)}
              style={{ width: "250px" }}
            >
              <MenuItem value={"default"}>Show All Shinies</MenuItem>
              {allLists.length &&
                allLists.length > 0 &&
                allLists.map((list) => {
                  if (list.id === "default") {
                    return;
                  }
                  return (
                    <MenuItem key={list.id} value={list.id}>
                      {list.name}
                    </MenuItem>
                  );
                })}
              <MenuItem value={"create"}>+ Create new List</MenuItem>
            </Select>
          </FormControl>
          <span>*Attention, the lists are saved locally on your browser</span>
        </div>
        <div className={styles.buttonGroup}>
          <Button
            disabled={activeList.id === "default"}
            onClick={() => setAddPokemonModalOpen(true)}
            variant="contained"
          >
            Add Pokémon
          </Button>
          <Button
            disabled={activeList.id === "default"}
            onClick={() => setRemovePokemonModalOpen(true)}
            variant="contained"
          >
            Remove Pokémon
          </Button>
          <Button
            disabled={activeList.id === "default"}
            onClick={() => setDeleteModalOpen(true)}
            variant="contained"
          >
            Delete List
          </Button>
        </div>
      </div>
    </>
  );
}
