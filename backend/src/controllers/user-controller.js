const { UserService } = require('../services');

async function registerUser(req, res) {
	try {
		const { name, email, password, area_id, nid } = req.body;
		if (!name || !email || !password || !nid) {
			return res.status(400).json({ message: 'name, email, password, nid are required' });
		}
		const existing = await UserService.findByEmail(email);
		if (existing) {
			return res.status(409).json({ message: 'User already exists' });
		}
		const result = await UserService.createUser({
			name,
			email,
			password,
			nid,
			area_id: area_id || 1,
			role_id: 3,
			status: 'pending'
		});
		return res.status(201).json({ id: result.insertId, status: 'pending' });
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
}

async function getUser(req, res) {
	try {
		const user = await UserService.getUser(req.params.id);
		const { password, ...safeUser } = user;
		return res.status(200).json(safeUser);
	} catch (error) {
		return res.status(404).json({ message: error.message });
	}
}

async function listPendingUsers(req, res) {
	try {
		const users = await UserService.listPendingUsers();
		const safeUsers = users.map(({ password, ...rest }) => rest);
		return res.status(200).json(safeUsers);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
}

async function approveUser(req, res) {
	try {
		await UserService.approveUser(req.params.id);
		return res.status(200).json({ message: 'User approved' });
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
}

async function rejectUser(req, res) {
	try {
		await UserService.rejectUser(req.params.id);
		return res.status(200).json({ message: 'User rejected' });
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
}

async function createModerator(req, res) {
	try {
		const { name, email, password, area_id, nid } = req.body;
		if (!name || !email || !password || !area_id || !nid) {
			return res.status(400).json({ message: 'name, email, password, area_id, nid are required' });
		}
		const existing = await UserService.findByEmail(email);
		if (existing) {
			return res.status(409).json({ message: 'User already exists' });
		}
		const result = await UserService.createModerator({
			name,
			email,
			password,
			nid,
			area_id
		});
		return res.status(201).json({ id: result.insertId, role: 'moderator' });
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
}

module.exports = {
	registerUser,
	getUser,
	listPendingUsers,
	approveUser,
	rejectUser,
	createModerator
};
