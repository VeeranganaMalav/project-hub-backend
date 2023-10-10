const mongoose = require('mongoose');

const tokenBlacklistSchema = new mongoose.Schema({
  token: {
    type: String
  }
});

const TokenBlacklist = mongoose.model('tokenBlacklist', tokenBlacklistSchema);
module.exports = TokenBlacklist;