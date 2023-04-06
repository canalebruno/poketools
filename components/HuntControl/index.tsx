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
import { useShinyHunting } from "../../hooks/useShinyHunting";
import SelectAddPokemon from "../SelectAddRemovePokemon";
import styles from "./styles.module.scss";

export default function HuntControl() {
  const [newListName, setNewListName] = useState("");
  const [newListModalOpen, setNewListModalOpen] = useState(false);
  const [addPokemonModalOpen, setAddPokemonModalOpen] = useState(false);
  const [removePokemonModalOpen, setRemovePokemonModalOpen] = useState(false);
  const [countIdList, setCountIdList] = useState(1);

  const {
    // listShown,
    // setListShown,
    allLists,
    setAllLists,
    handleRemovePokemon,
    handleDeleteList,
    activeList,
    setActiveList,
  } = useShinyHunting();

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
      id: `custom-list-${countIdList}`,
      name: newListName,
      pokemon: [],
    };

    const updatedLists = [...allLists, newList];
    setCountIdList(countIdList + 1);
    setAllLists(updatedLists);
    setActiveList(newList);
    setNewListModalOpen(false);
  }

  function handleNewListModalClose() {
    setNewListModalOpen(false);
    setNewListName("");
  }

  const handleNewListModalOpen = () => setNewListModalOpen(true);

  return (
    <>
      <Modal open={newListModalOpen} onClose={handleNewListModalClose}>
        <div>
          <TextField
            value={newListName}
            onChange={(event) => setNewListName(event.target.value)}
            id="new-list-name"
            label="List Name"
            variant="standard"
          />
          <Button onClick={handleNewListModalClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleCreateList} variant="contained">
            Create
          </Button>
        </div>
      </Modal>
      <Modal
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        open={addPokemonModalOpen}
        onClose={() => setAddPokemonModalOpen(false)}
      >
        <div className={styles.modalContainer}>
          <SelectAddPokemon />
        </div>
      </Modal>
      <Modal
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        open={removePokemonModalOpen}
        onClose={() => setRemovePokemonModalOpen(false)}
      >
        <div className={styles.modalContainer}>
          <SelectAddPokemon remove />
        </div>
      </Modal>
      <FormControl>
        <InputLabel id="list-select-label">List</InputLabel>
        <Select
          labelId="list-select-label"
          id="list-select"
          value={activeList.id ? activeList.id : "default"}
          label="List"
          onChange={(event) => handleSelectList(event)}
        >
          <MenuItem value={"default"}>Show All Shinies</MenuItem>
          <MenuItem value={"create"}>+ Create new List</MenuItem>
          {allLists.length &&
            allLists.length > 0 &&
            allLists.map((list) => {
              if (list.id === "default") {
                return;
              }
              return <MenuItem value={list.id}>{list.name}</MenuItem>;
            })}
        </Select>
      </FormControl>
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
        onClick={handleDeleteList}
        variant="contained"
      >
        Delete List
      </Button>
    </>
  );
}
