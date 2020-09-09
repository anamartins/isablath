import express from "express";
import mongoose from "mongoose";
import Villager from "./db/schemas/villager.mjs";
import Fish from "./db/schemas/fish.mjs";
import Insect from "./db/schemas/insect.mjs";
import SeaCreature from "./db/schemas/seaCreature.mjs";
import Music from "./db/schemas/music.mjs";
import cors from "cors";
import axios from "axios";

const app = express();
const port = 3000;

app.use(cors());

mongoose.connect("mongodb://localhost/isablat", { useNewUrlParser: true });
var db = mongoose.connection;
db.on(
  "error",
  console.error.bind(console, "my feathers, there's a connection error:")
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
    Villager.find(getQuery(req.query))
      .sort("name")
      .exec((err, villagers) => {
        if (err) return console.error(err);
        res.send(villagers);
      });
  } else {
    Villager.find({})
      .sort("name")
      .exec((err, villagers) => {
        if (err) return console.error(err);
        res.send(villagers);
      });
  }
});

app.get("/villagers/:slug", (req, res) => {
  Villager.findOne(
    {
      slug: req.params.slug,
    },
    (err, villager) => {
      if (err) return console.error(err);
      res.send(villager);
    }
  );
});

app.get("/fish", (req, res) => {
  if (Object.keys(req.query).length > 0) {
    Fish.find(getQuery(req.query))
      .sort("name")
      .exec((err, fish) => {
        if (err) return console.error(err);
        res.send(fish);
      });
  } else {
    Fish.find({})
      .sort("name")
      .exec((err, fish) => {
        if (err) return console.error(err);
        res.send(fish);
      });
  }
});

app.get("/fish/:slug", (req, res) => {
  Fish.findOne(
    {
      slug: req.params.slug,
    },
    (err, fish) => {
      if (err) return console.error(err);
      res.send(fish);
    }
  );
});

app.get("/insects", (req, res) => {
  if (Object.keys(req.query).length > 0) {
    Insect.find(getQuery(req.query))
      .sort("name")
      .exec((err, insect) => {
        if (err) return console.error(err);
        res.send(insect);
      });
  } else {
    Insect.find({})
      .sort("name")
      .exec((err, insect) => {
        if (err) return console.error(err);
        res.send(insect);
      });
  }
});

app.get("/insects/:slug", (req, res) => {
  Insect.findOne(
    {
      slug: req.params.slug,
    },
    (err, insect) => {
      if (err) return console.error(err);
      res.send(insect);
    }
  );
});

app.get("/sea-creatures", (req, res) => {
  if (Object.keys(req.query).length > 0) {
    SeaCreature.find(getQuery(req.query))
      .sort("name")
      .exec((err, seaCreature) => {
        if (err) return console.error(err);
        res.send(seaCreature);
      });
  } else {
    SeaCreature.find({})
      .sort("name")
      .exec((err, seaCreature) => {
        if (err) return console.error(err);
        res.send(seaCreature);
      });
  }
});

app.get("/sea-creatures/:slug", (req, res) => {
  SeaCreature.findOne(
    {
      slug: req.params.slug,
    },
    (err, seaCreature) => {
      if (err) return console.error(err);
      res.send(seaCreature);
    }
  );
});

app.get("/music", (req, res) => {
  if (Object.keys(req.query).length > 0) {
    Music.find(getQuery(req.query))
      .sort("name")
      .exec((err, music) => {
        if (err) return console.error(err);
        res.send(music);
      });
  } else {
    Music.find({})
      .sort("name")
      .exec((err, music) => {
        if (err) return console.error(err);
        res.send(music);
      });
  }
});

app.get("/music/:slug", (req, res) => {
  Music.findOne(
    {
      slug: req.params.slug,
    },
    (err, music) => {
      if (err) return console.error(err);
      res.send(music);
    }
  );
});

const HASHTAGS = "%23AnimalCrossing %23ACNH %23NintendoSwitch";

function getTweets(villager, maxId) {
  // while (tweetsResponse.length === 0 && next_resultsResponse !== null) {
  return axios
    .get(
      `https://api.twitter.com/1.1/search/tweets.json?max_id=${maxId}&q=${encodeURI(
        villager
      )} ${HASHTAGS} -filter:retweets`,
      {
        headers: {
          authorization: process.env.TWITTER_AUTH,
        },
      }
    )
    .then((resAxios) => {
      let tweets = resAxios.data.statuses.filter((item) =>
        item.text.includes(villager)
      );
      let nextResults = resAxios.data.search_metadata.next_results;
      return { tweets, nextResults };
    });
  // }
}

app.get("/tweets/:slug", (req, res) => {
  Villager.findOne(
    {
      slug: req.params.slug,
    },
    async (err, villager) => {
      if (err) return console.error(err);

      let validResponse = false;
      let tweets;
      let nextResults;
      let count = 0;
      while (!validResponse && count < 5) {
        const response = await getTweets(villager.name, req.query.max_id);
        tweets = response.tweets;
        nextResults = response.nextResults;
        validResponse =
          tweets.length !== 0 ||
          nextResults === undefined ||
          nextResults === null;
        count++;
      }

      res.json({
        tweets: tweets,
        villager,
        next_results: nextResults,
      });
    }
  );
});
