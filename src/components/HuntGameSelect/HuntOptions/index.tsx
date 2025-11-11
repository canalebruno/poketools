import { useEffect, useState } from "react";
import { usePokedex } from "../../../hooks/usePokedex";
import Modal from "../../Modal";
import styles from "../styles.module.scss";

interface HuntOptionsProps {
  isOpen: boolean;
  onClose: () => void;
}

type DLC = {
  id: number;
  name: string;
  value: string;
  kind: "base" | "dlc";
};

type HuntGameOptionsSelected = {
  baseGame: string[];
  dlc: undefined | string[];
};

export default function HuntOptions({ isOpen, onClose }: HuntOptionsProps) {
  const { huntGameSelection, handleSelectGame } = usePokedex();
  const [optionsShown, setOptionsShown] = useState<DLC[] | null>(null);
  const [huntGameOptionsSelected, setHuntGameOptionsSelected] =
    useState<HuntGameOptionsSelected | null>(null);

  const svDLC: DLC[] = [
    {
      id: 1,
      name: "Scarlet",
      value: "sv-s",
      kind: "base",
    },
    {
      id: 2,
      name: "Violet",
      value: "sv-v",
      kind: "base",
    },
    {
      id: 3,
      name: "Teal Mask",
      value: "sv-tm",
      kind: "dlc",
    },
    {
      id: 4,
      name: "Indigo Disk",
      value: "sv-id",
      kind: "dlc",
    },
  ];

  const swshDLC: DLC[] = [
    {
      id: 1,
      name: "Sword",
      value: "swsh-sw",
      kind: "base",
    },
    {
      id: 2,
      name: "Shield",
      value: "swsh-sh",
      kind: "base",
    },
    {
      id: 3,
      name: "Isle of Armor",
      value: "swsh-ioa",
      kind: "dlc",
    },
    {
      id: 4,
      name: "Crown Tundra",
      value: "swsh-ct",
      kind: "dlc",
    },
  ];

  useEffect(() => {
    switch (huntGameSelection?.baseGame) {
      case "sv":
        setOptionsShown(svDLC);
        setHuntGameOptionsSelected({
          baseGame: ["sv-s", "sv-v"],
          dlc: ["sv-tm", "sv-id"],
        });
        break;
      case "swsh":
        setOptionsShown(swshDLC);
        setHuntGameOptionsSelected({
          baseGame: ["swsh-sw", "swsh-sh"],
          dlc: ["swsh-ioa", "swsh-ct"],
        });
        break;
      default:
        setOptionsShown(null);
        setHuntGameOptionsSelected(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [huntGameSelection?.baseGame]);

  useEffect(() => {
    if (huntGameOptionsSelected) {
      let exclusivesToSet = [...huntGameOptionsSelected.baseGame];

      if (huntGameOptionsSelected.dlc) {
        exclusivesToSet = [...exclusivesToSet, ...huntGameOptionsSelected.dlc];
      }

      handleSelectGame({
        baseGame: huntGameSelection!.baseGame,
        exclusives: exclusivesToSet,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [huntGameOptionsSelected]);

  function handleOptionCheck(value: string) {
    const isBaseGame =
      optionsShown?.find((option) => {
        return option.value === value;
      })?.kind === "base";

    if (!huntGameOptionsSelected) {
      return;
    }

    if (isBaseGame) {
      if (huntGameOptionsSelected.baseGame.includes(value)) {
        if (huntGameOptionsSelected.baseGame.length > 1) {
          setHuntGameOptionsSelected({
            dlc: huntGameOptionsSelected.dlc,
            baseGame: huntGameOptionsSelected.baseGame.filter((option) => {
              return option !== value;
            }),
          });
        } else {
          switch (value) {
            case "sv-s":
              setHuntGameOptionsSelected({
                dlc: huntGameOptionsSelected.dlc,
                baseGame: ["sv-v"],
              });
              break;
            case "sv-v":
              setHuntGameOptionsSelected({
                dlc: huntGameOptionsSelected.dlc,
                baseGame: ["sv-s"],
              });
              break;
            case "swsh-sw":
              setHuntGameOptionsSelected({
                dlc: huntGameOptionsSelected.dlc,
                baseGame: ["swsh-sh"],
              });
              break;
            case "swsh-sh":
              setHuntGameOptionsSelected({
                dlc: huntGameOptionsSelected.dlc,
                baseGame: ["swsh-sw"],
              });
              break;
          }
        }
      } else {
        setHuntGameOptionsSelected({
          dlc: huntGameOptionsSelected.dlc,
          baseGame: [...huntGameOptionsSelected.baseGame, value],
        });
      }
    } else {
      if (huntGameOptionsSelected.dlc) {
        if (huntGameOptionsSelected.dlc.includes(value)) {
          setHuntGameOptionsSelected({
            baseGame: huntGameOptionsSelected.baseGame,
            dlc: huntGameOptionsSelected.dlc.filter((option) => {
              return option !== value;
            }),
          });
        } else {
          setHuntGameOptionsSelected({
            baseGame: huntGameOptionsSelected.baseGame,
            dlc: [...huntGameOptionsSelected.dlc, value],
          });
        }
      } else {
        setHuntGameOptionsSelected({
          baseGame: huntGameOptionsSelected.baseGame,
          dlc: [value],
        });
      }
    }
  }

  return (
    <Modal onClose={onClose} open={isOpen}>
      <h3>DLC Options</h3>
      <div className={styles.optionsContainer}>
        {optionsShown &&
          optionsShown.map((option) => {
            return (
              <div key={option.id}>
                <input
                  type="checkbox"
                  value={option.value}
                  checked={
                    huntGameOptionsSelected?.baseGame.includes(option.value) ||
                    huntGameOptionsSelected?.dlc?.includes(option.value)
                  }
                  onChange={() => handleOptionCheck(option.value)}
                />
                {option.name}
              </div>
            );
          })}
      </div>
    </Modal>
  );
}
