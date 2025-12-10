
const express = require("express");
const router = express.Router();
const data = require("../controllers/data");

router.post("/vector",express.raw({type: "application/json"}), data.index);

router.get("/vector", data.index);

router.post("/load",express.raw({type: "application/json"}), data.loadData);

router.get("/load", data.loadData);


router.post("/text",express.raw({type: "application/json"}), data.toText);

router.get("/text", data.toText);


router.post("/file",express.raw({type: "application/json"}), data.loadFile);

router.get("/file", data.loadFile);




router.post("/classification",express.raw({type: "application/json"}), data.classificator);

router.get("/classification", data.classificator);

router.post("/retry",express.raw({type: "application/json"}), data.retry);

router.get("/retry", data.retry);

router.post("/search",express.raw({type: "application/json"}), data.search);

router.get("/search", data.search);

router.post("/request",express.raw({type: "application/json"}), data.request);

router.get("/request", data.request);

router.post("/web",express.raw({type: "application/json"}), data.input);

router.get("/web", data.input);

router.post("/whatss",express.raw({type: "application/json"}), data.whatss);

router.get("/whatss", data.whatss);

router.post("/open",express.raw({type: "application/json"}), data.openAI);

router.get("/open", data.openAI);

router.post("/deep",express.raw({type: "application/json"}), data.deepAI);

router.get("/deep", data.deepAI);

module.exports = router;