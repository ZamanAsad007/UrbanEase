
const CrudRepository = require('./crud-repository');

class UserRepository extends CrudRepository {
	constructor() {
		super('users');
	}

	async findByEmail(email) {
		const query = 'SELECT * FROM users WHERE email = ? LIMIT 1';
		const [rows] = await this.connection.execute(query, [email]);
		return rows[0];
	}

	async listPending() {
		const query = "SELECT * FROM users WHERE status = 'pending' ORDER BY created_at DESC";
		const [rows] = await this.connection.execute(query);
		return rows;
	}

	async approveUser(id) {
		const query = "UPDATE users SET status = 'approved' WHERE id = ?";
		const [result] = await this.connection.execute(query, [id]);
		return result;
	}

	async rejectUser(id) {
		const query = "UPDATE users SET status = 'rejected' WHERE id = ?";
		const [result] = await this.connection.execute(query, [id]);
		return result;
	}

	async setRole(id, roleId) {
		const query = 'UPDATE users SET role_id = ? WHERE id = ?';
		const [result] = await this.connection.execute(query, [roleId, id]);
		return result;
	}
}

module.exports = UserRepository;

