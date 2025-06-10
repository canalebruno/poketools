import { connect } from "@/utils/dbConnect/dbConnect"
import Users from "@/utils/schema/UsersSchema"
import { NextResponse } from "next/server"

connect()

type Params = {
    params: Promise<{email: string}>
}

export async function GET(request: Request ,{params}: Params) {
    const email = (await params).email
    try {
        const checkEmail = await Users.findOne({email})
        
        return NextResponse.json({success: true, data:checkEmail})
    } catch (error) {
        return NextResponse.json({success: false, message: `No data found. Error: ${error}`})
    }
}

export async function DELETE(request: Request ,{params}: Params) {
    //_id
    const email = (await params).email
    console.log(email);

    try {
        await Users.findByIdAndDelete(email)


        return NextResponse.json({success: true, message:"User deleted."})
    } catch (error) {
        return NextResponse.json({success: false, message: `No data found. Error: ${error}`})
    }
}

export async function PUT(request: Request ,{params}: Params) {
    console.log("c");
    //_id
    const email = (await params).email
    const boxes = await request.json()

    try {
        await Users.findByIdAndUpdate(email,{boxes})

        return NextResponse.json({success: true, message:"Record deleted succesfully"})
    } catch (error) {
        return NextResponse.json({success: false, message: `No data found. Error: ${error}`})
    }
}