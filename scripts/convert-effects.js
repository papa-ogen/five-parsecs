/**
 * Script to convert string effects to structured IEffect[] format
 * Usage: node scripts/convert-effects.js
 */

const fs = require('fs');
const path = require('path');

// Read the database file
const dbPath = path.join(__dirname, '../apps/api/src/database/db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

let effectIdCounter = 1;

/**
 * Parse a string effect and convert to IEffect object
 * @param {string} effectString - e.g. "+1 Savvy", "+2 XP", "-"
 * @returns {Array} - Array of IEffect objects
 */
function parseEffect(effectString) {
  if (!effectString || effectString === '-' || effectString === '.') {
    return [];
  }

  const effects = [];
  
  // Match patterns like "+1 Savvy", "+2 XP", "+1 Combat Skill", "+1 Luck"
  const regex = /([+\-]?\d+)\s+([A-Za-z\s]+)/g;
  let match;
  
  while ((match = regex.exec(effectString)) !== null) {
    const amount = parseInt(match[1]);
    const abilityName = match[2].trim().toLowerCase();
    
    // Map ability names to ISpeciesAbility property names
    let abilityId;
    switch (abilityName) {
      case 'savvy':
        abilityId = 'savvy';
        break;
      case 'combat skill':
      case 'combat':
        abilityId = 'combat';
        break;
      case 'reactions':
        abilityId = 'reactions';
        break;
      case 'toughness':
        abilityId = 'toughness';
        break;
      case 'speed':
        abilityId = 'speed';
        break;
      case 'luck':
        abilityId = 'luck';
        break;
      case 'xp':
        abilityId = 'xp';
        break;
      default:
        console.warn(`Unknown ability: ${abilityName}`);
        abilityId = abilityName.replace(/\s+/g, '_');
    }
    
    effects.push({
      id: (effectIdCounter++).toString(),
      abilityId: abilityId,
      amount: amount,
      description: effectString
    });
  }
  
  return effects;
}

/**
 * Convert effects in an array of objects
 */
function convertEffects(collection, collectionName) {
  let converted = 0;
  collection.forEach(item => {
    if (typeof item.effect === 'string') {
      const originalEffect = item.effect;
      item.effect = parseEffect(item.effect);
      converted++;
      console.log(`${collectionName} [${item.id}] "${item.name}": "${originalEffect}" -> `, JSON.stringify(item.effect));
    }
  });
  return converted;
}

// Convert all collections
console.log('Converting backgrounds...');
const backgroundsConverted = convertEffects(db.backgrounds, 'Background');

console.log('\nConverting motivations...');
const motivationsConverted = convertEffects(db.motivations, 'Motivation');

console.log('\nConverting characterClasses...');
const classesConverted = convertEffects(db.characterClasses, 'CharacterClass');

// Write back to database
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');

console.log(`\n✅ Conversion complete!`);
console.log(`   Backgrounds: ${backgroundsConverted} converted`);
console.log(`   Motivations: ${motivationsConverted} converted`);
console.log(`   Classes: ${classesConverted} converted`);
console.log(`   Total effects created: ${effectIdCounter - 1}`);
