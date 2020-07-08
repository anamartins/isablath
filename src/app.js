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

      //
      // axios
      //   .get(
      //     `https://api.twitter.com/1.1/search/tweets.json?max_id=${
      //       req.query.max_id
      //     }&q=${encodeURI(villager.name)} ${HASHTAGS} -filter:retweets`,
      //     {
      //       headers: {
      //         authorization: process.env.TWITTER_AUTH,
      //       },
      //     }
      //   )
      //   .then((resAxios) => {
      //     let tweetsResponse = resAxios.data.statuses.filter((item) =>
      //       item.text.includes(villager.name)
      //     );
      //     let next_resultsResponse = resAxios.data.search_metadata.next_results;

      //     if (tweetsResponse.length === 0 && next_resultsResponse !== null) {
      //       //chama de novo!
      //     } else {
      //       res.json({
      //         tweets: tweetsResponse,
      //         villager,
      //         next_results: next_resultsResponse,
      //       });
      //     }
      //   });
      //
    }
  );
});
