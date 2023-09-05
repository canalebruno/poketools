import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import masterStyles from "../../styles/Home.module.scss";
import styles from "./styles.module.scss";
import { usePokedex } from "../../hooks/usePokedex";
import { useEffect, useState } from "react";
import { List, Pokemon, PokemonCustomBox } from "../../utils/types";
import Link from "next/link";
import ImportOldBoxes from "../../components/ImportOldBoxes";
import Head from "next/head";
import Modal from "../../components/Modal";
import InputContainer from "../../components/Inputs/InputContainer";
import Button from "../../components/Button";

export default function BoxTrackerMain() {
  const { setCustomBoxes, customBoxes, setPokedexShown } = usePokedex();

  const [newBoxName, setNewBoxName] = useState("");
  const [shinydex, setShinydex] = useState([] as Pokemon[]);
  const [newBoxModalOpen, setNewBoxModalOpen] = useState(false);
  const [templateListSelection, setTemplateListSelection] = useState("none");
  const [isAllShiny, setIsAllShiny] = useState(false);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [importValue, setImportValue] = useState("");

  useEffect(() => {
    setPokedexShown([] as Pokemon[]);

    fetch("/api/shinydex")
      .then((res) => res.json())
      .then((data) => {
        setShinydex(data);
      });

    const localBoxes = localStorage.getItem("localBoxes");

    if (localBoxes) {
      setCustomBoxes(JSON.parse(localBoxes));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const newCustomBox: List = {
      id: newSlug,
      name: newBoxName,
      pokemon: findTemplate(),
    };

    const updatedLists: List[] = [...customBoxes, newCustomBox];
    setCustomBoxes(updatedLists);
    localStorage.setItem("localBoxes", JSON.stringify(updatedLists));
    handleNewBoxModalClose();
  }

  function findTemplate() {
    let templateDone;

    switch (templateListSelection) {
      case "gender":
        // Filter by females with genderDifference
        const females = shinydex.filter((pkmn) => {
          return pkmn.genderDifference;
        });

        // New array with the males from the females array
        const males = females.map((female) => {
          const male = shinydex.find((pkmn) => {
            return pkmn.id === female.id.slice(0, -2);
          });

          if (male) {
            return male;
          } else {
            // To prevent having an undefined result
            return female;
          }
        });

        // Compiling males and females, and filtering duplicate females
        const malesFemales = [
          ...males.filter((male) => {
            return !male.genderDifference;
          }),
          ...females,
        ];

        templateDone = malesFemales;
        break;
      case "national":
        templateDone = shinydex;
        break;
      case "hisui":
        templateDone = shinydex.filter((pkmn) => {
          return pkmn.hisuiDex;
        });
        break;
      case "paldea":
        templateDone = shinydex.filter((pkmn) => {
          return (
            (pkmn.paldeaDex && pkmn.paldeaDex <= 400) || pkmn.nationalDex > 1000
          );
        });
        break;
      case "regionals":
        templateDone = shinydex.filter((pkmn) => {
          return (
            pkmn.generalForm === "Hisuian" ||
            pkmn.generalForm === "Alolan" ||
            pkmn.generalForm === "Galarian" ||
            pkmn.generalForm === "Paldean"
          );
        });
        break;
      case "mega":
        templateDone = shinydex.filter((pkmn) => {
          return pkmn.generalForm === "Mega" || pkmn.uniqueForm === "Primal";
        });
        break;
      case "gigantamax":
        templateDone = shinydex.filter((pkmn) => {
          return pkmn.generalForm === "Gigantamax";
        });
        break;
      case "gen1":
        templateDone = shinydex.filter((pkmn) => {
          return pkmn.generation === 1;
        });
        break;
      case "gen2":
        templateDone = shinydex.filter((pkmn) => {
          return pkmn.generation === 2;
        });
        break;
      case "gen3":
        templateDone = shinydex.filter((pkmn) => {
          return pkmn.generation === 3;
        });
        break;
      case "gen4":
        templateDone = shinydex.filter((pkmn) => {
          return pkmn.generation === 4;
        });
        break;
      case "gen5":
        templateDone = shinydex.filter((pkmn) => {
          return pkmn.generation === 5;
        });
        break;
      case "gen6":
        templateDone = shinydex.filter((pkmn) => {
          return pkmn.generation === 6;
        });
        break;
      case "gen7":
        templateDone = shinydex.filter((pkmn) => {
          return pkmn.generation === 7;
        });
        break;
      case "gen8":
        templateDone = shinydex.filter((pkmn) => {
          return pkmn.generation === 8 || pkmn.generation === 8.5;
        });
        break;
      case "gen9":
        templateDone = shinydex.filter((pkmn) => {
          return pkmn.generation === 9;
        });
        break;
      case "multiple":
        const multipleForm = shinydex.filter((pkmn) => {
          return (
            (pkmn.uniqueForm &&
              pkmn.generalForm !== "Mega" &&
              pkmn.generalForm !== "Gigantamax" &&
              pkmn.uniqueForm !== "Primal") ||
            pkmn.id === "555_02"
          );
        });

        const originalForm = multipleForm.map((multi) => {
          const original = shinydex.find((pkmn) => {
            return (
              pkmn.nationalDex === multi.nationalDex &&
              pkmn.formOrder === "00" &&
              pkmn.id !== "128_00"
            );
          });

          if (original) {
            return original;
          } else {
            // To prevent having an undefined result
            return multi;
          }
        });

        const compiled = [...multipleForm, ...originalForm];

        // Remove duplicates
        templateDone = compiled.filter(
          (item, index) => compiled.indexOf(item) === index
        );
        break;
      case "galar":
        templateDone = shinydex.filter((pkmn) => {
          return pkmn.galarDex;
        });
        break;
      case "ioa":
        templateDone = shinydex.filter((pkmn) => {
          return pkmn.galarIoaDex;
        });
        break;
      case "ct":
        templateDone = shinydex.filter((pkmn) => {
          return pkmn.galarCtDex;
        });
        break;
      case "swsh":
        templateDone = shinydex.filter((pkmn) => {
          return pkmn.galarDex || pkmn.galarIoaDex || pkmn.galarCtDex;
        });
        break;
    }

    if (templateDone) {
      // Add individual customBoxId, shiny, checked and sort
      return templateDone
        .map((pkmn) => {
          return {
            ...pkmn,
            customBoxId: `${pkmn.id}-${Date.now()}`,
            isChecked: isAllChecked,
            isShiny: isAllShiny,
          };
        })
        .sort((a, b) => {
          if (a === undefined || b === undefined) {
            return 0;
          }

          if (a.nationalDex === b.nationalDex) {
            if (a.id < b.id) {
              return -1;
            } else if (a.id > b.id) {
              return 1;
            } else {
              return 0;
            }
          } else {
            return a.nationalDex - b.nationalDex;
          }
        });
    } else {
      return [] as PokemonCustomBox[];
    }
  }

  function handleNewBoxModalClose() {
    setNewBoxModalOpen(false);
    setNewBoxName("");
    setTemplateListSelection("none");
  }

  function handleSelectChange(value: string) {
    setTemplateListSelection(value);
  }

  return (
    <>
      <Head>
        <title>Pokémon Tools | Box Builder (Beta)</title>
        <meta
          property="og:title"
          content="Pokémon Tools | Box Builder (Beta)"
          key="title"
        />
      </Head>
      <Modal open={newBoxModalOpen} onClose={handleNewBoxModalClose}>
        <h3>Create Box</h3>
        <InputContainer fullWidth label="Box Name" valueOn={newBoxName}>
          <input
            placeholder="Box Name"
            type="text"
            value={newBoxName}
            onChange={(event) => setNewBoxName(event.target.value)}
          />
        </InputContainer>
        <InputContainer
          fullWidth
          label="Start with a template"
          valueOn={templateListSelection}
        >
          <select
            value={templateListSelection}
            onChange={(event) => {
              handleSelectChange(event.target.value);
            }}
          >
            <option value={"none"}>Start from scratch</option>
            <optgroup label="Dexes">
              <option value={"national"}>National Dex</option>
              <option value={"swsh"}>SwSh Dex (Galar + IoA + CT)</option>
              <option value={"galar"}>Galar Dex</option>
              <option value={"ioa"}>Isle of Armor Dex</option>
              <option value={"ct"}>Crown Tundra Dex</option>
              <option value={"hisui"}>Hisui Dex</option>
              <option value={"paldea"}>Paldea Dex</option>
            </optgroup>
            <optgroup label="Forms">
              <option value={"gender"}>Gender Differences</option>
              <option value={"multiple"}>Multiple Forms</option>
              <option value={"regionals"}>Regionals</option>
              <option value={"mega"}>Mega</option>
              <option value={"gigantamax"}>Gigantamax</option>
            </optgroup>
            <optgroup label="Generations">
              <option value={"gen1"}>Gen 1 Pokémon</option>
              <option value={"gen2"}>Gen 2 Pokémon</option>
              <option value={"gen3"}>Gen 3 Pokémon</option>
              <option value={"gen4"}>Gen 4 Pokémon</option>
              <option value={"gen5"}>Gen 5 Pokémon</option>
              <option value={"gen6"}>Gen 6 Pokémon</option>
              <option value={"gen7"}>Gen 7 Pokémon</option>
              <option value={"gen8"}>Gen 8 Pokémon</option>
              <option value={"gen9"}>Gen 9 Pokémon</option>
            </optgroup>
          </select>
        </InputContainer>
        <InputContainer label="Add All Shiny" valueOn={"s"}>
          <input
            type="checkbox"
            checked={isAllShiny}
            onChange={() => setIsAllShiny(!isAllShiny)}
          />
        </InputContainer>
        <InputContainer label="Start All Checked" valueOn={"s"}>
          <input
            type="checkbox"
            checked={isAllChecked}
            onChange={() => setIsAllChecked(!isAllChecked)}
          />
        </InputContainer>
        <div className={styles.buttonGroup} style={{ margin: "0 auto" }}>
          <Button
            label="Cancel"
            variant="outlined"
            onClick={handleNewBoxModalClose}
          />
          <Button
            label="Create"
            disabled={!newBoxName || !shinydex}
            onClick={handleCreateCustomBox}
          />
        </div>
      </Modal>
      <div className={masterStyles.container}>
        <div className={styles.topSection}>
          <Button
            onClick={() => setNewBoxModalOpen(true)}
            label="Create new Box"
          />
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
