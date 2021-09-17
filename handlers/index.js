const homeHandler = require('./home.js');
const staticFiles = require('./static-files.js');
const catHandler = require('./cat.js');

module.exports = [homeHandler, staticFiles, catHandler];
