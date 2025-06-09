"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Button from "../Button";
import { useController } from "@/hooks/useController";

export default function Login() {
  const { data } = useSession();
  const { loggedUser } = useController();

  const url = `http://localhost:3000`;

  return data?.user ? (
    <>
      <Link href={`/tracker/${loggedUser?.username}`}>
        <span>{loggedUser?.username}</span>
      </Link>
      <Button
        label="Sign Out"
        onClick={() => {
          signOut({ redirectTo: url });
        }}
      />
    </>
  ) : (
    <Button
      label="Sign In"
      onClick={() => {
        signIn("google", {
          redirectTo: `${url}/tracker/`,
        });
      }}
    />
  );
}
