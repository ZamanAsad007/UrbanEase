const { dbConnection } = require('../config');
const bcrypt = require('bcryptjs');

async function upsertArea(name) {
  const [result] = await dbConnection.connection.execute(
    'INSERT INTO areas (name) VALUES (?) ON DUPLICATE KEY UPDATE name = VALUES(name)',
    [name]
  );

  if (result.insertId && result.insertId !== 0) return result.insertId;

  const [rows] = await dbConnection.connection.execute('SELECT id FROM areas WHERE name = ? LIMIT 1', [name]);
  return rows[0]?.id;
}

async function upsertUser({ name, email, passwordPlain, nid, area_id, role_id, status }) {
  const password = await bcrypt.hash(passwordPlain, 10);

  await dbConnection.connection.execute(
    `INSERT INTO users (name, email, password, nid, area_id, role_id, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       name = VALUES(name),
       password = VALUES(password),
       nid = VALUES(nid),
       area_id = VALUES(area_id),
       role_id = VALUES(role_id),
       status = VALUES(status)`,
    [name, email, password, nid, area_id, role_id, status]
  );

  const [rows] = await dbConnection.connection.execute('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
  return rows[0]?.id;
}

async function clearDemoPosts() {
  await dbConnection.connection.execute("DELETE FROM comments WHERE content LIKE '[DEMO] %'");
  await dbConnection.connection.execute("DELETE FROM posts WHERE title LIKE '[DEMO] %'");
}

async function insertPost({ area_id, user_id, title, description, status, location_url = null }) {
  const [result] = await dbConnection.connection.execute(
    `INSERT INTO posts (area_id, user_id, title, description, status, location_url)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [area_id, user_id, title, description, status, location_url]
  );
  return result.insertId;
}

async function insertComment({ post_id, user_id, content }) {
  const [result] = await dbConnection.connection.execute(
    `INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)` ,
    [post_id, user_id, content]
  );
  return result.insertId;
}

async function seedDemo() {
  const conn = await dbConnection.connection.getConnection();
  try {
    await conn.beginTransaction();

    // Use conn for transaction-scoped execution
    dbConnection.connection = conn;

    await clearDemoPosts();

    const dhanmondiId = await upsertArea('Dhanmondi');
    const mirpurId = await upsertArea('Mirpur');
    const uttaraId = await upsertArea('Uttara');

    // Create demo accounts (approved)
    const demoUserId = await upsertUser({
      name: 'Demo User',
      email: 'demo.user@urbanease.local',
      passwordPlain: 'user123',
      nid: 'NID-DEMO-USER-001',
      area_id: dhanmondiId,
      role_id: 3,
      status: 'approved'
    });

    const demoModId = await upsertUser({
      name: 'Demo Moderator',
      email: 'demo.mod@urbanease.local',
      passwordPlain: 'mod123',
      nid: 'NID-DEMO-MOD-001',
      area_id: mirpurId,
      role_id: 2,
      status: 'approved'
    });

    // Assign moderator to Mirpur
    await conn.execute('UPDATE areas SET moderator_user_id = ? WHERE id = ?', [demoModId, mirpurId]);

    // Insert demo posts
    const post1 = await insertPost({
      area_id: dhanmondiId,
      user_id: demoUserId,
      title: '[DEMO] Broken streetlight near Road 27',
      description: 'Streetlight has been off for 3 nights. The road is very dark.',
      status: 'pending',
      location_url: 'https://maps.google.com'
    });

    const post2 = await insertPost({
      area_id: dhanmondiId,
      user_id: demoUserId,
      title: '[DEMO] Garbage not collected',
      description: 'Waste has piled up for a week. Bad smell and stray dogs.',
      status: 'in_progress',
      location_url: 'https://maps.google.com'
    });

    const post3 = await insertPost({
      area_id: mirpurId,
      user_id: demoUserId,
      title: '[DEMO] Water leakage from main line',
      description: 'Continuous water leakage is damaging the road surface.',
      status: 'pending',
      location_url: 'https://maps.google.com'
    });

    const post4 = await insertPost({
      area_id: uttaraId,
      user_id: demoUserId,
      title: '[DEMO] Potholes near sector road',
      description: 'Multiple potholes causing traffic jams and accidents.',
      status: 'resolved',
      location_url: 'https://maps.google.com'
    });

    // Demo comments
    await insertComment({ post_id: post1, user_id: demoUserId, content: '[DEMO] Please fix this ASAP.' });
    await insertComment({ post_id: post2, user_id: demoModId, content: '[DEMO] Team notified and scheduled.' });
    await insertComment({ post_id: post3, user_id: demoModId, content: '[DEMO] Checking with water authority.' });

    await conn.commit();

    console.log('Demo seed completed successfully.');
    console.log('Demo accounts:');
    console.log('- User: demo.user@urbanease.local / user123');
    console.log('- Moderator: demo.mod@urbanease.local / mod123');
  } catch (error) {
    await conn.rollback();
    console.error('Failed to seed demo data:', error.message);
    process.exitCode = 1;
  } finally {
    conn.release();
  }
}

seedDemo();
