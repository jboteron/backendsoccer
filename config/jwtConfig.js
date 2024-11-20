require('dotenv').config();

module.exports = {
    secret: process.env.JWT_SECRET || 'tu_secreto_para_jwt',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
};
