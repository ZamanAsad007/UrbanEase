const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { serverConfig } = require('../config');
const { UserService } = require('../services');

async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'email and password are required' });
        }
        const user = await UserService.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        if (user.status !== 'approved') {
            return res.status(403).json({ message: 'Account not approved' });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign(
            { id: user.id, role_id: user.role_id, area_id: user.area_id },
            serverConfig.JWT_SECRET,
            { expiresIn: serverConfig.JWT_EXPIRES_IN }
        );
        return res.status(200).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role_id: user.role_id,
                area_id: user.area_id
            }
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    login
};
