// "use client";

import { useController } from "@/hooks/useController";
import Head from "next/head";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Box from "../../../../components/Box";
import BoxGridLayout from "../../../../components/BoxGridLayout";
import BoxLoading from "../../../../components/BoxLoading";
import ButtonsGroup from "../../../../components/ButtonsGroup";
import ToggleButton from "../../../../components/ButtonsGroup/ToggleButton";
import FilterControl from "../../../../components/FilterControl";
import HuntGameSelect from "../../../../components/HuntGameSelect";
import HuntControl from "../../../../components/ShinyTrackerControl";
import { usePokedex } from "../../../../hooks/usePokedex";
import styles from "../../../styles/Home.module.scss";
import DynamicPokedexPage from "@/components/DynamicPokedexPage";
import { Pokemon } from "@/utils/types";
import { useSession } from "next-auth/react";
import { resolve } from "path";

export default async function CustomBoxTracker({
  params,
}: {
  params: { user: string; listId: string };
}) {
  const resolvedDex = await fetch(
    `http://localhost:3000/api/users/${(await params).user}/${
      (
        await params
      ).listId
    }`
  )
    .then((res) => res.json())
    .then((data) => {
      return data.data;
    });

  return (
    <div className={styles.container}>
      <DynamicPokedexPage pokedex={resolvedDex} />
    </div>
  );
}
