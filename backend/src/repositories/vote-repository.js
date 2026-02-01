const CrudRepository = require('./crud-repository');

class VoteRepository extends CrudRepository {
    constructor() {
        super('report_votes');
    }

    async addVote(reportId, userId) {
        const query = 'INSERT IGNORE INTO report_votes (report_id, user_id) VALUES (?, ?)';
        const [result] = await this.connection.execute(query, [reportId, userId]);
        return result;
    }

    async removeVote(reportId, userId) {
        const query = 'DELETE FROM report_votes WHERE report_id = ? AND user_id = ?';
        const [result] = await this.connection.execute(query, [reportId, userId]);
        return result;
    }

    async countVotes(reportId) {
        const query = 'SELECT COUNT(*) as total FROM report_votes WHERE report_id = ?';
        const [rows] = await this.connection.execute(query, [reportId]);
        return rows[0]?.total || 0;
    }
}

module.exports = VoteRepository;
