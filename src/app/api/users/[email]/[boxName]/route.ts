import { connect } from "@/utils/dbConnect/dbConnect"
import Users from "@/utils/schema/UsersSchema"
import { NextResponse } from "next/server"
import {
  User
} from "../../../../../utils/types";

connect()

type Params = {
    params: Promise<{email: string, boxName: string}>
}

export async function DELETE(request: Request ,{params}: Params) {
    const email = (await params).email
    const boxName = (await params).boxName

    try {
        const updatedUser: User = await Users.findOneAndUpdate(
            { "email": email },
            { $pull: { "boxes": { "name": boxName } } },
            { new: true }
        )
        

        return NextResponse.json({success: true, message:"Pokemon check updated.", updatedUser})
    } catch (error) {
        return NextResponse.json({success: false, message: `No data found. Error: ${error}`})
    }
}

export async function PUT(request: Request ,{params}: Params) {
    const email = (await params).email
    const boxName = (await params).boxName
    const { updatedBox }  = await request.json()

    try {
        const updatedUser: User = await Users.findOneAndUpdate(
            { "email": email },
            { $set: { "boxes.$[e1].pokemon": updatedBox } },
            { new: true, arrayFilters: [{ "e1.name": boxName }] }
        )
        
        return NextResponse.json({success: true, message:"Box updated.", updatedUser})
    } catch (error) {
        return NextResponse.json({success: false, message: `No data found. Error: ${error}`})
    }
}

export async function POST(request: Request ,{params}: Params) {
    const email = (await params).email
    const boxName = (await params).boxName
    const newPokemon  = await request.json()

    try {
        const updatedUser: User = await Users.findOneAndUpdate(
            { "email": email },
            { $push: { "boxes.$[e1].pokemon": newPokemon } },
            { new: true, arrayFilters: [{ "e1.name": boxName }] }
        )
        
        return NextResponse.json({success: true, message:"Box updated. Pokemon added.", updatedUser})
    } catch (error) {
        return NextResponse.json({success: false, message: `No data found. Error: ${error}`})
    }
}