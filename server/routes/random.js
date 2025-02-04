const express = require('express');
const router = express.Router();
const pool = require('../db');
const analytics = require('../analytics.js');

// Gets a random line from the database
router.get('/random', async (req, res) => {
    analytics.track({
        event: 'Get random line',
        userId: 'anonymous',
    })
    try {
        const quote = await pool.query(
            "SELECT season, episode, character, line FROM lines OFFSET floor(random() * (SELECT COUNT(*) FROM lines))"
        )
        res.json(quote.rows[0]);
    }
    catch (err) {
        res.status(500).send('Server error');
    }
});

// Gets a random quote from a random character given season and episode
router.get("/seasons/:season/episodes/:episode/random", async (req, res) => {
    analytics.track({
        event: 'Get random line from given season and episode',
        userId: 'anonymous',
    })
    try {
        const { season, episode } = req.params;
        const seasonNum = parseInt(season);
        const episodeNum = parseInt(episode);
        const quote = await pool.query(
            "SELECT character, line FROM lines WHERE season = $1 AND episode = $2 OFFSET floor(random() * (SELECT COUNT(*) FROM lines WHERE season = $1 AND episode = $2)) ",
            [seasonNum, episodeNum]
        );
        res.json(quote.rows[0]);
    }
    catch (err) {
        console.error(err);
    }
})

// Gets a random quote from given character
router.get("/characters/:character/random", async (req, res) => {
    analytics.track({
        event: 'Get random line from given character',
        userId: 'anonymous',
    })
    try {
        const { character } = req.params;
        const characterName = character.charAt(0).toUpperCase() + character.slice(1);
        const quote = await pool.query(
            "SELECT season, episode, line FROM lines WHERE character = $1 OFFSET floor(random() * (SELECT COUNT(*) FROM lines WHERE character = $1))",
            [characterName]
        );
        res.json(quote.rows[0]);
    }
    catch (err) {
        console.error(err);
    }
})

// Gets a random quote from given season
router.get("/seasons/:season/random", async (req, res) => {
    analytics.track({
        event: 'Get random line from given season',
        userId: 'anonymous',
    })
    try {
        const { season } = req.params;
        const seasonNum = parseInt(season);
        const quote = await pool.query(
            "SELECT season, episode, character, line FROM lines WHERE season = $1 OFFSET floor(random() * (SELECT COUNT(*) FROM lines WHERE season = $1)) ",
            [seasonNum]
        );
        res.json(quote.rows[0]);
    }
    catch (err) {
        console.error(err);
    }
})

// Gets a random quote from given season and character
router.get("/seasons/:season/characters/:character/random", async (req, res) => {
    analytics.track({
        event: 'Get random line from given season and character',
        userId: 'anonymous',
    })
    try {
        const { season, character } = req.params;
        const seasonNum = parseInt(season);
        const characterName = character.charAt(0).toUpperCase() + character.slice(1);
        const quote = await pool.query(
            "SELECT episode, line FROM lines WHERE season = $1 AND character = $2 OFFSET floor(random() * (SELECT COUNT(*) FROM lines WHERE season = $1 AND character = $2)) ",
            [seasonNum, characterName]
        );
        res.json(quote.rows[0]);
    }
    catch (err) {
        console.error(err);
    }
})

// Gets random quote from given season, episode, and character
router.get("/seasons/:season/episodes/:episode/characters/:character/random", async (req, res) => {
    analytics.track({
        event: 'Get random line from given season, episode, and character',
        userId: 'anonymous',
    })
    try {
        const { season, episode, character } = req.params;
        const seasonNum = parseInt(season);
        const episodeNum = parseInt(episode);
        const characterName = character.charAt(0).toUpperCase() + character.slice(1);
        const quote = await pool.query(
            "SELECT line FROM lines WHERE season = $1 AND episode = $2 AND character = $3 OFFSET floor(random() * (SELECT COUNT(*) FROM lines WHERE season = $1 AND episode = $2 AND character = $3)) ",
            [seasonNum, episodeNum, characterName]
        );
        res.json(quote.rows[0]);
    }
    catch (err) {
        console.error(err);
    }
})

// Gets a random line from random episode in given season
router.get("/seasons/:season/random", async (req, res) => {
    analytics.track({
        event: 'Get random line from random character in given season',
        userId: 'anonymous',
    })
    try {
        const { season } = req.params;
        const script = await pool.query("SELECT character, line FROM lines WHERE season = $1 OFFSET floor(random() * (SELECT COUNT(*) FROM lines WHERE season = $1))",
            [season]
        )
        res.json(script.rows)
    }
    catch (err) {
        console.error(err);
    }
})

module.exports = router;