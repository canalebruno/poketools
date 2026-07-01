import { connect } from "@/utils/dbConnect/dbConnect"
import Users from "@/utils/schema/UsersSchema"
import { NextResponse } from "next/server"
import {
    Pokemon,
  User} from "../../../../../utils/types";

connect()

type Params = {
    params: Promise<{email: string, boxName: string}>
}

export async function DELETE(request: Request ,{params}: Params) {
    const email = (await params).email
    const boxName = (await params).boxName

    try {
        // 1. Accept that it could return User or null
        const updatedUser: User | null = await Users.findOneAndUpdate(
            { "email": email },
            { $pull: { "boxes": { "name": boxName } } },
            { new: true }
        )
        
        // 2. Add the safety check
        if (!updatedUser) {
            return NextResponse.json({ success: false, message: "User not found." }, { status: 404 })
        }
        
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
        const updatedUser: User | null = await Users.findOneAndUpdate(
            { "email": email },
            { $set: { "boxes.$[e1].pokemon": updatedBox } },
            { new: true, arrayFilters: [{ "e1.name": boxName }] }
        )

        if (!updatedUser) {
            return NextResponse.json({ success: false, message: "User not found." }, { status: 404 })
        }
        
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
        const updatedUser: User | null = await Users.findOneAndUpdate(
            { "email": email },
            { $push: { "boxes.$[e1].pokemon": newPokemon } },
            { new: true, arrayFilters: [{ "e1.name": boxName }] }
        )

        if (!updatedUser) {
            return NextResponse.json({ success: false, message: "User not found." }, { status: 404 })
        }
        
        return NextResponse.json({success: true, message:"Box updated. Pokemon added.", updatedUser})
    } catch (error) {
        return NextResponse.json({success: false, message: `No data found. Error: ${error}`})
    }
}

export async function GET(request: Request, { params }: Params) {
    // 1. Unpack parameters cleanly matching your folder names
    const { email, boxName } = await params;

    try {
        const checkEmail: User | null = await Users.findOne({ email });

        if (!checkEmail) {
            return NextResponse.json({ success: false, message: `User with email ${email} not found.` }, { status: 404 });
        }

        const checkBox = checkEmail.boxes.find(list => list.id === boxName);

        // 5. Prevent crashing if the specific box name doesn't exist
        if (!checkBox) {
            return NextResponse.json({ success: false, message: `Box "${boxName}" not found for this user.` }, { status: 404 });
        }

        // 6. Fetch full Pokedex details
        const fullPokedexResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/pokedex`);
        const fullPokedex = await fullPokedexResponse.json();

        // 7. Map details cleanly
        const expandedBox = {
            ...checkBox,
            pokemon: checkBox.pokemon.map(pkmn => {
                const extraInfo = fullPokedex.data.find((full: Pokemon) => full.id === pkmn.id);
                return { ...pkmn, ...extraInfo };
            })
        };

        return NextResponse.json({ success: true, data: expandedBox });
        
    } catch (error) {
        return NextResponse.json({ success: false, message: `Server Error: ${error}` }, { status: 500 });
    }
}
