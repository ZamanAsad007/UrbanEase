const CrudRepository = require('./crud-repository');

class PostRepository extends CrudRepository {
    constructor() {
        super('posts');
    }

    async listByArea(areaId) {
        const query = 'SELECT * FROM posts WHERE area_id = ? ORDER BY created_at DESC';
        const [rows] = await this.connection.execute(query, [areaId]);
        return rows;
    }

    async updateStatus(id, status) {
        const query = 'UPDATE posts SET status = ?, updated_at = NOW() WHERE id = ?';
        const [result] = await this.connection.execute(query, [status, id]);
        return result;
    }

    async listByUser(userId) {
        const query = 'SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC';
        const [rows] = await this.connection.execute(query, [userId]);
        return rows;
    }
}

module.exports = PostRepository;
