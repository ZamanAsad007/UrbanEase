const { ReportService, VoteService } = require('../services');

async function createReport(req, res) {
    try {
        const { user_id, title, description, photo_url, location, visibility } = req.body;
        if (!user_id || !title || !description) {
            return res.status(400).json({ message: 'user_id, title, description are required' });
        }
        const result = await ReportService.createReport({
            user_id,
            title,
            description,
            photo_url: photo_url || null,
            location: location || null,
            visibility: visibility || 'public',
            status: 'pending'
        });
        return res.status(201).json({ id: result.insertId });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function listReports(req, res) {
    try {
        const { visibility, status } = req.query;
        const reports = await ReportService.listReports({ visibility, status });
        return res.status(200).json(reports);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function getReport(req, res) {
    try {
        const report = await ReportService.getReport(req.params.id);
        const votes = await VoteService.countVotes(req.params.id);
        return res.status(200).json({ ...report, votes });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

async function updateStatus(req, res) {
    try {
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ message: 'status is required' });
        }
        await ReportService.updateReportStatus(req.params.id, status);
        return res.status(200).json({ message: 'Status updated' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createReport,
    listReports,
    getReport,
    updateStatus
};
