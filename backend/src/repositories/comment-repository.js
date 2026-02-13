const CrudRepository = require('./crud-repository');

class CommentRepository extends CrudRepository {
    constructor() {
        super('comments');
    }

    async listByPost(postId) {
        const query = `
            SELECT c.*, u.name AS user_name
            FROM comments c
            JOIN users u ON u.id = c.user_id
            WHERE c.post_id = ?
            ORDER BY c.created_at ASC
        `;
        const [rows] = await this.connection.execute(query, [postId]);
        return rows;
    }
}

module.exports = CommentRepository;
