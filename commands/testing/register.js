module.exports = {
  name: 'register',
  aliases: ['reg', 'newu'],
  description: 'Register a new user by creating his channel etc',
  minArgs: 2,
  maxArgs: null,
  expectedArgs: '[user] <guild>',
  requireRoles: ['staffID'],
  test: true,
  async execute({/* Needed args */ }) {
    // not now son
  }
};