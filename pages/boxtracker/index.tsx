import masterStyles from "../../styles/Home.module.scss";
import styles from "./styles.module.scss";
import { usePokedex } from "../../hooks/usePokedex";
import { useEffect, useState } from "react";
import { GetStaticProps } from "next";
import { Pokemon } from "../../utils/types";
import clientPromise from "../../utils/mongodb";
import Link from "next/link";
import {
  Button,
  FormControl,
  InputLabel,
  ListSubheader,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import ImportOldBoxes from "../../components/ImportOldBoxes";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

interface BoxTrackerMainProps {
  shinydex: Pokemon[];
}

export default function BoxTrackerMain({ shinydex }: BoxTrackerMainProps) {
  const { setCustomBoxes, customBoxes, setPokedexShown } = usePokedex();

  const [newBoxName, setNewBoxName] = useState("");
  const [newBoxModalOpen, setNewBoxModalOpen] = useState(false);
  const [templateListSelection, setTemplateListSelection] = useState("none");

  useEffect(() => {
    setPokedexShown([] as Pokemon[]);

    const localBoxes = localStorage.getItem("localBoxes");

    if (localBoxes) {
      setCustomBoxes(JSON.parse(localBoxes));
    }
  }, []);

  function convertNameToSlug(name: string) {
    const slug = name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(" ", "-")
      .toLowerCase();

    return slug;
  }

  function handleCreateCustomBox() {
    const newSlug = convertNameToSlug(newBoxName);

    const usedSlug = customBoxes.find((box) => box.id === newSlug);

    if (usedSlug) {
      return;
    }

    const newCustomBox = {
      id: newSlug,
      name: newBoxName,
      pokemon: useTemplate(),
    };

    const updatedLists = [...customBoxes, newCustomBox];
    setCustomBoxes(updatedLists);
    localStorage.setItem("localBoxes", JSON.stringify(updatedLists));
    handleNewBoxModalClose();
  }

  function useTemplate() {
    switch (templateListSelection) {
      case "gender":
        return shinydex.filter((pkmn) => {
          return pkmn.genderDifference;
        });
      default:
        return [];
    }
  }

  function handleNewBoxModalClose() {
    setNewBoxModalOpen(false);
    setNewBoxName("");
  }

  function handleSelectChange(event: SelectChangeEvent) {
    setTemplateListSelection(event.target.value as string);
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
        open={newBoxModalOpen}
        onClose={handleNewBoxModalClose}
      >
        <div className={`${styles.modalContainer} ${styles.small}`}>
          <h3>Create Box</h3>
          <TextField
            value={newBoxName}
            onChange={(event) => setNewBoxName(event.target.value)}
            id="new-list-name"
            label="Box Name"
            variant="standard"
          />
          <FormControl>
            <InputLabel id="template-list-select-label">
              Start with a template
            </InputLabel>
            <Select
              labelId="template-list-select-label"
              id="template-list-select"
              value={templateListSelection}
              label="Start with a template"
              onChange={handleSelectChange}
            >
              <MenuItem value={"none"}>Start from scratch</MenuItem>
              <ListSubheader>Dexes</ListSubheader>
              <MenuItem value={"national"}>National Dex</MenuItem>
              <MenuItem value={"swsh"}>SwSh Dex (Galar + IoA + CT)</MenuItem>
              <MenuItem value={"galar"}>Galar Dex</MenuItem>
              <MenuItem value={"ioa"}>Isle of Armor Dex</MenuItem>
              <MenuItem value={"ct"}>Crown Tundra Dex</MenuItem>
              <MenuItem value={"hisui"}>Hisui Dex</MenuItem>
              <MenuItem value={"paldea"}>Paldea Dex</MenuItem>
              <ListSubheader>Forms</ListSubheader>
              <MenuItem value={"gender"}>Gender Differences</MenuItem>
              <MenuItem value={"regionals"}>Regionals</MenuItem>
              <MenuItem value={"mega"}>Mega</MenuItem>
              <MenuItem value={"gigantamax"}>Gigantamax</MenuItem>
              <ListSubheader>Generations</ListSubheader>
              <MenuItem value={"gen1"}>Gen 1 Pokémon</MenuItem>
              <MenuItem value={"gen2"}>Gen 2 Pokémon</MenuItem>
              <MenuItem value={"gen3"}>Gen 3 Pokémon</MenuItem>
              <MenuItem value={"gen4"}>Gen 4 Pokémon</MenuItem>
              <MenuItem value={"gen5"}>Gen 5 Pokémon</MenuItem>
              <MenuItem value={"gen6"}>Gen 6 Pokémon</MenuItem>
              <MenuItem value={"gen7"}>Gen 7 Pokémon</MenuItem>
              <MenuItem value={"gen8"}>Gen 8 Pokémon</MenuItem>
              <MenuItem value={"gen9"}>Gen 9 Pokémon</MenuItem>
            </Select>
          </FormControl>
          <div className={styles.buttonGroup} style={{ margin: "0 auto" }}>
            <Button onClick={handleNewBoxModalClose} variant="outlined">
              Cancel
            </Button>
            <Button onClick={handleCreateCustomBox} variant="contained">
              Create
            </Button>
          </div>
        </div>
      </Modal>
      <div className={masterStyles.container}>
        <div className={styles.topSection}>
          <Button variant="contained" onClick={(e) => setNewBoxModalOpen(true)}>
            Create new Box
          </Button>
          <ImportOldBoxes />
        </div>
        <div className={styles.main}>
          {customBoxes &&
            customBoxes.length > 0 &&
            customBoxes
              .sort((a, b) => {
                if (a.id < b.id) {
                  return -1;
                } else if (a.id > b.id) {
                  return 1;
                } else {
                  return 0;
                }
              })
              .map((list) => {
                return (
                  <Link
                    key={list.id}
                    className={styles.boxCard}
                    href={`/boxtracker/${list.id}`}
                  >
                    <span>{list.name}</span>
                    <ArrowRightAltIcon />
                  </Link>
                );
              })}
        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const client = await clientPromise;
  const db = client.db("pokedex");

  const notInclude = [
    "670_05",
    "774_00",
    "774_02",
    "774_03",
    "774_04",
    "774_05",
    "774_06",
    "774_07",
    "869_07",
    "869_08",
    "869_09",
    "869_10",
    "869_11",
    "869_12",
    "869_13",
    "869_14",
    "869_15",
    "869_16",
    "869_17",
    "869_18",
    "869_19",
    "869_20",
    "869_21",
    "869_22",
    "869_23",
    "869_24",
    "869_25",
    "869_26",
    "869_27",
    "869_28",
    "869_29",
    "869_30",
    "869_31",
    "869_32",
    "869_33",
    "869_34",
    "869_35",
    "869_36",
    "869_37",
    "869_38",
    "869_39",
    "869_40",
    "869_41",
    "869_42",
    "869_43",
    "869_44",
    "869_45",
    "869_46",
    "869_47",
    "869_48",
    "869_49",
    "869_50",
    "869_51",
    "869_52",
    "869_53",
    "869_54",
    "869_55",
    "869_56",
    "869_57",
    "869_58",
    "869_59",
    "869_60",
    "869_61",
    "869_62",
    "1009_00",
    "1010_00",
  ];

  const shinydex = await db
    .collection("pokedex")
    .find({
      homeShinyPic: { $ne: null },
      id: {
        $nin: notInclude,
      },
    })
    .sort({ nationalDex: 1, id: 1 })
    .toArray();

  return {
    props: { shinydex: JSON.parse(JSON.stringify(shinydex)) },
  };
};
