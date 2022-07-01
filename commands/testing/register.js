module.exports = {
    name: 'register',
    aliases: ['reg', 'newu'],
    description: 'Register a new user by creating his channel etc',
    guildOnly: false,
    OnlyOwner: false,
    minArgs: 2,
    maxArgs: null,
    mentionChannels: false,
    mentionUsers: false,
    expectedArgs: '[user] <guild>',
    permissions: [],
    requireRoles: ['staffID'],
    test: true,
    async execute({/* Needed args */ }) {
        // not now son
    }
};