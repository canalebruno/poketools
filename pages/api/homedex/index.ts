import { NextApiRequest, NextApiResponse } from "next"
import clientPromise from "../../../utils/mongodb";

async function homedexAPI (req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const db = client.db("pokedex");

    const posts = await db.collection("pokedex").find({"homeAvailable":true}).sort({"nationalDex":1,"id":1}).toArray();

    // res.json(posts);
    return posts
  } catch (e: any) {
    console.error(e);
    throw new Error(e).message;
  }
};

export default homedexAPI