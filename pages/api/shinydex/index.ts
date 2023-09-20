import { NextApiRequest, NextApiResponse } from "next"
import clientPromise from "../../../utils/mongodb";

async function shinydexAPI (req: NextApiRequest, res: NextApiResponse)  {
  try {
    const client = await clientPromise;
    const db = client.db("pokedex");

    const posts = await db.collection("pokedex").find({"images.homeShinyRender":{$ne:null}}).sort({"dex.nationalDex":1,"id":1}).toArray();

    res.json(posts);
  } catch (e: any) {
    console.error(e);
    throw new Error(e).message;
  }
};

export default shinydexAPI