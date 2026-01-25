/**
 * Script to convert string startingRolls to structured IStartingItem[] format
 * Usage: node scripts/convert-starting-rolls.js
 */

const fs = require('fs');
const path = require('path');

// Read the database file
const dbPath = path.join(__dirname, '../apps/api/src/database/db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

let itemIdCounter = 1;

/**
 * Parse a string starting roll and convert to IStartingItem object
 * @param {string} rollString - e.g. "+1 Military Weapon", "+1 Gear", "+1 Gadget"
 * @returns {Array} - Array of IStartingItem objects
 */
function parseStartingRoll(rollString) {
  if (!rollString || rollString === '-' || rollString === '.') {
    return [];
  }

  const items = [];
  
  // Split by comma for multiple items
  const parts = rollString.split(',').map(s => s.trim());
  
  parts.forEach(part => {
    // Match patterns like:
    // "+1 Military Weapon", "1 Military Weapon"
    // "+1 Low-tech Weapon", "1 Low-tech Weapon"
    // "+1 High-tech Weapon"
    // "+1 Gear", "+1 Gadget", "+1 Armor"
    
    const match = part.match(/^([+\-]?\d+)\s+(.+)$/);
    if (!match) {
      console.warn(`Could not parse starting roll: ${part}`);
      return;
    }
    
    const amount = parseInt(match[1]);
    const itemDesc = match[2].trim().toLowerCase();
    
    let itemType;
    let subtype;
    
    // Determine item type and subtype
    if (itemDesc.includes('weapon')) {
      itemType = 'weapon';
      
      if (itemDesc.includes('military')) {
        subtype = 'military';
      } else if (itemDesc.includes('low-tech') || itemDesc.includes('lowtech')) {
        subtype = 'lowTech';
      } else if (itemDesc.includes('high-tech') || itemDesc.includes('hightech')) {
        subtype = 'highTech';
      } else {
        subtype = 'any';
      }
    } else if (itemDesc.includes('gear')) {
      itemType = 'gear';
    } else if (itemDesc.includes('gadget')) {
      itemType = 'gadget';
    } else if (itemDesc.includes('armor')) {
      itemType = 'armor';
    } else {
      console.warn(`Unknown item type: ${itemDesc}`);
      itemType = itemDesc.replace(/\s+/g, '_');
    }
    
    const item = {
      id: (itemIdCounter++).toString(),
      itemType: itemType,
      amount: amount,
      description: part
    };
    
    // Only add subtype for weapons
    if (subtype) {
      item.subtype = subtype;
    }
    
    items.push(item);
  });
  
  return items;
}

/**
 * Convert starting rolls in an array of objects
 */
function convertStartingRolls(collection, collectionName) {
  let converted = 0;
  collection.forEach(item => {
    if (typeof item.startingRolls === 'string') {
      const originalRoll = item.startingRolls;
      item.startingRolls = parseStartingRoll(item.startingRolls);
      converted++;
      console.log(
        `${collectionName} [${item.id}] "${item.name}": "${originalRoll}" -> `,
        JSON.stringify(item.startingRolls)
      );
    }
  });
  return converted;
}

// Convert all collections
console.log('Converting backgrounds...');
const backgroundsConverted = convertStartingRolls(db.backgrounds, 'Background');

console.log('\nConverting motivations...');
const motivationsConverted = convertStartingRolls(db.motivations, 'Motivation');

console.log('\nConverting characterClasses...');
const classesConverted = convertStartingRolls(db.characterClasses, 'CharacterClass');

// Write back to database
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');

console.log(`\n✅ Conversion complete!`);
console.log(`   Backgrounds: ${backgroundsConverted} converted`);
console.log(`   Motivations: ${motivationsConverted} converted`);
console.log(`   Classes: ${classesConverted} converted`);
console.log(`   Total starting items created: ${itemIdCounter - 1}`);
