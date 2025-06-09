import { connect } from "@/utils/dbConnect/dbConnect"
import Users from "@/utils/schema/UsersSchema"
import { User } from "@/utils/types"
import { NextResponse } from "next/server"

connect()

type Params = {
    params: Promise<{email: string, boxName: string, customBoxId: string}>
}

export async function PUT(request: Request ,{params}: Params) {
    const email = (await params).email
    const boxName = (await params).boxName
    const customBoxId = (await params).customBoxId
    const { newCheck }  = await request.json()

    try {
         const updatedUser: User = await Users.findOneAndUpdate(
            {"email": email, "boxes.name": boxName},
            { $set: { "boxes.$[e1].pokemon.$[e2].isChecked": newCheck } },
            { arrayFilters: [{ "e1.name": boxName }, { "e2.customBoxId": customBoxId }], new: true }
        )
    
        return NextResponse.json({success: true, message:"Pokemon check updated.", updatedBox: updatedUser.boxes.find(b => {return b.name === boxName})})
} catch (error) {
        return NextResponse.json({success: false, message: `No data found. Error: ${error}`})
    }
}

export async function DELETE(request: Request ,{params}: Params) {
    const email = (await params).email
    const boxName = (await params).boxName
    const customBoxId = (await params).customBoxId

    try {
         const updatedUser: User = await Users.findOneAndUpdate(
            {"email": email, "boxes.name": boxName},
            { $pull: { "boxes.$[e1].pokemon": { "customBoxId": customBoxId } } },
            { arrayFilters: [{ "e1.name": boxName }], new: true }
        )
    
        return NextResponse.json({success: true, message:"Pokemon removed from the list.", updatedBox: updatedUser.boxes.find(b => {return b.name === boxName})})
} catch (error) {
        return NextResponse.json({success: false, message: `No data found. Error: ${error}`})
    }
}