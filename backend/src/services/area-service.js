const { AreaRepository } = require('../repositories');

const areaRepo = new AreaRepository();

async function createArea(data) {
    return areaRepo.create(data);
}

async function listAreas({ includePlaceholder = false } = {}) {
    const areas = await areaRepo.getAll();
    if (includePlaceholder) return areas;
    return areas.filter((a) => {
        const name = String(a?.name || '').toLowerCase();
        return Number(a?.id) !== 1 && name !== 'unassigned' && name !== 'dhaka';
    });
}

async function assignModerator(areaId, moderatorUserId) {
    return areaRepo.assignModerator(areaId, moderatorUserId);
}

module.exports = {
    createArea,
    listAreas,
    assignModerator
};
