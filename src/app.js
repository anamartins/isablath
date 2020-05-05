import express from "express";
import mongoose from "mongoose";
import Villager from "./db/schemas/villager.mjs";

const app = express();
const port = 3000;

mongoose.connect("mongodb://localhost/isablat", { useNewUrlParser: true });
var db = mongoose.connection;
db.on(
  "error",
  console.error.bind(console, "my fathers, there's a connection error:")
);
db.once("open", function () {
  console.log("yes, yes, we're connected.");
});

app.get("/", (req, res) => res.send("Isabelle & Blathers API"));

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);

function capitalize(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function getQuery(query) {
  let keys = Object.keys(query);
  let values = Object.values(query);
  let object = {};
  for (let i = 0; i < keys.length; i++) {
    object[keys[i]] = capitalize(values[i]);
  }
  return object;
}

app.get("/villagers", (req, res) => {
  if (Object.keys(req.query).length > 0) {
    Villager.find(getQuery(req.query), (err, villagers) => {
      if (err) return console.error(err);
      res.send(villagers);
    });
  } else {
    Villager.find((err, villagers) => {
      if (err) return console.error(err);
      res.send(villagers);
    });
  }
});

app.get("/villagers/:name", (req, res) => {
  Villager.findOne(
    {
      name: capitalize(req.params.name),
    },
    (err, villager) => {
      if (err) return console.error(err);
      res.send(villager);
    }
  );
});
