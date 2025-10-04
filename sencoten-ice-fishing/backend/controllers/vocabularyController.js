const db = require('../config/database');

// Get all vocabulary words
exports.getAllVocabulary = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM vocabulary ORDER BY word');
    res.json({
      success: true,
      data: rows,
      count: rows.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching vocabulary',
      error: error.message
    });
  }
};

// Get random vocabulary set
exports.getRandomVocabulary = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const [rows] = await db.query(
      'SELECT * FROM vocabulary ORDER BY RAND() LIMIT ?',
      [limit]
    );
    res.json({
      success: true,
      data: rows,
      count: rows.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching random vocabulary',
      error: error.message
    });
  }
};

// Get vocabulary by ID
exports.getVocabularyById = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM vocabulary WHERE id = ?',
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vocabulary not found'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching vocabulary',
      error: error.message
    });
  }
};

// Add new vocabulary (admin function)
exports.addVocabulary = async (req, res) => {
  try {
    const { word, translation, category, difficulty } = req.body;
    
    const [result] = await db.query(
      'INSERT INTO vocabulary (word, translation, category, difficulty) VALUES (?, ?, ?, ?)',
      [word, translation, category, difficulty || 1]
    );
    
    res.status(201).json({
      success: true,
      message: 'Vocabulary added successfully',
      id: result.insertId
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding vocabulary',
      error: error.message
    });
  }
};