import { usePokedex } from "../../../hooks/usePokedex";
import InputContainer from "../InputContainer";
import TopLabel from "../InputContainer";
import styles from "../styles.module.scss";

export default function SortingSelect() {
  const options = [
    {
      value: "national",
      label: "National Dex",
    },
    {
      value: "paldean",
      label: "Paldea Dex",
    },
    {
      value: "hisuian",
      label: "Hisui Dex",
    },
    {
      value: "galarian",
      label: "Galar Dex",
    },
    {
      value: "galarian-ioa",
      label: "Isle of Armor Dex",
    },
    {
      value: "galarian-ct",
      label: "Crown Tundra Dex",
    },
  ];

  const { handleSorting, orderList } = usePokedex();

  function handleSelectChange(selection: string) {
    const orderListValues = options.map((option) => {
      return option.value;
    });

    if (!orderListValues.includes(selection)) {
      return;
    } else {
      handleSorting(
        selection as
          | "paldean"
          | "national"
          | "hisuian"
          | "galarian"
          | "galarian-ioa"
          | "galarian-ct"
      );
    }
  }

  return (
    <InputContainer label="Sort by" valueOn={orderList}>
      <select
        value={orderList}
        onChange={(event) => handleSelectChange(event.target.value)}
      >
        {options.map((option) => {
          return (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          );
        })}
      </select>
    </InputContainer>
  );
}
