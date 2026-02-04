const bcrypt = require('bcryptjs');
const { UserRepository } = require('../repositories');

const userRepo = new UserRepository();

async function createUser(data) {
    const hashed = await bcrypt.hash(data.password, 10);
    const user = await userRepo.create({ ...data, password: hashed });
    return user;
}

async function getUser(id) {
    return userRepo.get(id);
}

async function findByEmail(email) {
    return userRepo.findByEmail(email);
}

async function listPendingUsers() {
    return userRepo.listPending();
}

async function approveUser(id) {
    return userRepo.approveUser(id);
}

async function rejectUser(id) {
    return userRepo.rejectUser(id);
}

async function createModerator(data) {
    const user = await createUser({ ...data, role_id: 2, status: 'approved' });
    return user;
}

module.exports = {
    createUser,
    getUser,
    findByEmail,
    listPendingUsers,
    approveUser,
    rejectUser,
    createModerator
};