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

async function updateMyName(userId, name) {
    return userRepo.updateNameWithCooldown(userId, name);
}

async function changeMyPassword(userId, oldPassword, newPassword) {
    const user = await userRepo.get(userId);
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
        const error = new Error('Old password is incorrect');
        error.statusCode = 400;
        throw error;
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    return userRepo.updatePasswordHash(userId, hashed);
}

async function updateMyAvatar(userId, profileImageUrl) {
    return userRepo.updateProfileImage(userId, profileImageUrl);
}

module.exports = {
    createUser,
    getUser,
    findByEmail,
    listPendingUsers,
    approveUser,
    rejectUser,
    createModerator,
    updateMyName,
    changeMyPassword,
    updateMyAvatar
};