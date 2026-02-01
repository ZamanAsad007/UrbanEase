const CrudRepository = require('./crud-repository');

class CommentRepository extends CrudRepository {
    constructor() {
        super('comments');
    }

    async listByReport(reportId) {
        const query = 'SELECT * FROM comments WHERE report_id = ? ORDER BY created_at ASC';
        const [rows] = await this.connection.execute(query, [reportId]);
        return rows;
    }
}

module.exports = CommentRepository;
