import { connect } from "@/utils/dbConnect/dbConnect"
import Pokedex from "@/utils/schema/PokedexSchema"
import { NextResponse } from "next/server"

connect()

export async function GET() {
    try {
        const pokedex = await Pokedex.find({id:{$ne:"0670_05"}}).sort({"dex.nationalDex": 1, id: 1})

        return NextResponse.json({success: true, data:pokedex})
    } catch (error) {
        return NextResponse.json({success: false, message: `No data found. Error: ${error}`})
    }
}