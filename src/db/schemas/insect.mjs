import mongoose from "mongoose";

const insectSchema = new mongoose.Schema({
  id: Number,
  name: String,
  slug: String,
  icon: String,
  habitat: String,
  weather: String,
  north: [String],
  south: [String],
  description: String,
  catch: String,
  sellPrice: Number,
  critterpediaImage: String,
});

const Insect = mongoose.model("Insect", insectSchema);
export default Insect;
