const fs = require('fs');

module.exports = async (client) => {
	let events;

	const loadEvents = (dirs) => {
		fs.readdirSync(`./events/${dirs}`).forEach((file) => {
			events = fs.readdirSync(`./events/${dirs}`).filter((file) => file.endsWith('.js'));

			fs.readdir('./events/', (err, files) => {
				if (err) {
					return console.error(err);
				}
				const event = require(`../events/${dirs}/${file}`); // requires the file as a external func
				events = file.split('.')[0]; // 'file.js' => 'file'
				client.on(events, event.bind(null, client)); // binds both functions with the client parameter
			});
		});
	};
	['bot', 'guild'].forEach((e) => loadEvents(e));
};
