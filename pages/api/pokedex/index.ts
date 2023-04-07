import { NextApiRequest, NextApiResponse } from "next"
import clientPromise from "../../../utils/mongodb";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const client = await clientPromise;
    const db = client.db("pokedex");

    const pokemon = await db.collection("pokedex").find({}).toArray();

    res.json(pokemon);
  } catch (e: any) {
    console.error(e);
    throw new Error(e).message;
  }
};