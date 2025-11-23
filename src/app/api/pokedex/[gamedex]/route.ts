import { connect } from "@/utils/dbConnect/dbConnect"
import Pokedex from "@/utils/schema/PokedexSchema"
import { NextResponse } from "next/server"

connect()

type Params = {
    params: Promise<{gamedex: string}>
}

export async function GET(request: Request ,{params}: Params) {
    const gamedex = (await params).gamedex

    let filter = {}
    let sortOptions = {}

    switch(gamedex) {
        case "paldea":
            filter = {
                    'dex.paldeaDex': { $gte: 1 } 
            }
            sortOptions = {
                "dex.paldeaDex": 1, id: 1
            }
            break;
        case "paldeaBB":
            filter = {
                    'dex.paldeaBBDex': { $gte: 1 } 
            }
            sortOptions = {
                "dex.paldeaBBDex": 1, id: 1
            }
            break;
        case "paldeaTM":
            filter = {
                    'dex.paldeaTMDex': { $gte: 1 } 
            }
            sortOptions = {
                "dex.paldeaTMDex": 1, id: 1
            }
            break;
        case "lumiose":
            filter = {
                    'dex.zaLumioseDex': { $gte: 1 } 
            }
            sortOptions = {
                "dex.zaLumioseDex": 1, id: 1
            }
            break;
        case "hisui":
            filter = {
                    'dex.hisuiDex': { $gte: 1 } 
            }
            sortOptions = {
                "dex.hisuiDex": 1, id: 1
            }
            break;
        case "galar":
            filter = {
                    'dex.galarDex': { $gte: 1 } 
            }
            sortOptions = {
                "dex.galarDex": 1, id: 1
            }
            break;
        case "galarIoa":
            filter = {
                    'dex.galarIoaDex': { $gte: 1 } 
            }
            sortOptions = {
                "dex.galarIoaDex": 1, id: 1
            }
            break;
        case "galarCt":
            filter = {
                    'dex.galarCtDex': { $gte: 1 } 
            }
            sortOptions = {
                "dex.galarCtDex": 1, id: 1
            }
            break;
        case "homedex":
            filter = {
                    "availability.homeDepositable": true 
            }
            sortOptions = {
                "dex.nationalDex": 1, id: 1 
            }
            break;
        default:
            filter = {}
            sortOptions = {}
    }

    try {
        const pokedex = await Pokedex.find(filter).sort(sortOptions)

        return NextResponse.json({success: true, data:pokedex})
    } catch (error) {
        return NextResponse.json({success: false, message: `No data found. Error: ${error}`})
    }
}