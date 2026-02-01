
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
}

module.exports = UserRepository;

