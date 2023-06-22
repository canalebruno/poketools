import { Button } from "@mui/material";
import { List } from "../../utils/types";
// import { useShinyTracker } from "../../hooks/useShinyTracker";
import styles from "./styles.module.scss";
import { ChangeEvent } from "react";
import { usePokedex } from "../../hooks/usePokedex";

export default function ImportExportButtons() {
  const { customBoxes } = usePokedex();

  function handleExport() {
    const maskedItem = customBoxes
      .filter((list) => list.id !== "default")
      .map((list) => {
        return {
          ...list,
          pokemon: list.pokemon.map((pkmn) => {
            return pkmn.id;
          }),
        };
      });

    const content = JSON.stringify(maskedItem);

    let element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(content)
    );
    element.setAttribute("download", "shiny-tracker.txt");

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const fileList = event.target.files;
  }

  return (
    <div>
      <Button onClick={handleExport}>Export</Button>
      <Button>
        <label>
          <input type="file" hidden onChange={(e) => handleImport(e)} />
          Import
        </label>
      </Button>
    </div>
  );
}
