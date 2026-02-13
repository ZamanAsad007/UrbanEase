
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

	async updateNameWithCooldown(userId, name) {
		const query = `
			UPDATE users
			SET name = ?, name_updated_at = NOW()
			WHERE id = ?
			AND (name_updated_at IS NULL OR name_updated_at <= DATE_SUB(NOW(), INTERVAL 30 DAY))
		`;
		const [result] = await this.connection.execute(query, [name, userId]);
		return result;
	}

	async updatePasswordHash(userId, passwordHash) {
		const query = 'UPDATE users SET password = ?, password_updated_at = NOW() WHERE id = ?';
		const [result] = await this.connection.execute(query, [passwordHash, userId]);
		return result;
	}

	async updateProfileImage(userId, profileImageUrl) {
		const query = 'UPDATE users SET profile_image_url = ? WHERE id = ?';
		const [result] = await this.connection.execute(query, [profileImageUrl, userId]);
		return result;
	}
}

module.exports = UserRepository;

