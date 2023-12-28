import { NextApiRequest, NextApiResponse } from "next"
import clientPromise from "../../../utils/mongodb";

async function indigoDiskAPI (req: NextApiRequest, res: NextApiResponse)  {
  try {
    const client = await clientPromise;
    const db = client.db("pokedex");

    const posts = await db.collection("pokedex").find({"dex.paldeaBBDex":{$gte:1},"availability.homeDepositable": true}).sort({"dex.paldeaBBDex":1,"formOrder":1}).toArray();

    res.json(posts);
  } catch (e: any) {
    console.error(e);
    throw new Error(e).message;
  }
};

export default indigoDiskAPI