import styles from "../../styles/Home.module.scss";
import StaticPokedexPage from "@/components/StaticPokedexPage";
import { connect } from "@/utils/dbConnect/dbConnect";
import Pokedex from "@/utils/schema/PokedexSchema";
import { SortingList } from "@/utils/types";
import { notFound } from "next/navigation";
import { SortOrder } from "mongoose";

// 1. Define the configuration for each Pokedex page
const POKEDEX_CONFIGO: Record<
  string,
  {
    title: string;
    queryValue: { find: object; sort: object };
    sorting: SortingList;
  }
> = {
  home: {
    title: "National Pokédex",
    queryValue: { find: {}, sort: { "dex.nationalDex": 1, id: 1 } },
    sorting: "national",
  },
  "legends-za/hyperspace": {
    title: "Legends ZA - Lumiose Hyperspace Dex",
    queryValue: {
      find: { "dex.lumioseHyperspaceDex": { $gte: 1 } },
      sort: { "dex.lumioseHyperspaceDex": 1, id: 1 },
    },
    sorting: "lumiose-hyperspace",
  },
  "legends-za/lumiose": {
    title: "Legends ZA - Lumiose Dex",
    queryValue: {
      find: { "dex.zaLumioseDex": { $gte: 1 } },
      sort: { "dex.zaLumioseDex": 1, id: 1 },
    },
    sorting: "lumiose",
  },
  "legends-arceus/hisui": {
    title: "Legends Arceus - Hisui Dex",
    queryValue: {
      find: { "dex.hisuiDex": { $gte: 1 } },
      sort: { "dex.hisuiDex": 1, id: 1 },
    },
    sorting: "hisuian",
  },
  "scarlet-violet/paldea": {
    title: "Scarlet and Violet - Paldea Dex",
    queryValue: {
      find: { "dex.paldeaDex": { $gte: 1 } },
      sort: { "dex.paldeaDex": 1, id: 1 },
    },
    sorting: "paldean",
  },
  "scarlet-violet/blueberry": {
    title: "Scarlet and Violet - Blueberry Dex",
    queryValue: {
      find: { "dex.paldeaBBDex": { $gte: 1 } },
      sort: { "dex.paldeaBBDex": 1, id: 1 },
    },
    sorting: "paldean-bb",
  },
  "scarlet-violet/kitakami": {
    title: "Scarlet and Violet - Kitakami Dex",
    queryValue: {
      find: { "dex.paldeaTMDex": { $gte: 1 } },
      sort: { "dex.paldeaTMDex": 1, id: 1 },
    },
    sorting: "paldean-tm",
  },
  "sword-shield/galar": {
    title: "Sword and Shield - Galar Dex",
    queryValue: {
      find: { "dex.galarDex": { $gte: 1 } },
      sort: { "dex.galarDex": 1, id: 1 },
    },
    sorting: "galarian",
  },
  "sword-shield/crown-thundra": {
    title: "Sword and Shield - Crown Thundra Dex",
    queryValue: {
      find: { "dex.galarCtDex": { $gte: 1 } },
      sort: { "dex.galarCtDex": 1, id: 1 },
    },
    sorting: "galarian-ct",
  },
  "sword-shield/isle-of-armor": {
    title: "Sword and Shield - Isle of Armor Dex",
    queryValue: {
      find: { "dex.galarIoaDex": { $gte: 1 } },
      sort: { "dex.galarIoaDex": 1, id: 1 },
    },
    sorting: "galarian-ioa",
  },
};

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export default async function PokedexTemplatePage({ params }: PageProps) {
  const { slug } = await params;

  // If the user is just at /pokedex, default to "home"
  const currentPath = slug ? slug.join("/") : "home";
  const config = POKEDEX_CONFIGO[currentPath];

  // If the URL route isn't configured in our object, return a 404 page
  if (!config) {
    notFound();
  }

  // 2. Query the database using the mapped configuration data
  await connect();
  const rawData = await Pokedex.find({
    ...config.queryValue.find,
    "availability.homeDepositable": true,
  }).sort(config.queryValue.sort as { [key: string]: SortOrder });
  const pokedexData = JSON.parse(JSON.stringify(rawData));

  return (
    <div className={styles.container}>
      <h1>{config.title}</h1>
      <StaticPokedexPage
        key={currentPath}
        sortingDefault={config.sorting}
        pokedex={pokedexData}
      />
    </div>
  );
}

// 3. Keep it static! Generate all pages at build time automatically
export async function generateStaticParams() {
  // Tell Next.js about all existing paths so it bakes them instantly during 'next build'
  return Object.keys(POKEDEX_CONFIGO).map((path) => ({
    slug: path === "home" ? [] : path.split("/"),
  }));
}
