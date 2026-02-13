const CrudRepository = require('./crud-repository');

class PostUpvoteRepository extends CrudRepository {
  constructor() {
    super('post_upvotes');
  }

  async exists(postId, userId) {
    const query = 'SELECT 1 AS ok FROM post_upvotes WHERE post_id = ? AND user_id = ? LIMIT 1';
    const [rows] = await this.connection.execute(query, [postId, userId]);
    return rows.length > 0;
  }

  async add(postId, userId) {
    const query = 'INSERT INTO post_upvotes (post_id, user_id) VALUES (?, ?)';
    const [result] = await this.connection.execute(query, [postId, userId]);
    return result;
  }

  async remove(postId, userId) {
    const query = 'DELETE FROM post_upvotes WHERE post_id = ? AND user_id = ?';
    const [result] = await this.connection.execute(query, [postId, userId]);
    return result;
  }

  async countForPost(postId) {
    const query = 'SELECT COUNT(*) AS cnt FROM post_upvotes WHERE post_id = ?';
    const [rows] = await this.connection.execute(query, [postId]);
    return Number(rows?.[0]?.cnt || 0);
  }
}

module.exports = PostUpvoteRepository;
