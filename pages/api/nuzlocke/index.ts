import { NextApiRequest, NextApiResponse } from "next"
import clientPromise from "../../../utils/mongodb";

async function nuzlockAPI (req: NextApiRequest, res: NextApiResponse)  {
  try {
    const client = await clientPromise;
    const db = client.db("pokedex");

    const locations = await db.collection("svlocations").find({}).toArray();

    res.json(locations);
  } catch (e: any) {
    console.error(e);
    throw new Error(e).message;
  }
};

export default nuzlockAPI