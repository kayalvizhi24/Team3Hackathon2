const express = require('express');
const router = express.Router();
const scoreController = require('../controllers/scoreController');

// GET /api/scores - Get all scores
router.get('/', scoreController.getAllScores);

// GET /api/scores/top - Get top scores (leaderboard)
router.get('/top', scoreController.getTopScores);

// GET /api/scores/player/:player_name - Get player's best score
router.get('/player/:player_name', scoreController.getPlayerBestScore);

// POST /api/scores - Add new score
router.post('/', scoreController.addScore);

module.exports = router;