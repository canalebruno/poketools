import { usePokedex } from "../../hooks/usePokedex";
import ToggleButton from "./ToggleButton";
import styles from "./styles.module.scss";

interface ButtonsGroupProps {
  vertical?: boolean;
}

export default function ButtonsGroup({ vertical = false }: ButtonsGroupProps) {
  const {
    viewGenderDifference,
    viewOnlyOneForm,
    breakByGen,
    handleViewGenderDifference,
    handleViewOnlyOneForm,
    handleBreakByGen,
  } = usePokedex();

  return (
    <div className={`${styles.wrapper} ${vertical && styles.vertical}`}>
      <ToggleButton
        onClick={handleViewGenderDifference}
        controller={viewGenderDifference}
        label="Gender Difference"
      />
      <ToggleButton
        onClick={handleViewOnlyOneForm}
        controller={viewOnlyOneForm}
        label="Only 1 Form"
      />
      <ToggleButton
        onClick={handleBreakByGen}
        controller={breakByGen}
        label="Break by Gen"
      />
    </div>
  );
}
