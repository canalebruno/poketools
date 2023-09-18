import { useRouter } from "next/router";
import { usePokedex } from "../../../hooks/usePokedex";
import InputContainer from "../InputContainer";
import { useEffect } from "react";

export default function SortingSelect() {
  const router = useRouter();

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
    if (router.pathname === "/svboxes") {
      return option.value === "national" || option.value === "paldean";
    } else if (router.pathname === "/teal-mask-boxes") {
      return option.value === "national" || option.value === "paldean-tm";
    } else {
      return option;
    }
  });

  const { handleSorting, orderList } = usePokedex();

  useEffect(() => {
    console.log(orderList);
  }, []);

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
