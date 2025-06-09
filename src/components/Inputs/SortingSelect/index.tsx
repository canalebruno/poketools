import { useRouter } from "next/router";
import { usePokedex } from "../../../hooks/usePokedex";
import InputContainer from "../InputContainer";
import { usePathname } from "next/navigation";

export default function SortingSelect() {
  const pathname = usePathname();

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
      value: "paldean-tm",
      label: "Teal Mask Dex",
    },
    {
      value: "paldean-bb",
      label: "Blueberry Academy Dex",
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
  ].filter((option) => {
    if (pathname === "/svboxes") {
      return option.value === "national" || option.value === "paldean";
    } else if (pathname === "/teal-mask-boxes") {
      return option.value === "national" || option.value === "paldean-tm";
    } else {
      return option;
    }
  });

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
          | "paldean-tm"
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
