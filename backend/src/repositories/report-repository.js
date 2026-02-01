const CrudRepository = require('./crud-repository');

class ReportRepository extends CrudRepository {
    constructor() {
        super('reports');
    }

    async list(filters = {}) {
        const conditions = [];
        const values = [];

        if (filters.visibility) {
            conditions.push('visibility = ?');
            values.push(filters.visibility);
        }

        if (filters.status) {
            conditions.push('status = ?');
            values.push(filters.status);
        }

        const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
        const query = `SELECT * FROM reports ${whereClause} ORDER BY created_at DESC`;
        const [rows] = await this.connection.execute(query, values);
        return rows;
    }

    async updateStatus(id, status) {
        const query = 'UPDATE reports SET status = ?, updated_at = NOW() WHERE id = ?';
        const [result] = await this.connection.execute(query, [status, id]);
        return result;
    }
}

module.exports = ReportRepository;
