import { connect } from "@/utils/dbConnect/dbConnect"
import Pokedex from "@/utils/schema/PokedexSchema"
import { NextResponse } from "next/server"

// Tell Next.js to generate this statically at build time
export const dynamic = 'force-static' 

export async function GET() {
    try {
        // Move the connection inside the handler so it triggers reliably during the build
        await connect()

        // Added .lean() to make the query 4x faster by skipping Mongoose overhead
        const pokedex = await Pokedex.find({ id: { $ne: "0670_05" } })
            .sort({ "dex.nationalDex": 1, id: 1 })
            .lean()

        return NextResponse.json({ success: true, data: pokedex })
    } catch (error) {
        return NextResponse.json({ success: false, message: `No data found. Error: ${error}` })
    }
}