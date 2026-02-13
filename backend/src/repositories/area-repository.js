const CrudRepository = require('./crud-repository');

class AreaRepository extends CrudRepository {
    constructor() {
        super('areas');
    }

    async assignModerator(areaId, moderatorUserId) {
        const query = 'UPDATE areas SET moderator_user_id = ? WHERE id = ?';
        const [result] = await this.connection.execute(query, [moderatorUserId, areaId]);
        return result;
    }

    async deleteAreaAndReassignUsers(areaId) {
        const conn = await this.connection.getConnection();
        try {
            await conn.beginTransaction();

            const [areaRows] = await conn.execute('SELECT id FROM areas WHERE id = ? LIMIT 1', [areaId]);
            if (!areaRows || areaRows.length === 0) {
                throw new Error('Area not found');
            }

            const [postCountRows] = await conn.execute(
                'SELECT COUNT(*) AS count FROM posts WHERE area_id = ?',
                [areaId]
            );
            const postCount = Number(postCountRows?.[0]?.count || 0);
            if (postCount > 0) {
                throw new Error('Cannot delete area with existing posts');
            }

            // Reassign all users (including moderators) to placeholder area_id=1 to satisfy FK RESTRICT
            await conn.execute('UPDATE users SET area_id = 1 WHERE area_id = ?', [areaId]);

            const [deleteRes] = await conn.execute('DELETE FROM areas WHERE id = ? AND id <> 1', [areaId]);
            if (deleteRes.affectedRows === 0) {
                throw new Error('Area not found');
            }

            await conn.commit();
            return deleteRes;
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    }
}

module.exports = AreaRepository;
