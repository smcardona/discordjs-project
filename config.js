require('dotenv').config;

module.exports = {
    "prefix": "!",
    // This is called ownersId bcz I used an alt for testing and stuff, now is just one ID
    "ownersId": [process.env.ownerId],
    "logChannelId": process.env.logChannelId
}