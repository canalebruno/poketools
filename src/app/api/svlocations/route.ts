import { connect } from "@/utils/dbConnect/dbConnect"
import SVLocations from "@/utils/schema/SVLocationsSchema"
import { NextResponse } from "next/server"

connect()

export async function GET() {
    try {
        const svlocations = await SVLocations.find()

        return NextResponse.json({success: true, data:svlocations})
    } catch (error) {
        return NextResponse.json({success: false, message: `No data found. Error: ${error}`})
    }
}