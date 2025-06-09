import mongoose from "mongoose";

const SVLocationsSchema = new mongoose.Schema({
  id: Number,
  name: String,
  general: [String],
  scarlet: [String],
  violet: [String],
})

const SVLocations = mongoose.models.svlocations || mongoose.model('svlocations', SVLocationsSchema)

export default SVLocations