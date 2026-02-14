const CrudRepository = require('./crud-repository');

class PostRepository extends CrudRepository {
    constructor() {
        super('posts');
    }

async listByArea(areaId, userId = null, status = null) {
        let statusCondition = "p.status = 'approved'";
        let params = [areaId];
        if (status) {
            if (status.includes(',')) {
                const statuses = status.split(',').map(s => s.trim());
                statusCondition = `p.status IN (${statuses.map(() => '?').join(',')})`;
                params = [areaId, ...statuses];
            } else {
                statusCondition = "p.status = ?";
                params = [areaId, status];
            }
        }
        const query = userId
            ? `
                SELECT p.*,
                    (SELECT COUNT(*) FROM post_upvotes pu WHERE pu.post_id = p.id) AS upvote_count,
                    EXISTS(
                        SELECT 1 FROM post_upvotes pu
                        WHERE pu.post_id = p.id AND pu.user_id = ?
                    ) AS upvoted_by_me
                FROM posts p
                WHERE p.area_id = ? AND ${statusCondition}
                ORDER BY p.created_at DESC
            `
            : `
                SELECT p.*,
                    (SELECT COUNT(*) FROM post_upvotes pu WHERE pu.post_id = p.id) AS upvote_count,
                    0 AS upvoted_by_me
                FROM posts p
                WHERE p.area_id = ? AND ${statusCondition}
                ORDER BY p.created_at DESC
            `;
        const finalParams = userId ? [userId, ...params] : params;
        const [rows] = await this.connection.execute(query, finalParams);
        return rows;
    }

        async getWithVotes(id, userId = null) {
                const query = userId
                        ? `
                                SELECT p.*,
                                    (SELECT COUNT(*) FROM post_upvotes pu WHERE pu.post_id = p.id) AS upvote_count,
                                    EXISTS(
                                        SELECT 1 FROM post_upvotes pu
                                        WHERE pu.post_id = p.id AND pu.user_id = ?
                                    ) AS upvoted_by_me
                                FROM posts p
                                WHERE p.id = ?
                                LIMIT 1
                            `
                        : `
                                SELECT p.*,
                                    (SELECT COUNT(*) FROM post_upvotes pu WHERE pu.post_id = p.id) AS upvote_count,
                                    0 AS upvoted_by_me
                                FROM posts p
                                WHERE p.id = ?
                                LIMIT 1
                            `;
                const params = userId ? [userId, id] : [id];
                const [rows] = await this.connection.execute(query, params);
                if (!rows[0]) throw new Error('Post not found');
                return rows[0];
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
