const { dbConnection } = require('../config');

async function tableExists(tableName) {
  const query = `
    SELECT COUNT(*) AS cnt
    FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = ?
  `;
  const [rows] = await dbConnection.connection.execute(query, [tableName]);
  return Number(rows?.[0]?.cnt || 0) > 0;
}

async function columnExists(tableName, columnName) {
  const query = `
    SELECT COUNT(*) AS cnt
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = ?
      AND COLUMN_NAME = ?
  `;
  const [rows] = await dbConnection.connection.execute(query, [tableName, columnName]);
  return Number(rows?.[0]?.cnt || 0) > 0;
}

async function addColumnIfMissing(tableName, columnName, alterSql) {
  const exists = await columnExists(tableName, columnName);
  if (exists) {
    console.log(`OK: ${tableName}.${columnName} already exists`);
    return;
  }
  console.log(`Adding: ${tableName}.${columnName}`);
  await dbConnection.connection.execute(alterSql);
  console.log(`Added: ${tableName}.${columnName}`);
}

async function migrate() {
  try {
    await addColumnIfMissing(
      'users',
      'profile_image_url',
      'ALTER TABLE users ADD COLUMN profile_image_url VARCHAR(500) NULL'
    );

    await addColumnIfMissing(
      'users',
      'name_updated_at',
      'ALTER TABLE users ADD COLUMN name_updated_at TIMESTAMP NULL'
    );

    await addColumnIfMissing(
      'users',
      'password_updated_at',
      'ALTER TABLE users ADD COLUMN password_updated_at TIMESTAMP NULL'
    );

    const upvoteTable = await tableExists('post_upvotes');
    if (!upvoteTable) {
      console.log('Creating: post_upvotes table');
      await dbConnection.connection.execute(`
        CREATE TABLE IF NOT EXISTS post_upvotes (
          id INT AUTO_INCREMENT PRIMARY KEY,
          post_id INT NOT NULL,
          user_id INT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE KEY uniq_post_user (post_id, user_id),
          FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);
      console.log('Created: post_upvotes table');
    } else {
      console.log('OK: post_upvotes table already exists');
    }

    console.log('Database migration completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Database migration failed:', error.message);
    process.exit(1);
  }
}

migrate();
