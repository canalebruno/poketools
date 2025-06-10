"use client";

import Button from "@/components/Button";
import { useController } from "@/hooks/useController";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import CustomBoxManager from "@/components/CustomBoxManagegr";
import { usePokedex } from "@/hooks/usePokedex";
import { List } from "@/utils/types";

export default function Profile() {
  const { data, status } = useSession();
  const { addNewUser, loggedUser, deleteUser, getUserData, updateBoxes } =
    useController();
  const { getLocalStorage } = usePokedex();

  const [username, setUsername] = useState("");
  const [iAgree, setIAgree] = useState(false);
  const [hasOldLocalStorage, setHasOldLocalStorage] = useState(false);
  const [oldLocalStorage, setOldLocalStorage] = useState([] as List[]);

  useEffect(() => {
    const retrievedLocalStorage = getLocalStorage();

    if (retrievedLocalStorage && retrievedLocalStorage.length > 0) {
      setHasOldLocalStorage(true);
      setOldLocalStorage(retrievedLocalStorage);
    } else {
      setHasOldLocalStorage(false);
    }
  }, [hasOldLocalStorage]);

  function incorporateOldLists() {
    const updatedLists =
      loggedUser?.boxes !== undefined && loggedUser.boxes.length > 0
        ? [...loggedUser.boxes, ...oldLocalStorage]
        : [...oldLocalStorage];

    localStorage.removeItem("localBoxes");

    if (updateBoxes.length > 0) {
      updateBoxes(
        loggedUser?._id as string,
        updatedLists.filter((box) => {
          return box.id !== undefined;
        }) as List[]
      );
    }
  }

  async function handleRegistration() {
    if (data?.user?.email === undefined) {
      return;
    }

    const newUser = {
      username,
      email: data.user.email as string,
    };

    const response = await addNewUser(newUser);

    if (response) {
      alert("Registration is succesful!");
      getUserData(data.user.email as string);
    } else {
      alert("Something went wrong.");
    }
  }

  if (
    status === "authenticated" &&
    (loggedUser === null || loggedUser.username === undefined)
  ) {
    return (
      <>
        <div>
          <div>Email: {data?.user?.email}</div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <p>
            <input
              type="checkbox"
              checked={iAgree}
              onChange={() => setIAgree(!iAgree)}
            />{" "}
            *I agree to store my email in the database to link it with the boxes
            I create. I understand that I can delete all my data from the
            database at any time.{" "}
          </p>
          <button disabled={!iAgree} onClick={() => handleRegistration()}>
            Register
          </button>
          <button>Cancel Registration</button>
        </div>
      </>
    );
  } else if (status === "authenticated" && loggedUser.username !== undefined) {
    return (
      <div>
        <h2>{loggedUser.username}</h2>
        <CustomBoxManager />
        <Button
          label="Delete account"
          onClick={() => {
            if (confirm("Are you sure to delete your account?")) {
              deleteUser(loggedUser._id);
            }
          }}
        />
        {hasOldLocalStorage && (
          <Button
            label="Load Local Storage Boxes"
            onClick={() => {
              if (
                confirm(
                  "Your local storage boxes will be loaded in the current user's database and deleted from the local storage. After this you can access those boxes whenever you login."
                )
              ) {
                incorporateOldLists();
              }
            }}
          />
        )}
      </div>
    );
  }
}
