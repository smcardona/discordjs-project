require('dotenv').config()

module.exports = {
	"prefix": "!",
	"logChannelID": process.env.LogChannelId,
	"OwnersID": [
		process.env.OwnerId,
		process.env.CoOwnerId
	]
}