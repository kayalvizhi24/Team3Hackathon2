const db = require('../config/database');

// Get all scores (with pagination)
exports.getAllScores = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const [rows] = await db.query(
      'SELECT * FROM scores ORDER BY score DESC, created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    
    const [countResult] = await db.query('SELECT COUNT(*) as total FROM scores');
    const total = countResult[0].total;
    
    res.json({
      success: true,
      data: rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching scores',
      error: error.message
    });
  }
};

// Get top scores (leaderboard)
exports.getTopScores = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const [rows] = await db.query(
      'SELECT * FROM scores ORDER BY score DESC LIMIT ?',
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
      message: 'Error fetching top scores',
      error: error.message
    });
  }
};

// Add new score
exports.addScore = async (req, res) => {
  try {
    const { player_name, score, words_caught, duration } = req.body;
    
    const [result] = await db.query(
      'INSERT INTO scores (player_name, score, words_caught, duration) VALUES (?, ?, ?, ?)',
      [player_name || 'Anonymous', score, words_caught || 0, duration || 0]
    );
    
    res.status(201).json({
      success: true,
      message: 'Score saved successfully',
      id: result.insertId
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error saving score',
      error: error.message
    });
  }
};

// Get player's best score
exports.getPlayerBestScore = async (req, res) => {
  try {
    const { player_name } = req.params;
    
    const [rows] = await db.query(
      'SELECT * FROM scores WHERE player_name = ? ORDER BY score DESC LIMIT 1',
      [player_name]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No scores found for this player'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching player score',
      error: error.message
    });
  }
};