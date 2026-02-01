const { ReportRepository } = require('../repositories');

const reportRepo = new ReportRepository();

async function createReport(data) {
    return reportRepo.create(data);
}

async function listReports(filters) {
    return reportRepo.list(filters);
}

async function getReport(id) {
    return reportRepo.get(id);
}

async function updateReportStatus(id, status) {
    return reportRepo.updateStatus(id, status);
}

module.exports = {
    createReport,
    listReports,
    getReport,
    updateReportStatus
};
