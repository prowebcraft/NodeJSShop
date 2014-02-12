/**
 * Конфигурационный модуль на основе nconf
 * Created by InTheWeb on 10.02.14.
 */
var nconf = require('nconf');

nconf.argv()
    .env()
    .file({ file: './config.json' });

module.exports = nconf;
