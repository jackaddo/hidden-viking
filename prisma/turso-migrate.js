const { createClient } = require('@libsql/client');
const fs = require('fs');
const path = require('path');

const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

async function migrate() {
    console.log('Reading schema-utf8.sql...');
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema-utf8.sql'), 'utf8');

    console.log('Pushing schema to Turso...');
    try {
        const statements = schemaSql.split(';').map(s => s.trim()).filter(s => s.length > 0);

        for (const stmt of statements) {
            console.log(`Executing statement: ${stmt.substring(0, 50)}...`);
            await client.execute(stmt);
        }
        console.log('Schema pushed successfully!');

        console.log('Reading seed.sql...');
        const seedSql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
        const seedStatements = seedSql.split(';').map(s => s.trim()).filter(s => s.length > 0);

        console.log('Seeding initial data...');
        for (const stmt of seedStatements) {
            console.log(`Executing seed: ${stmt.substring(0, 50)}...`);
            await client.execute(stmt);
        }
        console.log('Seed data pushed successfully!');

    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    } finally {
        client.close();
    }
}

migrate();
