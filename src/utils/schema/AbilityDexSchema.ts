import mongoose from "mongoose";

const AbilityDexSchema = new mongoose.Schema({
  id: Number,
  name: String,
  ability1:[String],
  ability2:[String],
  hiddenAbility:[String],
  notDepositable: Boolean
})

mongoose.pluralize(null)

const AbilityDex = mongoose.models.abilityDex || mongoose.model('abilityDex', AbilityDexSchema)

export default AbilityDex