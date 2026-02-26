const express = require("express");
const router = express.Router();
const personLookup = require("../tmdb/person");

const apicache = require("apicache");
const cache = apicache.middleware;

router.get("/lookup/:id", cache("1 day"), async (req, res) => {
  let data = await personLookup(req.params.id);
  res.json(data);
});

module.exports = router;
