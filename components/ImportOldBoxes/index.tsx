import { usePokedex } from "../../hooks/usePokedex";
import { List } from "../../utils/types";
import Button from "../Button";

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
      alert("There are no old lists.");
    }
  }

  return <Button label="Sync your old lists" onClick={handleSync} />;
}
