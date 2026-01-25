/**
 * Script to convert string-based amounts to structured dice notation
 * Usage: node scripts/convert-resources-v2.js
 */

const fs = require('fs');
const path = require('path');

// Read the database file
const dbPath = path.join(__dirname, '../apps/api/src/database/db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

let updateCount = 0;

/**
 * Parse an amount string and convert to number or IDiceRoll
 * @param {string} amountStr - e.g. "1", "+1", "1D6", "+2D6"
 * @returns {number | object} - Fixed number or IDiceRoll object
 */
function parseAmount(amountStr) {
  // Handle dice notation: "1D6", "+2D6", "2D6"
  const diceMatch = amountStr.match(/^([+\-]?)(\d*)D(\d+)([+\-]\d+)?$/i);
  if (diceMatch) {
    const sign = diceMatch[1] === '-' ? -1 : 1;
    const numDice = parseInt(diceMatch[2] || '1');
    const diceSize = parseInt(diceMatch[3]);
    const modifierMatch = diceMatch[4];
    
    const diceRoll = {
      numDice: numDice * sign,
      diceSize: diceSize
    };
    
    if (modifierMatch) {
      diceRoll.modifier = parseInt(modifierMatch);
    }
    
    return diceRoll;
  }
  
  // Handle fixed amounts: "1", "+1", "-1"
  const fixedMatch = amountStr.match(/^([+\-]?\d+)$/);
  if (fixedMatch) {
    return parseInt(fixedMatch[1]);
  }
  
  console.warn(`Could not parse amount: ${amountStr}`);
  return 1;
}

/**
 * Convert amounts in resource effects
 */
function convertResourceAmounts(collection, collectionName) {
  let converted = 0;
  collection.forEach(item => {
    if (Array.isArray(item.resources)) {
      item.resources.forEach(resource => {
        if (typeof resource.amount === 'string') {
          const originalAmount = resource.amount;
          resource.amount = parseAmount(resource.amount);
          converted++;
          console.log(
            `${collectionName} [${item.id}] "${item.name}" resource [${resource.resourceType}]: ` +
            `"${originalAmount}" -> `,
            JSON.stringify(resource.amount)
          );
        }
      });
    }
  });
  return converted;
}

// Convert all collections
console.log('Converting backgrounds...');
const backgroundsConverted = convertResourceAmounts(db.backgrounds, 'Background');

console.log('\nConverting motivations...');
const motivationsConverted = convertResourceAmounts(db.motivations, 'Motivation');

console.log('\nConverting characterClasses...');
const classesConverted = convertResourceAmounts(db.characterClasses, 'CharacterClass');

// Write back to database
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');

console.log(`\n✅ Conversion complete!`);
console.log(`   Backgrounds: ${backgroundsConverted} converted`);
console.log(`   Motivations: ${motivationsConverted} converted`);
console.log(`   Classes: ${classesConverted} converted`);
console.log(`   Total amounts converted: ${backgroundsConverted + motivationsConverted + classesConverted}`);
