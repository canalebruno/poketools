import { useEffect, useState } from "react";
import { usePokedex } from "../../hooks/usePokedex";
import styles from "../Box/styles.module.scss";

interface FilterControlProps {
  sortingDefault: "p" | "n";
}

export default function FilterControl({ sortingDefault }: FilterControlProps) {
  const [pagePath, setPagePath] = useState("");

  const {
    viewGenderDifference,
    handleViewGenderDifference,
    viewOnlyOneForm,
    handleViewOnlyOneForm,
    handleSorting,
    orderList,
    resetControls,
    pokedex,
  } = usePokedex();

  useEffect(() => {
    handleSorting(sortingDefault);
    setPagePath(window.location.pathname);
    resetControls();
  }, []);

  return (
    <div className={styles.filterControl}>
      <select onChange={(e) => handleSorting(e.target.value)} value={orderList}>
        <option value="n">Sort by National Dex</option>
        {pagePath === "/" && <option value="p">Sort by Paldean Dex</option>}
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
      <div>
        <span>Order list: {orderList} | </span>
        <span>Showing: {pokedex.length} Pokemon | </span>
        <span>First: {pokedex[0].name} </span>
      </div>
    </div>
  );
}
