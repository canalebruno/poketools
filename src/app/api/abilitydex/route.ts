import { connect } from "@/utils/dbConnect/dbConnect"
import AbilityDex from "@/utils/schema/AbilityDexSchema"
import { NextResponse } from "next/server"

connect()

export async function GET() {
    try {
        const abilityDex = await AbilityDex.find().limit(10)

        return NextResponse.json({success: true, data:abilityDex})
    } catch (error) {
        return NextResponse.json({success: false, message: `No data found. Error: ${error}`})
    }
}