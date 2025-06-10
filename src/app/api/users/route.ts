import { connect } from "@/utils/dbConnect/dbConnect"
import Users from "@/utils/schema/UsersSchema"
import { NextResponse } from "next/server"

connect()

export async function GET() {
    try {
        const users = await Users.find()

        return NextResponse.json({success: true, data:users})
    } catch (error) {
        return NextResponse.json({success: false, message: `No data found. Error: ${error}`})
    }
}

export async function POST(request: Request) {
    const {username,email} = await request.json()
    
    try {
        const checkUsername = await Users.findOne({username})

        if(checkUsername) {
            return NextResponse.json({success: false, message: "The username is already taken."})
        }

        const newUser = new Users({username,email})

        await newUser.save()
        return NextResponse.json({success: true, message: "New user registered."})
    } catch (error) {
        return NextResponse.json({success: false, message: `Internal server error. Please try again later.Error: ${error}`})
    }
}