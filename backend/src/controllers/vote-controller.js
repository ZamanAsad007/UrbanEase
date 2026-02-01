const { VoteService } = require('../services');

async function upvote(req, res) {
    try {
        const { user_id } = req.body;
        if (!user_id) {
            return res.status(400).json({ message: 'user_id is required' });
        }
        await VoteService.addVote(req.params.id, user_id);
        const total = await VoteService.countVotes(req.params.id);
        return res.status(200).json({ votes: total });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function removeUpvote(req, res) {
    try {
        const { user_id } = req.body;
        if (!user_id) {
            return res.status(400).json({ message: 'user_id is required' });
        }
        await VoteService.removeVote(req.params.id, user_id);
        const total = await VoteService.countVotes(req.params.id);
        return res.status(200).json({ votes: total });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    upvote,
    removeUpvote
};
