let abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
let body = {};

// Constructor
abc.forEach((v, i) => {
    body[v] = i
    body[i] = v
})

// Export
module.exports = body