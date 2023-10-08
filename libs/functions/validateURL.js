const { URL } = require('url');

module.exports = function (url) {
  try {
    new URL(url);
    return true
  } catch (err) {
    return false
  }
}