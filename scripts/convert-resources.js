/**
 * Script to convert string resources to structured IResourceEffect[] format
 * Usage: node scripts/convert-resources.js
 */

const fs = require('fs');
const path = require('path');

// Read the database file
const dbPath = path.join(__dirname, '../apps/api/src/database/db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

let resourceIdCounter = 1;

/**
 * Parse a string resource and convert to IResourceEffect object
 * @param {string} resourceString - e.g. "+1D6 credits", "Patron, +1 story point", "2 Quest Rumors"
 * @returns {Array} - Array of IResourceEffect objects
 */
function parseResource(resourceString) {
  if (!resourceString || resourceString === '-' || resourceString === '.') {
    return [];
  }

  const resources = [];
  
  // Split by comma for multiple resources
  const parts = resourceString.split(',').map(s => s.trim());
  
  parts.forEach(part => {
    // Match patterns like:
    // "+1D6 credits", "1D6 credits", "+2D6 credits"
    // "+1 story point", "Patron", "2 Quest Rumors"
    // "Rival"
    
    // Pattern 1: Dice roll with resource type (e.g., "+1D6 credits", "2D6 credits")
    let match = part.match(/^([+\-]?\d*[dD]\d+)\s+(.+)$/i);
    if (match) {
      const amount = match[1].replace(/^([+\-]?)(.+)$/, '$1$2').toUpperCase();
      const resourceName = match[2].trim().toLowerCase();
      
      resources.push({
        id: (resourceIdCounter++).toString(),
        resourceType: mapResourceName(resourceName),
        amount: amount,
        description: part
      });
      return;
    }
    
    // Pattern 2: Number with resource type (e.g., "+1 story point", "2 Quest Rumors")
    match = part.match(/^([+\-]?\d+)\s+(.+)$/);
    if (match) {
      const amount = match[1];
      const resourceName = match[2].trim().toLowerCase();
      
      resources.push({
        id: (resourceIdCounter++).toString(),
        resourceType: mapResourceName(resourceName),
        amount: amount,
        description: part
      });
      return;
    }
    
    // Pattern 3: Just a resource name (e.g., "Patron", "Rival")
    const resourceName = part.trim().toLowerCase();
    if (resourceName) {
      resources.push({
        id: (resourceIdCounter++).toString(),
        resourceType: mapResourceName(resourceName),
        amount: '1',
        description: part
      });
    }
  });
  
  return resources;
}

/**
 * Map resource names to ResourceType enum values
 */
function mapResourceName(name) {
  const normalized = name.toLowerCase().replace(/\s+/g, '');
  
  if (normalized.includes('credit')) return 'credits';
  if (normalized.includes('storypoint') || normalized.includes('story')) return 'storyPoints';
  if (normalized.includes('reputation')) return 'reputation';
  if (normalized.includes('patron')) return 'patrons';
  if (normalized.includes('rival')) return 'rivals';
  if (normalized.includes('questrumor') || normalized.includes('quest')) return 'questRumors';
  if (normalized.includes('rumor')) return 'rumor';
  
  console.warn(`Unknown resource type: ${name}`);
  return name;
}

/**
 * Convert resources in an array of objects
 */
function convertResources(collection, collectionName) {
  let converted = 0;
  collection.forEach(item => {
    if (typeof item.resources === 'string') {
      const originalResource = item.resources;
      item.resources = parseResource(item.resources);
      converted++;
      console.log(`${collectionName} [${item.id}] "${item.name}": "${originalResource}" -> `, JSON.stringify(item.resources));
    }
  });
  return converted;
}

// Convert all collections
console.log('Converting backgrounds...');
const backgroundsConverted = convertResources(db.backgrounds, 'Background');

console.log('\nConverting motivations...');
const motivationsConverted = convertResources(db.motivations, 'Motivation');

console.log('\nConverting characterClasses...');
const classesConverted = convertResources(db.characterClasses, 'CharacterClass');

// Write back to database
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');

console.log(`\n✅ Conversion complete!`);
console.log(`   Backgrounds: ${backgroundsConverted} converted`);
console.log(`   Motivations: ${motivationsConverted} converted`);
console.log(`   Classes: ${classesConverted} converted`);
console.log(`   Total resources created: ${resourceIdCounter - 1}`);
