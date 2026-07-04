import styles from "../../../styles/Home.module.scss";
import DynamicPokedexPage from "@/components/DynamicPokedexPage";
import { connect } from "@/utils/dbConnect/dbConnect";
import Users from "@/utils/schema/UsersSchema";
import Pokedex from "@/utils/schema/PokedexSchema";
import { User } from "@/utils/types";

interface PageParams {
  username: string;
  boxName: string;
}

export const dynamic = "force-dynamic";

export default async function CustomBoxTracker({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { username, boxName } = await params;

  try {
    await connect();

    // 1. Grab the user document
    const userDoc = (await Users.findOne({ username }).lean()) as User | null;

    if (!userDoc) {
      return (
        <div className={styles.container}>
          <h1>User "{username}" not found.</h1>
        </div>
      );
    }

    // 2. Find the requested box
    const checkBox = userDoc.boxes?.find(
      (list: any) => list.id === boxName || list.name === boxName,
    );

    if (!checkBox) {
      return (
        <div className={styles.container}>
          <h1>Box "{boxName}" not found for this user.</h1>
        </div>
      );
    }

    // 3. Extract just the IDs we need to look up
    const targetIds = checkBox.pokemon.map((pkmn: any) => pkmn.id);

    // 4. Batch query ONLY the matching pokemon from MongoDB ($in is incredibly fast)
    const matchingPokedexData = (await Pokedex.find({
      id: { $in: targetIds },
    }).lean()) as any[];

    // 5. Create a fast Key-Value lookup map so we don't do nested loops
    const pokedexMap = new Map(
      matchingPokedexData.map((item) => [item.id, item]),
    );

    // 6. Merge the user's box items with the fetched metadata
    const expandedBox = {
      ...checkBox,
      pokemon: checkBox.pokemon.map((pkmn: any) => {
        const extraInfo = pokedexMap.get(pkmn.id) || {};
        return { ...pkmn, ...extraInfo };
      }),
    };

    // Safe serialization for Next.js Server Components
    const serializedBox = JSON.parse(JSON.stringify(expandedBox));

    return (
      <div className={styles.container}>
        <DynamicPokedexPage pokedex={serializedBox} />
      </div>
    );
  } catch (error) {
    console.error("Internal Server Error (CustomBoxTracker):", error);
    return (
      <div className={styles.container}>
        <h1>An error occurred while loading your Pokedex from the server.</h1>
      </div>
    );
  }
}
