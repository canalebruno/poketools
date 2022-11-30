import pokedexJson from "../../json/pokedex.json";
import pokelist from "../../json/paldeaDex.json";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";

interface Pokemon {
  id: string;
  nationalDex: number;
  paldeaDex: number;
  generalForm: string;
  uniqueForm: string;
  uniqueCode: string;
  name: string;
  generation: number;
  type1: string;
  type2: string;
  icon: string;
  genderDifference: boolean;
  homeAvailable: boolean;
  shinyAvailable: boolean;
}

interface Box {
  box: number;
  pokemon: Pokemon[];
}

export default function Box() {
  const [pokedex, setPokedex] = useState<Pokemon[]>(
    pokelist.sort((a, b) => {
      return a.paldeaDex - b.paldeaDex;
    })
  );
  const [boxQuantity, setBoxQuantity] = useState(0);
  const [pokeBox, setPokeBox] = useState<Box[]>([] as Box[]);
  const [viewGenderDifference, setViewGenderDifference] = useState(true);
  const [viewOnlyOneForm, setViewOnlyOneForm] = useState(false);
  const [orderList, setOrderList] = useState<"p" | "n">("p");

  useEffect(() => {
    console.log("effect");
    setBoxQuantity(Math.ceil(pokedex.length / 30));

    if (orderList === "p") {
      setPokedex(sortByPaldeanDex());
    } else {
      setPokedex(sortByNationalDex());
    }

    if (boxQuantity > 0) {
      setPokeBox(handleBoxQuantity());
    }
  }, [pokedex, boxQuantity, orderList]);

  function handleBoxQuantity() {
    console.log("chamou handlebox");
    const newPokeBox = [];

    if (boxQuantity > 0) {
      for (let i = 1; i <= boxQuantity; i++) {
        newPokeBox.push({
          box: i,
          pokemon: pokedex.slice(30 * i - 30, 30 * i),
        });
      }
    }

    return newPokeBox;
  }

  function handleViewGenderDifference() {
    const newSetting = !viewGenderDifference;

    setViewGenderDifference(newSetting);

    if (newSetting) {
      setViewOnlyOneForm(false);
      setPokedex(pokelist);
    } else {
      setPokedex(filterByGender());
    }
  }

  function handleViewOnlyOneForm() {
    const newSetting = !viewOnlyOneForm;

    setViewOnlyOneForm(newSetting);

    if (!newSetting) {
      if (viewGenderDifference) {
        setPokedex(pokelist);
      } else {
        setPokedex(filterByGender());
      }
    } else {
      setViewGenderDifference(false);
      setPokedex(filterByOnlyOneForm());
    }
  }

  function filterByGender() {
    return pokelist.filter((pkmn) => {
      return !pkmn.genderDifference;
    });
  }

  function filterByOnlyOneForm() {
    return filterByGender().filter((pkmn) => {
      return !pkmn.uniqueCode;
    });
  }

  function sortByNationalDex() {
    return pokedex.sort((a, b) => {
      return a.nationalDex - b.nationalDex;
    });
  }

  function sortByPaldeanDex() {
    return pokedex.sort((a, b) => {
      return a.paldeaDex - b.paldeaDex;
    });
  }

  function handleSorting(value: string) {
    const newOrder = value;

    if (newOrder !== "p" && newOrder !== "n") {
      return;
    }

    setOrderList(newOrder);

    if (newOrder === "p") {
      setPokedex(sortByPaldeanDex());
      console.log(sortByPaldeanDex());
      console.log("chegou no p");
    } else {
      setPokedex(sortByNationalDex());
      console.log(sortByNationalDex());
      console.log("chegou no n");
    }
  }

  return (
    <div className={styles.container}>
      <select onChange={(e) => handleSorting(e.target.value)} value={orderList}>
        <option value="p">Sort by Paldean Dex</option>
        <option value="n">Sort by National Dex</option>
      </select>
      <label>
        <input
          type="checkbox"
          checked={viewGenderDifference}
          onChange={handleViewGenderDifference}
          name="Gender Difference"
          id="genderDifference"
        />
        Gender Difference
      </label>
      <label>
        <input
          type="checkbox"
          checked={viewOnlyOneForm}
          onChange={handleViewOnlyOneForm}
          name="Only One Form"
          id="onlyOneForm"
        />
        Only 1 Form
      </label>
      {pokeBox.map((box) => {
        return (
          <div key={box.box} className={styles.boxContainer}>
            <div className={styles.boxHeader}>Box {box.box}</div>
            <div className={styles.boxGrid}>
              {box.pokemon.map((pkmn) => {
                return (
                  <div key={pkmn.id} className={styles.card}>
                    <img src={`svicons/${pkmn.icon}`} alt={pkmn.name} />
                  </div>
                );
              })}
              {box.pokemon.length < 30 &&
                [...Array(30 - box.pokemon.length)].map((x, i) => (
                  <div className={styles.card} key={i} />
                ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
