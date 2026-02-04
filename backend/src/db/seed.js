const fs = require('fs');
const path = require('path');
const { dbConnection } = require('../config');

async function seed() {
    try {
        const seedPath = path.join(__dirname, 'seed.sql');
        const sql = fs.readFileSync(seedPath, 'utf8');
        const statements = sql
            .split(/;\s*\n/)
            .map((statement) => statement.trim())
            .filter(Boolean);

        for (const statement of statements) {
            await dbConnection.connection.execute(statement);
        }

        console.log('Database seed completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Failed to seed database:', error.message);
        process.exit(1);
    }
}

seed();
