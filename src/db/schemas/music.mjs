import mongoose from "mongoose";

const musicSchema = new mongoose.Schema({
  slug: String,
  name: String,
  photo: String,
  sourceType: Number,
  source: String,
  howToGet: String,
  catalog: String,
});

const Music = mongoose.model("Music", musicSchema, "music");
export default Music;
