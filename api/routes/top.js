const express = require("express");
const router = express.Router();
const getTop = require("../plex/top");

const apicache = require("apicache");
const cache = apicache.middleware;

router.get("/movies", cache("1 day"), async (req, res) => {
  let data = await getTop(1);
  res.json(data);
});

router.get("/shows", cache("1 day"), async (req, res) => {
  let data = await getTop(2);
  res.json(data);
});

module.exports = router;
