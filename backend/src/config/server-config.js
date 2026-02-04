const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET || 'change_this_secret',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d'
}