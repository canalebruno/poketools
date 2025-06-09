"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";

interface WindowSizeProviderProps {
  children: ReactNode;
}

interface WindowsSizeContextData {
  windowWidth: number;
}

const WindowSizeContext = createContext<WindowsSizeContextData>(
  {} as WindowsSizeContextData
);

export function WindowSizeProvider({ children }: WindowSizeProviderProps) {
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowWidth(window.screen.width);
    }
  }, []);

  return (
    <WindowSizeContext.Provider value={{ windowWidth }}>
      {children}
    </WindowSizeContext.Provider>
  );
}

export function useWindowSize(): WindowsSizeContextData {
  const context = useContext(WindowSizeContext);

  return context;
}
