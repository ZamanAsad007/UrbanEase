const fs = require('fs');
const path = require('path');
const { dbConnection } = require('../config');

async function init() {
    try {
        const schemaPath = path.join(__dirname, 'schema.sql');
        const sql = fs.readFileSync(schemaPath, 'utf8');
        const statements = sql
            .split(/;\s*\n/)
            .map((statement) => statement.trim())
            .filter(Boolean);

        for (const statement of statements) {
            await dbConnection.connection.execute(statement);
        }

        console.log('Database schema created/updated successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Failed to initialize database:', error.message);
        process.exit(1);
    }
}

init();
