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
}

module.exports = AreaRepository;
