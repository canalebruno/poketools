"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import {
  Gamedex,
  List,
  ListOnStorage,
  Pokemon,
  SVLocation,
  User,
} from "@/utils/types";
import { signOut, useSession } from "next-auth/react";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNuzlocke } from "./useNuzlocke";
import { usePokedex } from "./usePokedex";

interface ControllerProviderProps {
  children: ReactNode;
}

interface ControllerContextData {
  getByPokedex: (gamedex: Gamedex, callback: Function) => void;
  getNuzlocke: () => void;
  getByFullPokedex: () => void;
  addNewUser: (newUser: {
    email: string;
    username: string;
  }) => Promise<boolean>;
  // getUserData: (email: string) => Promise<{ success: boolean; data: User }>;
  loggedUser: User;
  deleteUser: (id: string) => void;
  updateBoxes: (id: string, updatedBoxes: List[]) => void;
  getUserData: (ematil: string) => void;
}

const ControllerContext = createContext<ControllerContextData>(
  {} as ControllerContextData
);

export function ControllerProvider({ children }: ControllerProviderProps) {
  const {
    loadPokedex,
    setFullPokedex,
    expandPokemonList,
    setCustomBoxes,
    setCloudStorage,
  } = usePokedex();
  const { setNuzlockeJson } = useNuzlocke();
  const { data } = useSession();

  const [loggedUser, setLoggedUser] = useState<User>({} as User);
  const [change, setChange] = useState("");

  useEffect(() => {
    if (data?.user) {
      getUserData(data?.user?.email as string);
    } else {
      setLoggedUser({} as User);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, change]);

  useEffect(() => {
    if (loggedUser._id) {
      setCloudStorage(loggedUser);
    } else {
      setCloudStorage({} as User);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedUser]);

  async function getUserData(email: string) {
    const response = await fetch(`/api/users/${email}`, {
      cache: "default",
    });

    const data = await response.json();

    if (data.success) {
      if (data.data.pokemon !== undefined) {
        const expandedData = data.data.pokemon.map((box: ListOnStorage) => {
          return {
            ...box,
            pokemon: expandPokemonList(box.pokemon),
          };
        });

        setCustomBoxes(expandedData);
      }

      setLoggedUser(data.data);
    }
  }

  async function getDataByPokedex(gamedex: Gamedex) {
    const response = await fetch(`/api/pokedex/${gamedex}`, {
      cache: "no-store",
    });

    const data = await response.json();

    return data;
  }

  async function getByPokedex(gamedex: Gamedex, callback: Function) {
    const data = await getDataByPokedex(gamedex);

    if (data.success) {
      loadPokedex(data.data);
      callback();
    }
  }

  async function getByFullPokedex() {
    const response = await fetch(`/api/pokedex/`, {
      cache: "no-store",
    });

    const data = await response.json();

    if (data.success) {
      setFullPokedex(data.data);
    }
  }

  async function getNuzlocke() {
    const responseNuzlocke = await fetch("/api/svlocations", {
      cache: "no-store",
    });

    const dataNuzlocke = await responseNuzlocke.json();

    const dataPaldea = await getDataByPokedex("paldea");

    const dataWorked = dataNuzlocke.data.map((loc: SVLocation) => {
      return {
        id: loc.id,
        name: loc.name,
        general: loc.general.map((pkmnId) => {
          return dataPaldea.data.find((pkmn: Pokemon) => {
            return pkmn.id === pkmnId;
          });
        }),
        scarlet: loc.scarlet.map((pkmnId) => {
          return dataPaldea.data.find((pkmn: Pokemon) => {
            return pkmn.id === pkmnId;
          });
        }),
        violet: loc.violet.map((pkmnId) => {
          return dataPaldea.data.find((pkmn: Pokemon) => {
            return pkmn.id === pkmnId;
          });
        }),
      };
    });

    setNuzlockeJson(dataWorked);
  }

  async function deleteUser(id: string) {
    const response = await fetch(`/api/users/${id}`, {
      cache: "no-store",
      method: "DELETE",
    });

    const data = await response.json();

    if (data.success) {
      signOut({ redirectTo: "localhost:3000" });
    } else {
      alert("Something went wrong. Try again later.");
    }
  }

  async function addNewUser(newUser: { email: string; username: string }) {
    const response = await fetch("/api/users/", {
      cache: "no-store",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });

    const data: { success: boolean; data: any } = await response.json();

    return data.success;
  }

  async function updateBoxes(id: string, updatedBoxes: List[]) {
    const response = await fetch(`/api/users/${id}`, {
      cache: "no-store",
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedBoxes),
    });

    const data = await response.json();

    if (data.success) {
      setChange(String(new Date()));
    }
  }

  return (
    <ControllerContext.Provider
      value={{
        getByPokedex,
        getNuzlocke,
        getByFullPokedex,
        addNewUser,
        loggedUser,
        deleteUser,
        updateBoxes,
        getUserData,
      }}
    >
      {children}
    </ControllerContext.Provider>
  );
}

export function useController(): ControllerContextData {
  const context = useContext(ControllerContext);

  return context;
}
/* eslint-enable @typescript-eslint/no-explicit-any */
/* eslint-enable @typescript-eslint/no-unsafe-function-type */
