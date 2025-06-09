import mongoose from "mongoose";

const pokedexSchema = new mongoose.Schema({
    id: String,
    name: String,
    generalForm: String,
    uniqueForm: String,
    formOrder: String,
    data: {
      type1: String,
      type2: String,
      stage: Number,
      genderDifference: Boolean,
      hasBaby: Boolean,
      family: [Number]
    },
    dex: {
      generation: Number,
      nationalDex: Number,
      galarDex: Number,
      galarIoaDex: Number,
      galarCtDex: Number,
      hisuiDex: Number,
      paldeaDex: Number,
      paldeaTMDex: Number,
      paldeaBBDex: Number,
      svHomeAvailable: Boolean,
      swshHomeAvailable: Boolean
    },
    images: {
      icon: String,
      homeRender: String,
      homeShinyRender: String
    },
    availability: {
      homeDepositable: Boolean,
      shinyReleased: Boolean
    }
})

mongoose.pluralize(null)

const Pokedex = mongoose.models.pokedex || mongoose.model('pokedex', pokedexSchema)

export default Pokedex