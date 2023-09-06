import { NextApiRequest, NextApiResponse } from "next"
import clientPromise from "../../../utils/mongodb";

async function tealmaskdexAPI (req: NextApiRequest, res: NextApiResponse)  {
  try {
    const client = await clientPromise;
    const db = client.db("pokedex");

    const posts = await db.collection("pokedex").find({"paldeaTMDex":{$gte:1}}).sort({"paldeaTMDex":1,"formOrder":1}).toArray();

    res.json(posts);
  } catch (e: any) {
    console.error(e);
    throw new Error(e).message;
  }
};

export default tealmaskdexAPI