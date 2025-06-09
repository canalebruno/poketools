"use client";

import Button from "@/components/Button";
import { useController } from "@/hooks/useController";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import BoxTrackerMain from "../../boxtracker/page";
import CustomBoxManager from "@/components/CustomBoxManagegr";

export default function Profile() {
  const { data, status } = useSession();
  const { addNewUser, loggedUser, deleteUser, getUserData } = useController();
  const router = useRouter();

  const [username, setUsername] = useState("");

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
          <button onClick={() => handleRegistration()}>Register</button>
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
      </div>
    );
  }
}
