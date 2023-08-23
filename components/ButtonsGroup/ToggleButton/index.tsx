import VisibilityTwoToneIcon from "@mui/icons-material/VisibilityTwoTone";
import VisibilityOffTwoToneIcon from "@mui/icons-material/VisibilityOffTwoTone";
import styles from "../styles.module.scss";

interface ToggleButtonProps {
  label: string;
  hideEyeIcon?: boolean;
  controller: boolean;
  onClick: () => void;
}

export default function ToggleButton({
  label,
  controller,
  onClick,
  hideEyeIcon = false,
}: ToggleButtonProps) {
  return (
    <button
      className={`${styles.container} ${controller && styles.active}`}
      onClick={onClick}
    >
      {hideEyeIcon ? (
        ""
      ) : controller ? (
        <VisibilityTwoToneIcon />
      ) : (
        <VisibilityOffTwoToneIcon />
      )}
      {label.toUpperCase()}
    </button>
  );
}
