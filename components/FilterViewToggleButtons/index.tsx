import { usePokedex } from "../../hooks/usePokedex";
import ButtonsGroup from "../ButtonsGroup";
import ToggleButton from "../ButtonsGroup/ToggleButton";

interface FilterViewToggleButtonsProps {
  vertical?: boolean;
}

export default function FilterViewToggleButtons({
  vertical = false,
}: FilterViewToggleButtonsProps) {
  const {
    viewGenderDifference,
    viewOnlyOneForm,
    breakByGen,
    handleViewGenderDifference,
    handleViewOnlyOneForm,
    handleBreakByGen,
  } = usePokedex();

  return (
    <ButtonsGroup vertical={vertical}>
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
    </ButtonsGroup>
  );
}
