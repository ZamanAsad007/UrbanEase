const { VoteRepository } = require('../repositories');

const voteRepo = new VoteRepository();

async function addVote(reportId, userId) {
    return voteRepo.addVote(reportId, userId);
}

async function removeVote(reportId, userId) {
    return voteRepo.removeVote(reportId, userId);
}

async function countVotes(reportId) {
    return voteRepo.countVotes(reportId);
}

module.exports = {
    addVote,
    removeVote,
    countVotes
};
