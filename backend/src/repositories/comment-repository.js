const CrudRepository = require('./crud-repository');

class CommentRepository extends CrudRepository {
    constructor() {
        super('comments');
    }

    async listByPost(postId) {
        const query = 'SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC';
        const [rows] = await this.connection.execute(query, [postId]);
        return rows;
    }
}

module.exports = CommentRepository;
