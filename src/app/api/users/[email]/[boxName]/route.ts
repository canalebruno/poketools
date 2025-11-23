import { connect } from "@/utils/dbConnect/dbConnect"
import Users from "@/utils/schema/UsersSchema"
import { NextResponse } from "next/server"
import {
  User, List,
  Pokemon
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

export async function GET(request: Request ,{params}: Params) {
    const username = (await params).email
    const boxName = (await params).boxName

    try {
        const checkEmail: User = await Users.findOne({username})

        const checkBox = checkEmail.boxes.find(list => {return list.id === boxName})

        const fullPokedexResponse = await fetch(`http://localhost:3000/api/pokedex`)

        const fullPokedex = await fullPokedexResponse.json()

        const expandedBox = {...checkBox, pokemon: checkBox?.pokemon.map(pkmn => {
            const extraInfo = fullPokedex.data.find(full => {return full.id === pkmn.id})
            return {...pkmn, ...extraInfo}
        })}

        return NextResponse.json({success: true, data:expandedBox})
    } catch (error) {
        return NextResponse.json({success: false, message: `No data found. Error: ${error}`})
    }
}
