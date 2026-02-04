const { UserRepository } = require('../repositories');

const userRepo = new UserRepository();

async function createUser(data) {
    const user = await userRepo.create(data);
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

module.exports = {
    createUser,
    getUser,
    findByEmail,
    listPendingUsers,
    approveUser
};