//IMPORT MONGOOSE
import mongoose, { Model } from "mongoose"

// CONNECTING TO MONGOOSE (Get Database Url from .env.local)
const { DATABASE_URL } = process.env

// connection function
export const connect = async () => {
  const conn = await mongoose
    .connect(DATABASE_URL as string)
    .catch(err => console.log(err))
  console.log("Mongoose Connection Established")

  // OUR POKEDEX SCHEMA
  const PokedexSchema = new mongoose.Schema({
id:String,
nationalDex: Number,
name: String,
hisuiDex: Number,
paldeaDex: Number,
stage: Number,
generation: Number,
generalForm: String,
uniqueForm: String,
formOrder: String,
type1: String,
type2: String,
genderDifference: Boolean,
homeAvailable: Boolean,
shinyAvailable: Boolean,
hasBaby: Boolean,
icon: String,
homePic: String,
homeShinyPic: String,
family: Array
  })

  // OUR TODO MODEL
  const Pokedex = mongoose.models.Pokedex || mongoose.model("Pokedex", PokedexSchema)

  return { conn, Pokedex }
  }