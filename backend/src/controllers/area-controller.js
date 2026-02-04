const { AreaService } = require('../services');

async function createArea(req, res) {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'name is required' });
        }
        const result = await AreaService.createArea({ name });
        return res.status(201).json({ id: result.insertId });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function listAreas(req, res) {
    try {
        const areas = await AreaService.listAreas();
        return res.status(200).json(areas);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function assignModerator(req, res) {
    try {
        const { moderator_user_id } = req.body;
        if (!moderator_user_id) {
            return res.status(400).json({ message: 'moderator_user_id is required' });
        }
        await AreaService.assignModerator(req.params.id, moderator_user_id);
        return res.status(200).json({ message: 'Moderator assigned' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createArea,
    listAreas,
    assignModerator
};
