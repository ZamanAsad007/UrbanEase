const { UserRepository } = require('../repositories');

const userRepo = new UserRepository();

async function createUser(data) {
    try {
        const user = await userRepo.create(data);
        return user
    } catch (error) {
        console.log(error)
    }
}


module.exports = {
    createUser
}