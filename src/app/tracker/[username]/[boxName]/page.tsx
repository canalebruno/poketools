import styles from "../../../styles/Home.module.scss";
import DynamicPokedexPage from "@/components/DynamicPokedexPage";
import { connect } from "@/utils/dbConnect/dbConnect";
import Users from "@/utils/schema/UsersSchema";
import Pokedex from "@/utils/schema/PokedexSchema"; //
import { Pokemon, User } from "@/utils/types";

interface PageParams {
  username: string;
  boxName: string;
}

// Forces Next.js to run this as a dynamic server-rendered page (ignores build-time caching)
export const dynamic = "force-dynamic";

export default async function CustomBoxTracker({
  params,
}: {
  params: Promise<PageParams>;
}) {
  // 1. Await and extract the dynamic URL parameters
  const { username, boxName } = await params;

  try {
    // 2. Open the direct connection to MongoDB
    await connect();

    // 3. Query the user document matching the username in the URL
    const userDoc = (await Users.findOne({ username }).lean()) as User | null;

    if (!userDoc) {
      return (
        <div className={styles.container}>
          <h1>User "{username}" not found.</h1>
        </div>
      );
    }

    // 4. Locate the specific box within the user's boxes array
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

    // 5. Query the full database collection using your Pokedex Mongoose model
    const fullPokedexData = (await Pokedex.find({}).lean()) as any[];

    // 6. Map through the box items and merge them safely with complete Pokedex metadata
    const expandedBox = {
      ...checkBox,
      pokemon: checkBox.pokemon.map((pkmn: any) => {
        const extraInfo = fullPokedexData.find((full) => full.id === pkmn.id);
        return { ...pkmn, ...extraInfo };
      }),
    };

    const serializedBox = JSON.parse(JSON.stringify(expandedBox));

    // 7. Pass the fully expanded array down to the client layout component
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
