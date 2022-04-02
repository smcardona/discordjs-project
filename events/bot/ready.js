module.exports = (client) => {
	console.log(`\n¡Bot online as: ${client.user.username}!`);
	client.user.setActivity(`In progress`, { type: 'WATCHING' });
};
//types => "PLAYING", "WATCHING", "LISTENING", "STREAMING"
