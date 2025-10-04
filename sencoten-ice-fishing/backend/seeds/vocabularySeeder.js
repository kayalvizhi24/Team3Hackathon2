const db = require('../config/database');

const vocabulary = [
  { word: 'AXEN_', translation: 'to say', category: 'action' },
  { word: 'ÁSW̱', translation: 'seagull', category: 'animal' },
  { word: 'XPȺ', translation: 'fern', category: 'nature' },
  { word: 'BISEJ', translation: 'pinecone', category: 'nature' },
  { word: 'CEPU', translation: 'jacket', category: 'object' },
  { word: 'ĆESE', translation: 'two', category: 'number' },
  { word: 'ȻOSEN', translation: 'star', category: 'nature' },
  { word: 'DIL¸EḰ', translation: 'strawberry', category: 'food' },
  { word: 'ESE', translation: 'I', category: 'pronoun' },
  { word: 'HILEṈ', translation: 'fall off', category: 'action' },
  { word: 'IST', translation: 'deer', category: 'animal' },
  { word: 'JESḴEN', translation: 'raven', category: 'animal' },
  { word: 'KAKU', translation: 'bear', category: 'animal' },
  { word: 'KELEN', translation: 'ear', category: 'body' },
  { word: 'ḴAḴ', translation: 'baby', category: 'family' },
  { word: 'ḰOKEḰE', translation: 'drinking water', category: 'object' },
  { word: 'LOX̱ENE', translation: 'canadian goose', category: 'animal' },
  { word: 'ŁOBEN', translation: 'spoon', category: 'object' },
  { word: 'MUSMES', translation: 'cow', category: 'animal' },
  { word: 'NEȾE', translation: 'one', category: 'number' },
  { word: 'NOS', translation: 'number 4', category: 'number' },
  { word: 'OPEN', translation: 'number 10', category: 'number' },
  { word: 'PUS', translation: 'cat', category: 'animal' },
  { word: 'QESḴEḴ', translation: 'robin', category: 'animal' },
  { word: 'SŌL', translation: 'door', category: 'object' },
  { word: 'ŚÍPEN', translation: 'knife', category: 'object' },
  { word: 'TENEḴSEN', translation: 'hummingbird', category: 'animal' },
  { word: 'ŦOŦEN', translation: 'mouth', category: 'body' },
  { word: 'ṮEṮÁĆES', translation: 'island', category: 'nature' },
  { word: 'HEMU', translation: 'pigeon', category: 'animal' },
  { word: 'WEXES', translation: 'frog', category: 'animal' },
  { word: 'W̱ITEṈ', translation: 'jump', category: 'action' },
  { word: 'XŦEM', translation: 'chest', category: 'body' },
  { word: 'X̱I¸LEM', translation: 'rope', category: 'object' },
  { word: 'YEYOSEṈ', translation: 'play', category: 'action' }
];

async function seedVocabulary() {
  try {
    console.log('🌱 Seeding vocabulary...');
    
    // Clear existing vocabulary
    await db.query('DELETE FROM vocabulary');
    console.log('✓ Cleared existing vocabulary');
    
    // Insert vocabulary
    for (const word of vocabulary) {
      await db.query(
        'INSERT INTO vocabulary (word, translation, category) VALUES (?, ?, ?)',
        [word.word, word.translation, word.category]
      );
    }
    
    console.log(`✓ Successfully seeded ${vocabulary.length} words`);
    console.log('🎉 Vocabulary seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding vocabulary:', error);
    process.exit(1);
  }
}

seedVocabulary();