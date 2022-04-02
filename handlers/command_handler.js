const fs = require('fs');

module.exports = (client) => {
	console.log('Loading Commands...');
	const commandsList = [];
	fs.readdirSync('./commands').forEach((dir) => {
		const cmds = fs.readdirSync(`./commands/${dir}`).filter((file) => file.endsWith('.js'));
		commandsList.push(cmds.join(' <> '));

		for (let cmd of cmds) {
			let pull = require(`../commands/${dir}/${cmd}`);
			if (pull.name) {
				client.commands.set(pull.name, pull);
				console.log(`\n > ${pull.name} is Loaded! {`);
			} else {
				console.log(`\n !! An error ocurred in ${cmd} : [name]\n`);
				continue;
			}
			if (pull.aliases && Array.isArray(pull.aliases)) {
				let i = 1;
				pull.aliases.forEach((alias) => {
					client.aliases.set(alias, pull.name);
					console.log(`  Alias ${i}: ${alias}`); i++;
				});
			} else { console.log(`  Aliases: None`); };
			console.log(" }");
		};
	});
	console.log(`Commands loaded: ${commandsList.join(' <> ')}`);
};

