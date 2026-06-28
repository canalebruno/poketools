import styles from "../../../styles/Home.module.scss";
import DynamicPokedexPage from "@/components/DynamicPokedexPage";

interface PageParams {
  email: string;
  boxName: string;
}

export default async function CustomBoxTracker({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { email, boxName } = await params;

  const res = await fetch(
    `${process.env.BASE_URL}/api/users/${email}/${boxName}`,
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.error(
      `Fetch failed with status ${res.status}.`,
      errorText.slice(0, 300),
    );
    throw new Error(
      `Failed to fetch pokedex: Server returned status ${res.status}`,
    );
  }

  const data = await res.json();
  const resolvedDex = data.data;

  return (
    <div className={styles.container}>
      {/* Just pass the data down safely */}
      <DynamicPokedexPage pokedex={resolvedDex} />
    </div>
  );
}
