"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Button from "../Button";
import { useController } from "@/hooks/useController";

export default function Login() {
  const { data } = useSession();
  const { loggedUser } = useController();

  // Switch between localhost for dev and vercel for production
  const url =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://poketools-blue.vercel.app";

  return data?.user ? (
    <>
      <Link href={`/tracker/${loggedUser?.username}`}>
        <span>{loggedUser?.username}</span>
      </Link>
      <Button
        label="Sign Out"
        onClick={() => {
          // Fixed parameter: callbackUrl
          signOut({ callbackUrl: url });
        }}
      />
    </>
  ) : (
    <Button
      label="Sign In"
      onClick={() => {
        // Fixed parameter: callbackUrl
        signIn("google", {
          callbackUrl: `${url}/tracker/`,
        });
      }}
    />
  );
}
