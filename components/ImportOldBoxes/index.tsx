import { Button } from "@mui/material";
import { usePokedex } from "../../hooks/usePokedex";
import { List } from "../../utils/types";

// REFATORAR AQUI BOTAO

export default function ImportOldBoxes() {
  const { customBoxes, setCustomBoxes } = usePokedex();

  function handleSync() {
    const oldLists = localStorage.getItem("localShinyTrackerLists");

    if (oldLists) {
      const json = JSON.parse(oldLists);

      const removeDefault = json.filter((item: List) => {
        return item.id !== "default";
      });

      const boxesToUpdate = [...customBoxes, ...removeDefault];

      setCustomBoxes(boxesToUpdate);
      localStorage.setItem("localBoxes", JSON.stringify(boxesToUpdate));
      localStorage.removeItem("localShinyTrackerLists");

      alert("Your boxes are updated.");
    } else {
      alert("There is no old lists.");
    }
  }

  return (
    <Button variant="contained" onClick={handleSync}>
      Sync your old lists
    </Button>
  );
}
