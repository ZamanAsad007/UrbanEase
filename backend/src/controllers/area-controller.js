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
        const include_placeholder = String(req.query.include_placeholder || '').toLowerCase();
        const includePlaceholder = include_placeholder === '1' || include_placeholder === 'true';
        const areas = await AreaService.listAreas({ includePlaceholder });
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

async function deleteArea(req, res) {
    try {
        const areaId = Number(req.params.id);
        if (!areaId) {
            return res.status(400).json({ message: 'Invalid area id' });
        }
        if (areaId === 1) {
            return res.status(400).json({ message: 'Cannot delete the placeholder area' });
        }
        await AreaService.deleteArea(areaId);
        return res.status(200).json({ message: 'Area deleted' });
    } catch (error) {
        const msg = String(error.message || 'Failed to delete area');
        if (msg.toLowerCase().includes('cannot delete area')) {
            return res.status(400).json({ message: msg });
        }
        if (msg.toLowerCase().includes('not found')) {
            return res.status(404).json({ message: msg });
        }
        return res.status(500).json({ message: msg });
    }
}

module.exports = {
    createArea,
    listAreas,
    assignModerator,
    deleteArea
};
