const { UserService } = require('../services');

async function createUser(req, res) {
	try {
		const { name, email, role } = req.body;
		if (!name || !email) {
			return res.status(400).json({ message: 'name and email are required' });
		}
		const existing = await UserService.findByEmail(email);
		if (existing) {
			return res.status(409).json({ message: 'User already exists' });
		}
		const result = await UserService.createUser({ name, email, role: role || 'resident' });
		return res.status(201).json({ id: result.insertId });
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
}

async function getUser(req, res) {
	try {
		const user = await UserService.getUser(req.params.id);
		return res.status(200).json(user);
	} catch (error) {
		return res.status(404).json({ message: error.message });
	}
}

module.exports = {
	createUser,
	getUser
};
