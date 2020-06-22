import express from "express";
import mongoose from "mongoose";
import Villager from "./db/schemas/villager.mjs";
import cors from "cors";
import axios from "axios";

const app = express();
const port = 3000;

app.use(cors());

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

app.get("/villagers/:slug", (req, res) => {
  Villager.findOne(
    {
      // name: capitalize(req.params.name),
      slug: req.params.slug,
    },
    (err, villager) => {
      if (err) return console.error(err);
      res.send(villager);
    }
  );
});

const HASHTAGS = "%23AnimalCrossing %23ACNH %23NintendoSwitch";

app.get("/tweets/:slug", (req, res) => {
  const slug = req.params.slug;
  Villager.findOne(
    {
      // name: capitalize(name),
      slug: req.params.slug,
    },
    (err, villager) => {
      console.log("vil", villager);
      if (err) return console.error(err);
      axios
        .get(
          `https://api.twitter.com/1.1/search/tweets.json?max_id=${
            req.query.max_id
          }&q=${encodeURI(villager.name)} ${HASHTAGS}`,
          {
            headers: {
              authorization: process.env.TWITTER_AUTH,
            },
          }
        )
        .then((resAxios) => {
          res.json({
            tweets: resAxios.data.statuses,
            villager,
            next_results: resAxios.data.search_metadata.next_results,
          });
        });
    }
  );
});
