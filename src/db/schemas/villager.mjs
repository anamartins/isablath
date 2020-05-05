import mongoose from "mongoose";

const villagerSchema = new mongoose.Schema({
  name: String,
  species: String,
  gender: String,
  personality: String,
  birthday: String,
  birthdayDay: String,
  birthdayMonth: String,
  catchphrase: String,
  icon: String,
});

const Villager = mongoose.model("Villager", villagerSchema);
export default Villager;
