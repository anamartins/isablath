import mongoose from "mongoose";

const seaCreatureSchema = new mongoose.Schema({
  id: Number,
  name: String,
  icon: String,
  sellPrice: Number,
  speed: String,
  shadow: String,
  north: [String],
  south: [String],
  description: String,
  catch: String,
  lighting: String,
  slug: String,
  critterpediaImage: String,
});

const SeaCreature = mongoose.model(
  "SeaCreature",
  seaCreatureSchema,
  "sea_creatures"
  //the third argument is the collection name on mongo!
);
export default SeaCreature;
