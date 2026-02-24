#!/usr/bin/env node

/**
 * Database setup script
 * Usage: node scripts/setupDatabase.js
 */

import { initializeDatabase, resetDatabase } from '../src/config/migrations.js';
import dbConfig from '../src/config/database.js';

const args = process.argv.slice(2);
const command = args[0];

try {
  if (command === 'reset') {
    console.log('🔄 Resetting database...\n');
    resetDatabase();
  } else {
    console.log('🚀 Setting up database...\n');
    initializeDatabase();
  }

  dbConfig.close();
  console.log('\n✅ Done!');
  process.exit(0);
} catch (error) {
  console.error('\n❌ Error:', error.message);
  dbConfig.close();
  process.exit(1);
}
