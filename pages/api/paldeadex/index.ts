import { NextApiRequest, NextApiResponse } from "next"
import clientPromise from "../../../utils/mongodb";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const client = await clientPromise;
    const db = client.db("pokedex");

    const posts = await db.collection("pokedex").find({"paldeaDex":{$gte:1}}).sort({"paldeaDex":1,"formOrder":1}).toArray();

    res.json(posts);
  } catch (e: any) {
    console.error(e);
    throw new Error(e).message;
  }
};