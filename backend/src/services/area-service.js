const { AreaRepository } = require('../repositories');

const areaRepo = new AreaRepository();

async function createArea(data) {
    return areaRepo.create(data);
}

async function listAreas() {
    return areaRepo.getAll();
}

async function assignModerator(areaId, moderatorUserId) {
    return areaRepo.assignModerator(areaId, moderatorUserId);
}

module.exports = {
    createArea,
    listAreas,
    assignModerator
};
