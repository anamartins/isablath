import mongoose from "mongoose";

const villagerSchema = new mongoose.Schema({
  name: String,
  slug: String,
  species: String,
  gender: String,
  personality: String,
  birthday: String,
  birthdayDay: Number,
  birthdayMonth: Number,
  sunSign: String,
  catchphrase: String,
  icon: String,
  iconSource: Object,
  photo: String,
  photoSource: Object,
  poster: String,
});

const Villager = mongoose.model("Villager", villagerSchema);
export default Villager;
