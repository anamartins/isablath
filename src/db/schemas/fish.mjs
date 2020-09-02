import mongoose from "mongoose";

const fishSchema = new mongoose.Schema({
  id: Number,
  name: String,
  slug: String,
  icon: String,
  habitat: String,
  shadow: String,
  difficulty: String,
  north: [String],
  south: [String],
  description: String,
  catch: String,
  sellPrice: Number,
  critterpediaImage: String,
});

const Fish = mongoose.model("Fish", fishSchema);
export default Fish;
