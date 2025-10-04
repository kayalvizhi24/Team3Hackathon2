const express = require('express');
const router = express.Router();
const vocabularyController = require('../controllers/vocabularyController');

// GET /api/vocabulary - Get all vocabulary
router.get('/', vocabularyController.getAllVocabulary);

// GET /api/vocabulary/random - Get random vocabulary set
router.get('/random', vocabularyController.getRandomVocabulary);

// GET /api/vocabulary/:id - Get vocabulary by ID
router.get('/:id', vocabularyController.getVocabularyById);

// POST /api/vocabulary - Add new vocabulary
router.post('/', vocabularyController.addVocabulary);

module.exports = router;