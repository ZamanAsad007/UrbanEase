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

module.exports = {
    createUser,
    getUser,
    findByEmail
};