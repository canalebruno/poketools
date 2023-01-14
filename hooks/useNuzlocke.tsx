import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";

interface NuzlockeProviderProps {
  children: ReactNode;
}

interface NuzlockeContextData {
  gameExclusive: string[];
  setGameExclusive: (value: string[]) => void;
  customOptions: string[];
  setCustomOptions: (value: string[]) => void;
  typeSelected: string;
  setTypeSelected: (value: string) => void;
}

const NuzlockeContext = createContext<NuzlockeContextData>(
  {} as NuzlockeContextData
);

export function NuzlockeProvider({ children }: NuzlockeProviderProps) {
  const [gameExclusive, setGameExclusive] = useState(["tradable"]);
  const [customOptions, setCustomOptions] = useState(["repeat"]);
  const [typeSelected, setTypeSelected] = useState("all");

  return (
    <NuzlockeContext.Provider
      value={{
        gameExclusive,
        setGameExclusive,
        customOptions,
        setCustomOptions,
        typeSelected,
        setTypeSelected,
      }}
    >
      {children}
    </NuzlockeContext.Provider>
  );
}

export function useNuzlocke(): NuzlockeContextData {
  const context = useContext(NuzlockeContext);

  return context;
}
